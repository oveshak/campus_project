 // Adjust the import path as needed
import mongoose from "mongoose";
import Movie from "../model/movie.model.js";

// Controller to add a new movie

export const addMovie = async (req, res) => {
    try {
      // Assuming you're storing the file path in the movie model
      const movie = new Movie({
        ...req.body,
        image: `/Image/${req.file.filename}` // Store the image path relative to the public folder
      });
  
      await movie.save();
      res.status(201).json({ message: 'Movie added successfully', movie });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error adding movie' });
    }
  };

// Controller to get a single movie by ID

export const getSingleMovie = async (req, res) => {
  const { id } = req.params;

  // Check if the ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid movie ID format' });
  }

  try {
    const movie = await Movie.findById(id).populate('showtimes'); // Populating showtimes field
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching the movie' });
  }
};

// Controller to update a movie by ID

export const updateMovie = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // If there's a file, add it to the update data
    if (req.file) {
      updateData.image = `/Image/${req.file.filename}`; // Save the file path to the database
    }

    const movie = await Movie.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({ message: 'Movie updated successfully', movie });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating movie' });
  }
};

// Controller to delete a movie by ID

export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting movie' });
  }
};

// Controller to get all movies

export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching movies' });
  }
};


//srarch movie 
// Adjust the import as necessary

// controllers/movieController.js
// controllers/movieController.js
export const searchMovies = async (req, res) => {
  const { title } = req.query;

  try {
      if (title) {
          const movies = await Movie.find({
              title: { $regex: title, $options: 'i' },
          });
          return res.json(movies);
      }
      const movies = await Movie.find();
      return res.json(movies);
  } catch (error) {
      console.error("Search error:", error);
      return res.status(500).json({ message: "Server error while searching for movies." });
  }
};



