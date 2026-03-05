import { sequelize, Sequelize } from "../Database/db.js";
import User from "../Model/userModel.js";
import Pickup from "../Model/pickupModel.js";
import Activity from "../Model/activityModel.js";
import { logActivity } from "./activityController.js";

// Get Sequelize operators
const { Op } = Sequelize;

/**
 * GET ADMIN DASHBOARD DATA
 * Returns system-wide statistics and analytics
 */
export const getAdminDashboard = async (req, res) => {
  try {
    // Total users count
    const totalUsers = await User.count();

    // Total pickups count
    const totalPickups = await Pickup.count();

    // Total waste collected
    const pickupStats = await Pickup.findOne({
      attributes: [
        [sequelize.fn("SUM", sequelize.col("estimatedWeight")), "totalWaste"],
      ],
      raw: true,
    });

    const totalWaste = parseFloat(pickupStats?.totalWaste || 0);

    // Pickups by status
    const pickupsByStatus = await Pickup.findAll({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("pickupId")), "count"],
      ],
      group: ["status"],
      raw: true,
      subQuery: false,
    });

    // Recent pickups (last 10)
    const recentPickups = await Pickup.findAll({
      order: [["requestedAt", "DESC"]],
      limit: 10,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"],
        },
      ],
      attributes: ["pickupId", "wasteType", "estimatedWeight", "status", "requestedAt", "userId"],
      raw: false,
    });

    // Top users by pickup count
    const topUsersRaw = await Pickup.findAll({
      attributes: [
        "userId",
        [sequelize.fn("COUNT", sequelize.col("pickupId")), "pickupCount"],
        [sequelize.fn("SUM", sequelize.col("estimatedWeight")), "totalWaste"],
      ],
      group: ["userId"],
      order: [[sequelize.fn("COUNT", sequelize.col("pickupId")), "DESC"]],
      limit: 5,
      raw: true,
      subQuery: false,
    });

    // Get user details for top users
    const topUsers = [];
    for (const userPickup of topUsersRaw) {
      const user = await User.findByPk(userPickup.userId, {
        attributes: ["id", "username", "email"],
      });
      if (user) {
        topUsers.push({
          id: user.id,
          name: user.username,
          email: user.email,
          pickups: parseInt(userPickup.pickupCount) || 0,
          waste: parseFloat(userPickup.totalWaste) || 0,
        });
      }
    }

    // Format status counts
    const statusCounts = {};
    pickupsByStatus.forEach((item) => {
      statusCounts[item.status] = parseInt(item.count) || 0;
    });

    // Get recent activity
    const recentActivity = await Activity.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"],
        },
      ],
      order: [["timestamp", "DESC"]],
      limit: 20,
    });

    // Activity statistics
    const activityStats = await Activity.findAll({
      attributes: [
        "activityType",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["activityType"],
      raw: true,
    });

    // Get stats in last 24 hours
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const newUsersLast24h = await User.count({
      where: {
        createdAt: {
          [Op.gte]: last24h,
        },
      },
    });

    const newPickupsLast24h = await Pickup.count({
      where: {
        requestedAt: {
          [Op.gte]: last24h,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Admin dashboard data fetched successfully",
      data: {
        totalUsers: parseInt(totalUsers) || 0,
        totalPickups: parseInt(totalPickups) || 0,
        totalWaste: totalWaste,
        newUsersLast24h,
        newPickupsLast24h,
        pickupsByStatus: statusCounts,
        recentPickups: recentPickups.map((p) => ({
          id: p.pickupId,
          type: "pickup",
          description: `${p.wasteType} - ${p.status}`,
          waste: parseFloat(p.estimatedWeight),
          timestamp: p.requestedAt,
          user: p.user,
        })),
        topUsers: topUsers,
        activityStats: activityStats,
        recentActivity,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard data",
      error: error.message,
    });
  }
};

/**
 * GET ALL USERS
 */
export const getAllUsersAdmin = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const users = await User.findAndCountAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users.rows,
      total: users.count,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

/**
 * GET ALL PICKUPS
 */
export const getAllPickupsAdmin = async (req, res) => {
  try {
    const { limit = 50, offset = 0, status } = req.query;

    let whereClause = {};
    if (status) {
      whereClause.status = status;
    }

    const pickups = await Pickup.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"],
        },
      ],
      order: [["requestedAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({
      success: true,
      message: "Pickups fetched successfully",
      data: pickups.rows,
      total: pickups.count,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    console.error("Error fetching pickups:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pickups",
      error: error.message,
    });
  }
};

/**
 * DELETE USER (Admin)
 */
export const deleteUserAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Log activity before deletion
    await logActivity(
      req.user.id,
      "user_deleted",
      `Admin deleted user: ${user.email}`,
      userId,
      "user",
      { email: user.email }
    );

    await user.destroy();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

/**
 * GET SYSTEM ANALYTICS
 * Detailed analytics and insights for admin
 */
export const getAnalytics = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    // Date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Pickups over time
    const pickupsOverTime = await Pickup.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("requestedAt")), "date"],
        [sequelize.fn("COUNT", sequelize.col("pickupId")), "count"],
        [sequelize.fn("SUM", sequelize.col("estimatedWeight")), "weight"],
      ],
      where: {
        requestedAt: {
          [sequelize.Op.gte]: startDate,
        },
      },
      group: [sequelize.fn("DATE", sequelize.col("requestedAt"))],
      order: [[sequelize.fn("DATE", sequelize.col("requestedAt")), "ASC"]],
      raw: true,
    });

    // Users over time
    const usersOverTime = await User.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: {
        createdAt: {
          [sequelize.Op.gte]: startDate,
        },
      },
      group: [sequelize.fn("DATE", sequelize.col("createdAt"))],
      order: [[sequelize.fn("DATE", sequelize.col("createdAt")), "ASC"]],
      raw: true,
    });

    // Top waste types
    const topWasteTypes = await Pickup.findAll({
      attributes: [
        "wasteType",
        [sequelize.fn("COUNT", sequelize.col("pickupId")), "count"],
        [sequelize.fn("SUM", sequelize.col("estimatedWeight")), "totalWeight"],
      ],
      group: ["wasteType"],
      order: [[sequelize.fn("SUM", sequelize.col("estimatedWeight")), "DESC"]],
      limit: 10,
      raw: true,
    });

    res.status(200).json({
      success: true,
      message: "Analytics data fetched successfully",
      data: {
        period: `Last ${days} days`,
        pickupsOverTime,
        usersOverTime,
        topWasteTypes: topWasteTypes.map((item) => ({
          wasteType: item.wasteType,
          count: parseInt(item.count),
          totalWeight: parseFloat(item.totalWeight),
        })),
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
      error: error.message,
    });
  }
};

