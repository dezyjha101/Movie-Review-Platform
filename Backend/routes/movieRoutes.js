import express from "express";
import { body, query, validationResult } from "express-validator";
import Movie from "../models/movies.js";
import Review from "../models/review.js";
import protect, { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE movie (admin only)
router.post(
  "/",
  protect,
  requireAdmin,
  [
    body("title").trim().notEmpty(),
    body("releaseYear").isInt({ min: 1888 }),
    body("genre").isArray().optional(),
    body("posterUrl").optional().isURL().withMessage("posterUrl must be a valid URL")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const movie = new Movie(req.body);
      await movie.save();
      res.status(201).json(movie);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// LIST movies with filters/sort/pagination
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 })
  ],
  async (req, res) => {
    const { page = 1, limit = 10, genre, year, search, sort } = req.query;
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 10);

    try {
      const filter = {};
      if (genre) filter.genre = genre;
      if (year) filter.releaseYear = Number(year);
      if (search) {
        const q = new RegExp(String(search), "i");
        filter.$or = [{ title: q }, { director: q }];
      }

      let sortObj = { createdAt: -1 };
      if (sort) sortObj = sort.startsWith("-") ? { [sort.slice(1)]: -1 } : { [sort]: 1 };

      const [movies, total] = await Promise.all([
        Movie.find(filter).sort(sortObj).skip((pageNum - 1) * limitNum).limit(limitNum),
        Movie.countDocuments(filter),
      ]);

      res.json({ total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum, movies });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// genres list
router.get("/genres", async (_req, res) => {
  try {
    const genres = await Movie.distinct("genre");
    res.json(genres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a movie (plus reviews)
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    const reviews = await Review.find({ movie: req.params.id }).populate("user", "username profilePicture");
    res.json({ movie, reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 👇 NEW: GET /movies/:id/reviews
router.get("/:id/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ movie: req.params.id }).populate("user", "username profilePicture");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD review (auth required)
router.post(
  "/:id/reviews",
  protect,
  [body("rating").isInt({ min: 1, max: 5 }), body("reviewText").optional().isString()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const movieId = req.params.id;
      const review = new Review({
        user: req.user._id,
        movie: movieId,
        rating: req.body.rating,
        reviewText: req.body.reviewText || ""
      });
      await review.save();

      // recompute avg
      const all = await Review.find({ movie: movieId });
      const avg = all.reduce((s, r) => s + r.rating, 0) / (all.length || 1);
      await Movie.findByIdAndUpdate(movieId, { averageRating: avg });

      res.status(201).json(review);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// update/delete movie (admin only)
router.put("/:id", protect, requireAdmin, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", protect, requireAdmin, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json({ message: "Movie deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
