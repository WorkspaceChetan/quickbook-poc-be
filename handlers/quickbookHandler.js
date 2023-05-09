const express = require("express");
const OAuthClient = require("intuit-oauth");
const router = express.Router();

let oauthClient = new OAuthClient({
  clientId: process.env.INTUIT_CLIENT_ID,
  clientSecret: process.env.INTUIT_CLIENT_SECRET,
  environment: "sandbox",
  redirectUri: process.env.Back_URL + "/qb/callback",
});

router.get("/test", (req, res) => {
  res.status(200).json({});
});

router.get("/authUri", (req, res) => {
  const currentUrl = req.query.cb;
  const encodedUrl = Buffer.from(currentUrl).toString("base64");
  const authUri = oauthClient.authorizeUri({
    scope: [OAuthClient.scopes.Accounting],
    state: `&cb=${encodedUrl}`,
  });

  res.redirect(authUri);
});

router.get("/callback", async (req, res) => {
  try {
    const authResponse = await oauthClient.createToken(req.url);

    const fulltoken = authResponse.getJson();

    const stateParams = new URLSearchParams(req.query.state);
    const encodedUrl = stateParams.get("cb");
    const decodedUrl = Buffer.from(encodedUrl, "base64").toString("utf-8");
    const tokenData = JSON.stringify(fulltoken);
    const tokenParam = encodeURI(tokenData);
    console.log("token", tokenParam);
    return res.redirect(`${decodedUrl}?token=${tokenParam}`);
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

const checkHeader = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
      return res.status(401).json({
        message: "Missing access token",
      });
    }

    const decodeToken = JSON.parse(decodeURI(accessToken));

    oauthClient.getToken().setToken(decodeToken);

    if (!oauthClient.getToken().isRefreshTokenValid()) {
      return res.status(200).json({
        isError: true,
        message: "Invalid token not found",
      });
    }

    if (!oauthClient.getToken().isAccessTokenValid()) {
      const authResponse = await oauthClient.refresh();

      const fulltoken = authResponse.getJson();

      oauthClient.getToken().setToken(fulltoken);
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
  const token = oauthClient.getToken().getToken();

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

    let data;
    if (resp.headers["content-type"] === "application/json") {
      try {
        data = JSON.parse(resp.json);
      } catch (error) {
        data = resp.json;
      }
    }

    return res.status(200).json({
      isError: false,
      data: data,
      message: "",
      token: token,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(200).json({
      message: error.message,
      data: null,
      isError: true,
      error,
      token: token,
    });
  }
});

module.exports = router;
