import express from 'express';
import multer from 'multer';
import fs from 'fs';
// Assuming you have an authentication middleware
import { addMovie, deleteMovie, getAllMovies, getSingleMovie,  searchMovies, updateMovie } from '../controller/movie.controller.js';
import { isAdmin } from '../midelware/admin.js';
import { isAuthenticated } from '../midelware/user.auth.js';
 // Your movie controller file

const router = express.Router();


// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = 'public/Image'; // Ensure this directory exists
    cb(null, path);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename
  },
});

// Ensure the directory exists before uploading
const imageDir = 'public/Image';
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

const upload = multer({ storage }); // Initialize multer with the storage configuration

// Define routes for movies
router.post('/', isAuthenticated, isAdmin, upload.single('image'), addMovie); // Make sure 'image' matches the key from the frontend
// Add a new movie
router.get('/all', getAllMovies
); // Get all movies
router.get('/:id', getSingleMovie); // Get a single movie by ID
router.put('/:id',isAuthenticated, isAdmin,upload.single('image'),updateMovie); // Update a movie by ID
router.delete('/:id',isAuthenticated, isAdmin,deleteMovie); // Delete a movie by ID

router.get('/search',searchMovies)

export default router;