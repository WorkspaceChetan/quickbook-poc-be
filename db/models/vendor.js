const { DataTypes, Model } = require("sequelize");

// Import the DbConnection instance
const DbConnection = require("../../dbConn");

// Define a Bmi Category model that extends the Sequelize Model class
class Venodr extends Model {}

// Initialize the Bmi Category model with attributes and options
Venodr.init(
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
    modelName: "Venodr",
    // Set the table name for the model
    tableName: "vendor",
    // Ignore createdAt and Updated AT
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = Venodr;
