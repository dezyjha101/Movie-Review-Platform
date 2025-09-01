import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import  rateLimit  from "express-rate-limit";


import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// optional: basic limiter
const limiter = rateLimit({ windowMs: 60 * 1000, max: 100 });
app.use(limiter);

// Routes
app.use("/api/movies", movieRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to Movie Review Platform API 🚀");
});


// central error handler (fallback)
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Server running and DB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
