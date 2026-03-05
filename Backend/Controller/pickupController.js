import Pickup from "../Model/pickupModel.js";
import User from "../Model/userModel.js";
import { logActivity } from "./activityController.js";
import { sequelize } from "../Database/db.js";

// ================= REQUEST PICKUP =================

export const requestPickup = async (req, res) => {
  try {
    const { wasteType, estimatedWeight, pickupAddress, latitude, longitude } = req.body;

    // Validate required fields
    if (!wasteType || !estimatedWeight || !pickupAddress) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: wasteType, estimatedWeight, pickupAddress",
      });
    }

    const newPickup = await Pickup.create({
      userId: req.user.id,
      wasteType,
      estimatedWeight,
      pickupAddress,
      latitude,
      longitude,
      status: "Pending",
    });

    // Log activity
    await logActivity(
      req.user.id,
      "pickup_request",
      `Pickup request created for ${wasteType}`,
      newPickup.pickupId,
      "pickup",
      { wasteType, weight: estimatedWeight, address: pickupAddress }
    );

    res.status(201).json({
      success: true,
      message: "Pickup request created successfully",
      data: newPickup,
    });
  } catch (error) {
    console.error("Pickup request error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create pickup request",
      error: error.message,
    });
  }
};

// ================= USER PICKUPS =================

export const getMyPickups = async (req, res) => {
  try {
    const pickups = await Pickup.findAll({
      where: { userId: req.user.id },
      order: [["requestedAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Pickups fetched successfully",
      data: pickups,
    });
  } catch (error) {
    console.error("Get my pickups error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pickups",
      error: error.message,
    });
  }
};

// ================= SINGLE PICKUP =================

export const getPickupById = async (req, res) => {
  try {
    const pickup = await Pickup.findByPk(req.params.pickupId);

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: "Pickup not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pickup fetched successfully",
      data: pickup,
    });
  } catch (error) {
    console.error("Get pickup by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pickup",
      error: error.message,
    });
  }
};

// ================= CANCEL PICKUP =================

export const cancelPickup = async (req, res) => {
  try {
    const pickup = await Pickup.findByPk(req.params.pickupId);

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: "Pickup not found",
      });
    }

    // Only allow user to cancel their own pickups (unless admin)
    if (pickup.userId !== req.user.id && req.user.usertype !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to cancel this pickup",
      });
    }

    pickup.status = "Cancelled";
    await pickup.save();

    // Log activity
    await logActivity(
      req.user.id,
      "pickup_cancelled",
      `Pickup request cancelled`,
      pickup.pickupId,
      "pickup"
    );

    res.status(200).json({
      success: true,
      message: "Pickup cancelled successfully",
      data: pickup,
    });
  } catch (error) {
    console.error("Cancel pickup error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel pickup",
      error: error.message,
    });
  }
};

// ================= ADMIN: GET ALL PICKUPS =================

export const getAllPickups = async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    const limitNum = Math.min(parseInt(limit) || 50, 1000);
    const offsetNum = parseInt(offset) || 0;

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
      limit: limitNum,
      offset: offsetNum,
    });

    res.status(200).json({
      success: true,
      message: "Pickups fetched successfully",
      data: pickups.rows || [],
      total: pickups.count,
      limit: limitNum,
      offset: offsetNum,
    });
  } catch (error) {
    console.error("Get all pickups error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pickups",
      error: error.message,
    });
  }
};

// ================= ADMIN: ASSIGN DRIVER =================

export const assignDriver = async (req, res) => {
  try {
    const { driverId } = req.body;

    if (!driverId) {
      return res.status(400).json({
        success: false,
        message: "Driver ID is required",
      });
    }

    const pickup = await Pickup.findByPk(req.params.pickupId);

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: "Pickup not found",
      });
    }

    pickup.driverId = driverId;
    pickup.status = "Assigned";
    await pickup.save();

    // Log activity
    await logActivity(
      req.user.id,
      "pickup_assigned",
      `Driver assigned to pickup`,
      pickup.pickupId,
      "pickup",
      { driverId }
    );

    res.status(200).json({
      success: true,
      message: "Driver assigned successfully",
      data: pickup,
    });
  } catch (error) {
    console.error("Assign driver error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to assign driver",
      error: error.message,
    });
  }
};

// ================= ADMIN: UPDATE STATUS =================

export const updatePickupStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const validStatuses = ["Pending", "Assigned", "In Progress", "Completed", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed: ${validStatuses.join(", ")}`,
      });
    }

    const pickup = await Pickup.findByPk(req.params.pickupId);

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: "Pickup not found",
      });
    }

    pickup.status = status;

    if (status === "Completed") {
      pickup.completedAt = new Date();
    }

    await pickup.save();

    // Log activity
    await logActivity(
      req.user.id,
      "pickup_status_updated",
      `Pickup status updated to ${status}`,
      pickup.pickupId,
      "pickup",
      { oldStatus: pickup.status, newStatus: status }
    );

    res.status(200).json({
      success: true,
      message: "Pickup status updated successfully",
      data: pickup,
    });
  } catch (error) {
    console.error("Update pickup status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update pickup status",
      error: error.message,
    });
  }
};

// ================= ADMIN: PICKUP STATS =================

export const getPickupStats = async (req, res) => {
  try {
    const total = await Pickup.count();

    const completed = await Pickup.count({
      where: { status: "Completed" },
    });

    const pending = await Pickup.count({
      where: { status: "Pending" },
    });

    const assigned = await Pickup.count({
      where: { status: "Assigned" },
    });

    const inProgress = await Pickup.count({
      where: { status: "In Progress" },
    });

    const cancelled = await Pickup.count({
      where: { status: "Cancelled" },
    });

    const totalWaste = await Pickup.findOne({
      attributes: [
        [sequelize.fn("SUM", sequelize.col("estimatedWeight")), "total"],
      ],
      raw: true,
    });

    res.status(200).json({
      success: true,
      message: "Pickup stats fetched successfully",
      data: {
        total,
        pickupsByStatus: {
          Pending: pending,
          Assigned: assigned,
          "In Progress": inProgress,
          Completed: completed,
          Cancelled: cancelled,
        },
        totalWaste: parseFloat(totalWaste?.total || 0),
      },
    });
  } catch (error) {
    console.error("Get pickup stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pickup stats",
      error: error.message,
    });
  }
}