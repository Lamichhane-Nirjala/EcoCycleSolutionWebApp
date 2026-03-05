import express from "express";
import auth from "../Middleware/auth.js";
import {
  createReview,
  getPickupReviews,
  getDriverReviews,
  getUserReviews,
  updateReview,
  deleteReview,
} from "../Controller/reviewController.js";

const reviewRouter = express.Router();

// Create review
reviewRouter.post("/create", auth, createReview);

// Get reviews for a pickup
reviewRouter.get("/pickup/:pickupId", getPickupReviews);

// Get driver reviews
reviewRouter.get("/driver/:driverId", getDriverReviews);

// Get user's reviews
reviewRouter.get("/user/my-reviews", auth, getUserReviews);

// Update review
reviewRouter.put("/:reviewId", auth, updateReview);

// Delete review
reviewRouter.delete("/:reviewId", auth, deleteReview);

export default reviewRouter;
