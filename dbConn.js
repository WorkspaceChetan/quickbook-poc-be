const { Sequelize } = require("sequelize");
const db_conf = require("./config/db_conf");

// Define a class for database connection
class DbConnection {
  constructor() {
    // Log the start of the connection initiation process
    console.log(
      "Sqlite connection initiation started.",
      db_conf.development.storage
    );

    // Create a new Sequelize instance with the given dialect and storage
    this._connection = new Sequelize({
      dialect: "sqlite",
      storage: db_conf.development.storage,
      logging: false,
    });
  }

  // Define a method to get the connection instance
  getConnection = () => this._connection;

  // Define a method to test the connection to the database
  testConn = async () => {
    try {
      // Try to authenticate the connection instance
      await this._connection.authenticate();

      // If successful, log the success message
      console.log("Connection has been established successfully.");
    } catch (err) {
      // If not successful, log the error message
      console.error("Unable to connect to the database:", err);
    }
  };
}

module.exports = new DbConnection();
