import Notification from "../Model/notificationModel.js";

// Create Notification (Internal use)
export const createNotification = async (userId, type, title, message, relatedId = null, relatedType = null, icon = null) => {
  try {
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      relatedId,
      relatedType,
      icon,
    });
    return notification;
  } catch (error) {
    console.error("Create notification error:", error);
  }
};

// Get User Notifications
export const getUserNotifications = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const notifications = await Notification.findAndCountAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      data: notifications.rows,
      total: notifications.count,
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

// Get Unread Notifications Count
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.count({
      where: { userId: req.user.id, isRead: false },
    });

    res.status(200).json({
      success: true,
      data: { unreadCount: count },
    });
  } catch (error) {
    console.error("Get unread count error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch unread count",
      error: error.message,
    });
  }
};

// Mark Notification as Read
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByPk(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark as read",
      error: error.message,
    });
  }
};

// Mark All as Read
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.user.id, isRead: false } }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Mark all as read error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark all as read",
      error: error.message,
    });
  }
};

// Delete Notification
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByPk(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    await notification.destroy();

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete notification",
      error: error.message,
    });
  }
};

// Clear All Notifications
export const clearAllNotifications = async (req, res) => {
  try {
    await Notification.destroy({
      where: { userId: req.user.id },
    });

    res.status(200).json({
      success: true,
      message: "All notifications cleared successfully",
    });
  } catch (error) {
    console.error("Clear all notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear notifications",
      error: error.message,
    });
  }
};
