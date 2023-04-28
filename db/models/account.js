const { DataTypes, Model } = require("sequelize");

// Import the DbConnection instance
const DbConnection = require("../../dbConn");

// Define a Bmi Category model that extends the Sequelize Model class
class Account extends Model {}

// Initialize the Bmi Category model with attributes and options
Account.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
    },
    qb_data: {
      type: DataTypes.TEXT,
    },
  },
  {
    // Use the DbConnection instance for the connection
    sequelize: DbConnection.getConnection(),
    // Set the model name for easier reference
    modelName: "Account",
    // Set the table name for the model
    tableName: "account",
    // Ignore createdAt and Updated AT
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = Account;
