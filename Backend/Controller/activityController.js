import Activity from "../Model/activityModel.js";
import User from "../Model/userModel.js";

/**
 * LOG ACTIVITY
 * Internal helper function to log user activities
 */
export const logActivity = async (userId, activityType, description, relatedId = null, relatedType = null, metadata = null) => {
  try {
    await Activity.create({
      userId,
      activityType,
      description,
      relatedId,
      relatedType,
      metadata,
    });
  } catch (error) {
    console.error(`Failed to log activity: ${error.message}`);
    // Don't throw error - activity logging shouldn't break main flow
  }
};

/**
 * GET USER ACTIVITY LOG
 * Get activity history for a specific user (user can only see own, admin can see all)
 */
export const getActivityLog = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // Check authorization - users can only see their own activity
    if (req.user.usertype !== "Admin" && req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to view this user's activity",
      });
    }

    const activities = await Activity.findAndCountAll({
      where: { userId: parseInt(userId) },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"],
        },
      ],
      order: [["timestamp", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({
      success: true,
      data: activities.rows,
      total: activities.count,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    console.error("Get activity log error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch activity log",
      error: error.message,
    });
  }
};

/**
 * GET ADMIN ACTIVITY LOG
 * Admin can see all activities across system
 */
export const getAllActivityLog = async (req, res) => {
  try {
    const { limit = 100, offset = 0, activityType, userId } = req.query;

    let whereClause = {};
    if (activityType) whereClause.activityType = activityType;
    if (userId) whereClause.userId = parseInt(userId);

    const activities = await Activity.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email", "usertype"],
        },
      ],
      order: [["timestamp", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({
      success: true,
      data: activities.rows,
      total: activities.count,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    console.error("Get all activity log error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch activity logs",
      error: error.message,
    });
  }
};

/**
 * GET ACTIVITY STATS
 * Admin dashboard - activity statistics
 */
export const getActivityStats = async (req, res) => {
  try {
    const { sequelize } = require("../Database/db.js");

    // Get activity count by type
    const stats = await Activity.findAll({
      attributes: [
        "activityType",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["activityType"],
      raw: true,
    });

    // Get activities in last 24 hours
    const last24h = await Activity.count({
      where: {
        timestamp: {
          [sequelize.Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });

    // Get most active users
    const topUsers = await Activity.findAll({
      attributes: [
        "userId",
        [sequelize.fn("COUNT", sequelize.col("id")), "activityCount"],
      ],
      group: ["userId"],
      order: [[sequelize.fn("COUNT", sequelize.col("id")), "DESC"]],
      limit: 10,
      raw: true,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"],
          required: false,
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: {
        byType: stats,
        last24h,
        topUsers,
      },
    });
  } catch (error) {
    console.error("Get activity stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch activity statistics",
      error: error.message,
    });
  }
};
