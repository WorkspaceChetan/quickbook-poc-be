var express = require("express");
var bodyParser = require("body-parser");

// bring handlers to bind with routes
var handlers = require("./handlers");

const app = express();

/* initial configs */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// /cron and /usershealth routes bind with respective handlers
app.use("/api/account", handlers.accountHandler);
app.use("/api/vendor", handlers.vendorHandler);

app.get("/", (_, res) => {
  res.send("Hello world");
});

module.exports = app;
