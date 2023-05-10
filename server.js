var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
require("dotenv").config();

// bring handlers to bind with routes
var handlers = require("./handlers");

var allowedOrigins = [process.env.FRONT_URL];

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

app.use("/qb", handlers.quickbookHandler);
app.get("/health",(req,res)=>{
  res.status(200).json({
    "Key":"Success"
  })
});

app.get("/", (_, res) => {
  res.send("Hello world");
});

module.exports = app;
