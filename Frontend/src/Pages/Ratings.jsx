import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../style/Ratings.css";

const Ratings = () => {
  const { pickupId } = useParams();
  const navigate = useNavigate();
  const [ratings, setRatings] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchRatings();
  }, [pickupId]);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/review/pickup/${pickupId}`
      );
      if (response.data.success) {
        setRatings(response.data.data);
        
        // Calculate average rating
        if (response.data.data.length > 0) {
          const avg = (
            response.data.data.reduce((sum, r) => sum + r.rating, 0) /
            response.data.data.length
          ).toFixed(1);
          setAverageRating(avg);
        }
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
      setMessage("Failed to load ratings");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    if (newRating < 1 || newRating > 5) {
      setMessage("Rating must be between 1 and 5");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/review/create",
        {
          pickupId,
          rating: parseInt(newRating),
          comment,
          reviewType: "both",
        }
      );

      if (response.data.success) {
        setMessage("Rating submitted successfully! ✅");
        setNewRating(5);
        setComment("");
        fetchRatings();
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      setMessage(
        error.response?.data?.message || "Failed to submit rating"
      );
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? "filled" : ""}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="ratings-container">
        <Header />
        <div className="loading">Loading ratings...</div>
      </div>
    );
  }

  return (
    <div className="ratings-container">
      <Header />
      <div className="ratings-content">
        <div className="ratings-header">
          <h1>Driver Ratings & Reviews</h1>
          <button
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        </div>

        {message && <div className="message-box">{message}</div>}

        {/* Average Rating */}
        {averageRating > 0 && (
          <div className="average-rating">
            <h2>Average Rating</h2>
            <div className="rating-score">
              <span className="score">{averageRating}</span>
              <span className="out-of">/ 5.0</span>
            </div>
            {renderStars(Math.round(averageRating))}
            <p>{ratings.length} reviews</p>
          </div>
        )}

        {/* Submit New Rating */}
        <div className="submit-rating-form">
          <h2>Leave a Review</h2>
          <form onSubmit={handleSubmitRating}>
            <div className="form-group">
              <label>Rating (1-5 stars) *</label>
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${star <= newRating ? "selected" : ""}`}
                    onClick={() => setNewRating(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
              <p className="selected-rating">Rating: {newRating} / 5</p>
            </div>

            <div className="form-group">
              <label htmlFor="comment">Comment (Optional)</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with the driver or service..."
                rows="4"
              ></textarea>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Rating"}
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="reviews-list">
          <h2>All Reviews ({ratings.length})</h2>
          {ratings.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first to review!</p>
          ) : (
            ratings.map((rating) => (
              <div key={rating.id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <h3>{rating.reviewer?.username || "Anonymous"}</h3>
                    {renderStars(rating.rating)}
                  </div>
                  <span className="review-date">
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {rating.comment && (
                  <p className="review-comment">{rating.comment}</p>
                )}
                <p className="review-type">
                  Review Type: <span>{rating.reviewType}</span>
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Ratings;
