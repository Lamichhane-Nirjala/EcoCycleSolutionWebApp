import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";


const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    // name from frontend
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    // phone from frontend
    number: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    // city from frontend
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    // userType from frontend
    usertype: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "User",
    },
  },
  {
    timestamps: true,
    tableName: "users",
  }
);

export default User;
