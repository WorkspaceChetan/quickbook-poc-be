const path = require("path");

const dbPath = path.join(__dirname, "..", "database.sqlite");
// const testDbPath = path.join(__dirname, "..", "test_database.sqlite");

module.exports = {
  development: {
    storage: dbPath,
    database: "database",
    dialect: "sqlite",
  },
  // test: {
  //   storage: testDbPath,
  //   database: "database",
  //   dialect: "sqlite",
  //   logging: false,
  // },
};
