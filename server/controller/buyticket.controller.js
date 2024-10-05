import mongoose from "mongoose";
import TicketBooking from "../model/buyticket.model.js";
import MovieShowTime from "../model/showtime.model.js";
import { User } from '../model/user.model.js';
import Stripe from 'stripe';
import Movie from "../model/movie.model.js";

const stripe = new Stripe('sk_test_51Q68Bz047YvEic2uq63yUjYj1MO8F7FDsDPQwg7RqfiHgZaOdf6v6IkaMQbSalBpg7kvrJAh9ZKDrQiSNFWuumNn00jPJPs2CR');

export const bookTicket = async (req, res) => {
    try {
        const { showtimeId, ticketQuantity, movie } = req.body;
        const userId = req.user.id;
        
        // Validate showtimeId
        if (!mongoose.Types.ObjectId.isValid(showtimeId)) {
            return res.status(400).json({ message: 'Invalid showtime ID format' });
        }

        // Find the showtime and populate movie details
        const showtime = await MovieShowTime.findById(showtimeId);
        
        if (!showtime) {
            return res.status(404).json({ message: 'Showtime not found' });
        }

        // Check available seats
        if (showtime.availableSeats < ticketQuantity) {
            return res.status(400).json({ message: 'Not enough seats available' });
        }

        // Calculate total price (in cents)
        const totalPrice = ticketQuantity * showtime.price; // Ensure it's in cents for Stripe

        // Find the movie and populate its showtimes
        const movieDetails = await Movie.findById(movie).populate('showtimes');
        
        // Find the correct showtime in the movie's showtimes array
        const movieShowtime = movieDetails.showtimes.find(st => st._id.equals(showtimeId));
        if (!movieShowtime) {
            return res.status(404).json({ message: 'Movie showtime not found' });
        }

        // Fetch the user details to get the user's name
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new booking
        const newBooking = new TicketBooking({
            user: userId,
            showtime: showtimeId,
            ticketQuantity,
            totalPrice,
            movie: movie, // Save the movie ID
            paymentStatus: 'Pending',
        });

        // Save the booking
        await newBooking.save();

        // Update available seats
        showtime.availableSeats -= ticketQuantity;
        await showtime.save();

        // Update user's ticketBook
        await User.findByIdAndUpdate(userId, {
            $push: { ticketBook: newBooking._id }, // Add booking ID to the user's ticketBook array
        });

        // Create a Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: movieDetails.title,
                        description: `Booked by: ${user.name} | Hall: ${movieShowtime.hallName}`, // Include user's name in description
                    },
                    unit_amount: totalPrice, // Use the total price in cents
                },
                quantity: ticketQuantity,
            }],
            mode: 'payment',
            success_url: 'http://localhost:5173/profile',  // Update with appropriate URLs
            cancel_url: 'http://localhost:5173/',
            metadata: {
                bookingId: newBooking._id.toString(), // Attach booking ID to the session
            },
        });

        // Respond with the session ID to the frontend
        return res.status(201).json({
            message: 'Ticket booked successfully, proceed to payment',
            sessionId: session.id,
            booking: newBooking,
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};




// Fetch user with populated ticket bookings
export const getUserWithBookings = async (req, res) => {
    try {
        const userId = req.user.id; 
        console.log(userId); // Assuming user is authenticated

        // Validate the user ID format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        const user = await User.findById(userId).populate({
            path: 'ticketBook',
            populate: [
                
                {
                    path: 'movie', // This should work if movie references are correct
                    model: 'Movie',
                },
            ],
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user with bookings:", error); // Log the error for debugging
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};



// Get all user ticket bookings (Admin view)
export const getAllUserBookings = async (req, res) => {
    try {
        const userBookings = await TicketBooking.find().populate('user showtime movie'); // Populate the user and showtime details

        if (userBookings.length === 0) {
            return res.status(404).json({ message: 'No ticket bookings found' });
        }

        return res.status(200).json({ userBookings });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
