import { sequelize } from "../Database/db.js";
import User from "../Model/userModel.js";
import Pickup from "../Model/pickupModel.js";

/**
 * CALCULATE ECO POINTS
 * Eco points are calculated based on:
 * - Number of pickups: 10 points per pickup
 * - Total waste recycled: 1 point per kg
 */
const calculateEcoPoints = (pickupCount, totalWaste) => {
  const pointsPerPickup = 10;
  const pointsPerKg = 1;
  return (pickupCount * pointsPerPickup) + (totalWaste * pointsPerKg);
};

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user info
    const user = await User.findByPk(userId, {
      attributes: ["id", "username", "email", "usertype", "city", "number"],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get pickup statistics
    const stats = await Pickup.findAll({
      where: { userId },
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("pickupId")), "totalPickups"],
        [
          sequelize.fn("SUM", sequelize.col("estimatedWeight")),
          "totalWaste",
        ],
      ],
      raw: true,
    });

    const totalPickups = parseInt(stats[0]?.totalPickups) || 0;
    const totalWaste = parseFloat(stats[0]?.totalWaste) || 0;

    // Calculate eco points
    const ecoPoints = calculateEcoPoints(totalPickups, totalWaste);

    // Get pickup statistics by status
    const pickupsByStatus = await Pickup.findAll({
      where: { userId },
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("pickupId")), "count"],
      ],
      group: ["status"],
      raw: true,
    });

    const statusBreakdown = {};
    pickupsByStatus.forEach((item) => {
      statusBreakdown[item.status] = parseInt(item.count) || 0;
    });

    // Get recent pickups
    const recentPickups = await Pickup.findAll({
      where: { userId },
      order: [["requestedAt", "DESC"]],
      limit: 10,
      attributes: ["pickupId", "wasteType", "estimatedWeight", "status", "requestedAt"],
      raw: true,
    });

    // Get waste type breakdown
    const wasteTypeBreakdown = await Pickup.findAll({
      where: { userId },
      attributes: [
        "wasteType",
        [sequelize.fn("COUNT", sequelize.col("pickupId")), "count"],
        [sequelize.fn("SUM", sequelize.col("estimatedWeight")), "totalWeight"],
      ],
      group: ["wasteType"],
      raw: true,
    });

    res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: {
        user: {
          id: user.id,
          name: user.username,
          email: user.email,
          role: user.usertype,
          city: user.city,
          phone: user.number,
        },
        stats: {
          totalPickups,
          totalWaste: parseFloat(totalWaste),
          ecoPoints,
          statusBreakdown,
        },
        recentPickups,
        wasteTypeBreakdown: wasteTypeBreakdown.map((item) => ({
          wasteType: item.wasteType,
          count: parseInt(item.count),
          totalWeight: parseFloat(item.totalWeight || 0),
        })),
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard",
      error: error.message,
    });
  }
};