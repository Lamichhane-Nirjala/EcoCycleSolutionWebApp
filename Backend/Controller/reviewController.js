import Review from "../Model/reviewModel.js";
import User from "../Model/userModel.js";
import Pickup from "../Model/pickupModel.js";

// Create Review
export const createReview = async (req, res) => {
  try {
    const { pickupId, driverId, rating, comment, reviewType } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Check if pickup exists
    const pickup = await Pickup.findByPk(pickupId);
    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: "Pickup not found",
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      where: { pickupId, reviewerId: req.user.id },
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this pickup",
      });
    }

    const review = await Review.create({
      pickupId,
      driverId,
      reviewerId: req.user.id,
      rating,
      comment,
      reviewType,
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create review",
      error: error.message,
    });
  }
};

// Get Reviews for a Pickup
export const getPickupReviews = async (req, res) => {
  try {
    const { pickupId } = req.params;

    const reviews = await Review.findAll({
      where: { pickupId },
      include: [
        {
          model: User,
          as: "reviewer",
          attributes: ["id", "username", "email"],
        },
        {
          model: User,
          as: "driver",
          attributes: ["id", "username", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: reviews,
    });
  } catch (error) {
    console.error("Get pickup reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

// Get Driver Reviews
export const getDriverReviews = async (req, res) => {
  try {
    const { driverId } = req.params;

    const reviews = await Review.findAndCountAll({
      where: { driverId },
      include: [
        {
          model: User,
          as: "reviewer",
          attributes: ["id", "username", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Calculate average rating
    const totalRating = reviews.rows.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.count > 0 ? (totalRating / reviews.count).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      message: "Driver reviews fetched successfully",
      data: {
        reviews: reviews.rows,
        totalReviews: reviews.count,
        averageRating,
      },
    });
  } catch (error) {
    console.error("Get driver reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch driver reviews",
      error: error.message,
    });
  }
};

// Get User Reviews
export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { reviewerId: req.user.id },
      include: [
        {
          model: User,
          as: "driver",
          attributes: ["id", "username", "email"],
        },
        {
          model: Pickup,
          as: "pickup",
          attributes: ["pickupId", "wasteType", "status"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "User reviews fetched successfully",
      data: reviews,
    });
  } catch (error) {
    console.error("Get user reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user reviews",
      error: error.message,
    });
  }
};

// Update Review
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check if user is the reviewer
    if (review.reviewerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this review",
      });
    }

    // Update review
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update review",
      error: error.message,
    });
  }
};

// Delete Review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check if user is the reviewer
    if (review.reviewerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this review",
      });
    }

    await review.destroy();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};
