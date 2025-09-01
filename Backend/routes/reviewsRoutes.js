// routes/reviewsRoutes.js
import express from "express";
import Review from "../models/review.js";
import Movie from "../models/movies.js";

const router = express.Router();

// Get reviews for a movie
router.get("/:movieId/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ movie: req.params.movieId })
      .populate("user", "username profilePicture");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add review for a movie
router.post("/:movieId/reviews", async (req, res) => {
  try {
    const { userId, rating, reviewText } = req.body;

    const review = new Review({ user: userId, movie: req.params.movieId, rating, reviewText });
    await review.save();

    // Update movie's average rating
    const reviews = await Review.find({ movie: req.params.movieId });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    await Movie.findByIdAndUpdate(req.params.movieId, { averageRating: avgRating });

    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
