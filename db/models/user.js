const { DataTypes, Model } = require("sequelize");
const DbConnection = require("../../dbConn");

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
    },
    email: {
      type: DataTypes.TEXT,
    },
    dob: {
      type: DataTypes.DATE,
    },
    moblino: {
      type: DataTypes.TEXT,
    },
    exp: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: DbConnection.getConnection(),
    modelName: "User",
    tableName: "users",

    createdAt: false,
    updatedAt: false,
  }
);

module.exports = User;
