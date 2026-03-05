import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";
import User from "./userModel.js";

const Notification = sequelize.define(
  "notifications",
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

    type: {
      type: DataTypes.ENUM(
        "pickup_requested",
        "pickup_assigned",
        "pickup_in_progress",
        "pickup_completed",
        "pickup_cancelled",
        "new_reward",
        "leaderboard_update",
        "system_message"
      ),
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    message: {
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
      comment: "Type of related entity (pickup, reward, etc.)",
    },

    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    icon: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "notifications",
  }
);

// Associations
Notification.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export default Notification;
