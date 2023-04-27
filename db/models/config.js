const { DataTypes, Model } = require("sequelize");

// Import the DbConnection instance
const DbConnection = require("../../dbConn");

// Define a Bmi Category model that extends the Sequelize Model class
class SyncConfig extends Model {}

// Initialize the Bmi Category model with attributes and options
SyncConfig.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tblname: {
      type: DataTypes.STRING,
    },
    syncUrl: {
      type: DataTypes.STRING,
    },
  },
  {
    // Use the DbConnection instance for the connection
    sequelize: DbConnection.getConnection(),
    // Set the model name for easier reference
    modelName: "SyncConfig",
    // Set the table name for the model
    tableName: "config",
    // Ignore createdAt and Updated AT
    createdAt:false,
    updatedAt:false
  }
);

module.exports = SyncConfig;
