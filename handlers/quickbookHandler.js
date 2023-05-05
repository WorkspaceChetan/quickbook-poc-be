const express = require("express");
const OAuthClient = require("intuit-oauth");
const router = express.Router();
const fs = require("fs");

const Token = require("../db/models/token");

let oauthClient = new OAuthClient({
  clientId: process.env.INTUIT_CLIENT_ID,
  clientSecret: process.env.INTUIT_CLIENT_SECRET,
  environment: "sandbox",
  redirectUri: process.env.Back_URL + "/qb/callback",
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

    return res.redirect(
      `${process.env.FRONT_URL}?tokenid=${tokenRecord.tokenid}`
    );
  } catch (error) {
    res.status(400).json({
      message: error.message,
      trace: error.stack,
    });
    return;
  }
});

const checkHeader = async (req, res, next) => {
  try {
    const tokenid = req.headers.authorization;

    const tokenRecord = await Token.findOne({ where: { tokenid } });

    if (tokenRecord === null) {
      return res.status(200).json({
        isError: true,
        message: "token not found",
      });
    }

    oauthClient.getToken().setToken(JSON.parse(tokenRecord.fulltoken));

    if (!oauthClient.getToken().isRefreshTokenValid()) {
      tokenRecord.destroy();

      return res.status(200).json({
        isError: true,
        message: "token not found",
      });
    }

    if (!oauthClient.getToken().isAccessTokenValid()) {
      const authResponse = await oauthClient.refresh();

      const newfulltoken = authResponse.getJson();

      oauthClient.getToken().setToken(newfulltoken.fulltoken);

      await Token.create({
        tokenid: newfulltoken.refresh_token,
        fulltoken: JSON.stringify(newfulltoken),
      });

      tokenRecord.destroy();
    }

    next();
  } catch (error) {
    return res.status(200).json({
      isError: true,
      message: error.message,
      error,
    });
  }
};

router.post("/sync", checkHeader, async (req, res) => {
  const { method, syncUrl, postbody } = req.body;
  try {
    const url =
      oauthClient.environment == "sandbox"
        ? OAuthClient.environment.sandbox
        : OAuthClient.environment.production;

    let fullUrl = url + syncUrl;

    const resp = await oauthClient.makeApiCall({
      method: method,
      url: fullUrl,
      body: postbody,
    });

    return res.status(200).json({
      isError: false,
      data: resp.json,
      message: "",
    });
  } catch (error) {
    return res.status(200).json({
      message: error.message,
      data: null,
      isError: true,
      error,
    });
  }
});

module.exports = router;
