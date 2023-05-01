const { DataTypes, Model } = require("sequelize");

// Import the DbConnection instance
const DbConnection = require("../../dbConn");

// Define a Bmi Category model that extends the Sequelize Model class
class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Name: {
      type: DataTypes.STRING,
    },
    EmailId: {
      type: DataTypes.STRING,
    },
    Dob: {
      type: DataTypes.DATEONLY,
    },
    Exp: {
      type: DataTypes.INTEGER,
    },
  },
  {
    // Use the DbConnection instance for the connection
    sequelize: DbConnection.getConnection(),
    // Set the model name for easier reference
    modelName: "User",
    // Set the table name for the model
    tableName: "user",
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = User;
