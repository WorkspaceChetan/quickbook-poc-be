var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
require("dotenv").config();

// bring handlers to bind with routes
var handlers = require("./handlers");

var allowedOrigins = ["http://localhost:3000"];

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

/* initial configs */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// /cron and /usershealth routes bind with respective handlers
app.use("/api/account", handlers.accountHandler);
app.use("/api/vendor", handlers.vendorHandler);
app.use("/qb", handlers.quickbookHandler);
// app.use("/api/user", handlers.userHandler);
app.use("/api/user", handlers.userHandler);

app.get("/", (_, res) => {
  res.send("Hello world");
});

module.exports = app;
