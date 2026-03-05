import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";
import User from "./userModel.js";

const Pickup = sequelize.define(
  "pickups",
  {
    pickupId: {
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

    wasteType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "e.g., plastic, paper, metal, organic, mixed",
    },

    estimatedWeight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Weight in kg",
    },

    pickupAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },

    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        "Pending",
        "Assigned",
        "In Progress",
        "Completed",
        "Cancelled"
      ),
      defaultValue: "Pending",
      allowNull: false,
    },

    driverId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "ID of assigned driver (admin user)",
    },

    requestedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    scheduledTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Additional notes from admin or driver",
    },
  },
  {
    timestamps: true,
    tableName: "pickups",
  }
);

// Association with User
Pickup.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export default Pickup;
