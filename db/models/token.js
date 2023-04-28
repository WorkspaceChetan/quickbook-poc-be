const { DataTypes, Model } = require("sequelize");

// Import the DbConnection instance
const DbConnection = require("../../dbConn");

// Define a Bmi Category model that extends the Sequelize Model class
class Token extends Model {}

// Initialize the Bmi Category model with attributes and options
Token.init(
  {
    tokenid: {
      type: DataTypes.STRING,
    },
    fulltoken: {
      type: DataTypes.TEXT,
    },
  },
  {
    // Use the DbConnection instance for the connection
    sequelize: DbConnection.getConnection(),
    // Set the model name for easier reference
    modelName: "Token",
    // Set the table name for the model
    tableName: "token",
    // Ignore createdAt and Updated AT
    createdAt: false,
    updatedAt: false,
  }
);

Token.removeAttribute("id");

module.exports = Token;
