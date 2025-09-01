import express from "express";
import protect from "../middleware/authMiddleware.js";
import User from "../models/user.js";

const router = express.Router();

// profile
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-password").populate("watchlist");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

router.put("/:id", protect, async (req, res) => {
  if (req.user._id.toString() !== req.params.id && !req.user.isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
  res.json(updated);
});

// watchlist
router.get("/:id/watchlist", protect, async (req, res) => {
  if (req.user._id.toString() !== req.params.id && !req.user.isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }
  const user = await User.findById(req.params.id).populate("watchlist");
  res.json(user?.watchlist || []);
});

router.post("/:id/watchlist", protect, async (req, res) => {
  if (req.user._id.toString() !== req.params.id && !req.user.isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }
  const { movieId } = req.body;
  const user = await User.findById(req.params.id);
  if (!user.watchlist.map(id => id.toString()).includes(movieId)) user.watchlist.push(movieId);
  await user.save();
  res.json(user.watchlist);
});

router.delete("/:id/watchlist/:movieId", protect, async (req, res) => {
  if (req.user._id.toString() !== req.params.id && !req.user.isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }
  const user = await User.findById(req.params.id);
  user.watchlist = user.watchlist.filter(id => id.toString() !== req.params.movieId);
  await user.save();
  res.json(user.watchlist);
});

export default router;
