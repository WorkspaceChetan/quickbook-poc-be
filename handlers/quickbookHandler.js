const express = require("express");
const OAuthClient = require("intuit-oauth");
const router = express.Router();
const fs = require("fs");

const Account = require("../db/models/account");
const Vendor = require("../db/models/vendor");
const SyncConfig = require("../db/models/config");
const Token = require("../db/models/token");

const companyID = "4620816365298496430";
const minorversion = 65;

let oauthClient = new OAuthClient({
  clientId: process.env.INTUIT_CLIENT_ID,
  clientSecret: process.env.INTUIT_CLIENT_SECRET,
  environment: "sandbox",
  redirectUri: "http://localhost:5000/qb/callback",
});

router.get("/test", (req, res) => {
  res.status(200).json({});
});

router.get("/authUri", (_, res) => {
  const authUri = oauthClient.authorizeUri({
    scope: [OAuthClient.scopes.Accounting],
    state: "intuit-test",
  });
  res.redirect(authUri);
});

router.get("/callback", async (req, res) => {
  try {
    const authResponse = await oauthClient.createToken(req.url);

    const fulltoken = authResponse.getJson();

    const tokenRecord = await Token.create({
      tokenid: fulltoken.refresh_token,
      fulltoken: JSON.stringify(fulltoken),
    });

    return res.redirect(`http://localhost:3000?tokenid=${tokenRecord.tokenid}`);
  } catch (error) {
    res.status(400).json({
      message: error.message,
      trace: error.stack,
    });
    return;
  }
});

router.get("/refresh_token", async (req, res) => {
  const { tokenid } = req.query;
  const tokenRecord = await Token.findOne({ where: { tokenid } });

  if (tokenRecord === null) {
    return res.status(200).json({
      isError: true,
      message: "token not found",
    });
  }

  oauthClient.getToken().setToken(JSON.parse(tokenRecord.fulltoken));

  const authResponse = await oauthClient.refresh();

  const newfulltoken = authResponse.getJson();

  const newTokenRecord = await Token.create({
    tokenid: newfulltoken.refresh_token,
    fulltoken: JSON.stringify(newfulltoken),
  });

  tokenRecord.destroy();

  return res.status(200).json({
    isError: false,
    token: newTokenRecord.tokenid,
  });
});

router.get("/retrieveToken", async (req, res) => {
  const { tokenid } = req.headers;
  const tokenRecord = await Token.findOne({ where: { tokenid } });

  if (tokenRecord === null) {
    return res.status(200).json({
      isError: true,
      message: "token not found",
    });
  }

  oauthClient.getToken().setToken(JSON.parse(tokenRecord.fulltoken));
  res.send(oauthClient.getToken().getToken());
});

const checkHeader = async (req, res, next) => {
  const { tokenid } = req.headers;
  const tokenRecord = await Token.findOne({ where: { tokenid } });

  if (tokenRecord === null) {
    return res.status(200).json({
      isError: true,
      message: "token not found",
    });
  }

  oauthClient.getToken().setToken(JSON.parse(tokenRecord.fulltoken));
  next();
};

router.get("/sync", checkHeader, async (req, res) => {
  const { tbl, id } = req.query;
  try {
    const url =
      oauthClient.environment == "sandbox"
        ? OAuthClient.environment.sandbox
        : OAuthClient.environment.production;

    const syncConfig = await SyncConfig.findOne({ where: { tblname: tbl } });

    if (syncConfig === null) {
      return res.status(200).json({
        isError: true,
        message: "Invalid parameter config not found for the table name.",
      });
    }

    let tblRecord;

    switch (tbl) {
      case "account": {
        tblRecord = await Account.findByPk(id);
        break;
      }
      case "vendor": {
        tblRecord = await Vendor.findByPk(id);
        break;
      }

      default: {
        return res.status(200).json({
          isError: true,
          message: "Invalid parameter config not found for the table name.",
        });
      }
    }

    if (tblRecord === null) {
      return res.status(200).json({
        isError: true,
        message: "Invalid parameter record not found for the id.",
      });
    }

    let fullUrl = url + syncConfig.syncUrl;

    fullUrl = fullUrl.replace("##companyId##", companyID);
    fullUrl = fullUrl.replace("##minorVersion##", minorversion);

    const { content } = tblRecord;
    const resp = await oauthClient.makeApiCall({
      method: "POST",
      url: fullUrl,
      body: JSON.parse(content),
    });

    switch (tbl) {
      case "account": {
        tblRecord.content = JSON.stringify(resp.json.Account);
        break;
      }
      case "vendor": {
        tblRecord.content = JSON.stringify(resp.json.Vendor);
        break;
      }
    }

    await tblRecord.save();

    return res.status(200).json({
      isError: false,
      message: "Success",
    });
  } catch (error) {
    return res.status(200).json({
      message: error.message,
      trace: error.stack,
      isError: true,
    });
  }
});

module.exports = router;
