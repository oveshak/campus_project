import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  duration: {
    type: Number,
    required: true,
  },
  cast: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Store image URL
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['upcoming', 'show now'],
  },
  showtimes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MovieShowTime',
  }],
}, { timestamps: true });

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
 

