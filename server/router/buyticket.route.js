import express from 'express';


import { bookTicket,    getAllUserBookings, getUserWithBookings } from '../controller/buyticket.controller.js';
import { isAuthenticated } from '../midelware/user.auth.js';
import { isAdmin } from '../midelware/admin.js';


const router = express.Router();

// Route to book a ticket (User must be authenticated)
router.post('/book', isAuthenticated, bookTicket);

// Route to get the current user's bookings (User must be authenticated)
router.get('/userbookings', isAuthenticated, getUserWithBookings);

// Route for admin to get all user bookings (Admin only)
router.get('/allbookings', isAuthenticated, isAdmin, getAllUserBookings);


export default router;
