import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: [{ type: String }],
  releaseYear: { type: Number, required: true },
  director: String,
  cast: [String],
  synopsis: String,
  posterUrl: String,
  averageRating: { type: Number, default: 0 }
}, { timestamps: true });

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
