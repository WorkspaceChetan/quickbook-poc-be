const { DataTypes, Model } = require("sequelize");
const DbConnection = require("../../dbConn");

class Users extends Model {}

Users.init(
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
    tableName: "user",
  }
);
