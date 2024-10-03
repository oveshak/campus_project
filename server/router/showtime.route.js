import express from 'express';
import { addShowtime, deleteShowtime, getShowtimes, updateShowtime } from '../controller/showtime.controller.js';
import { isAdmin } from '../midelware/admin.js';
import { isAuthenticated } from '../midelware/user.auth.js';

const router = express.Router();

// Route to add a showtime
router.post('/showtimes', isAuthenticated, isAdmin, addShowtime);

// Route to get all showtimes
router.get('/', getShowtimes); // Temporarily without middleware for testing

// Route to update a showtime by ID
router.put('/showtimes/:id', isAuthenticated, isAdmin, updateShowtime);

// Route to delete a showtime by ID
router.delete('/showtimes/:id', isAuthenticated, isAdmin, deleteShowtime);

export default router;
