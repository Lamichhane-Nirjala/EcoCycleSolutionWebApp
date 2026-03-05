import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";
import User from "./userModel.js";
import Pickup from "./pickupModel.js";

const Review = sequelize.define(
  "reviews",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    pickupId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "pickups",
        key: "pickupId",
      },
    },

    reviewerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },

    driverId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },

    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },

    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    reviewType: {
      type: DataTypes.ENUM("driver", "service", "both"),
      defaultValue: "service",
    },
  },
  {
    timestamps: true,
    tableName: "reviews",
  }
);

// Associations
Review.belongsTo(User, {
  foreignKey: "reviewerId",
  as: "reviewer",
});

Review.belongsTo(User, {
  foreignKey: "driverId",
  as: "driver",
});

Review.belongsTo(Pickup, {
  foreignKey: "pickupId",
  as: "pickup",
});

export default Review;
