import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";
import User from "./userModel.js";

const Activity = sequelize.define(
  "activities",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },

    activityType: {
      type: DataTypes.ENUM(
        "signup",
        "login",
        "waste_scan",
        "pickup_request",
        "pickup_completed",
        "profile_update",
        "logout",
        "account_delete"
      ),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    relatedId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "ID of related entity (e.g., pickupId)",
    },

    relatedType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Type of related entity (e.g., pickup, waste)",
    },

    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Additional data (e.g., waste type, weight)",
    },

    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "activities",
  }
);

// Association with User
Activity.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export default Activity;
