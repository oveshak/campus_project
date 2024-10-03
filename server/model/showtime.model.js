// showtime.model.js
import mongoose from "mongoose";

const showtimeSchema = new mongoose.Schema({
    hallName: {
        type: String,
        required: true
    },
    showDate: {
        type: Date,
        required: true
    },
    showTime: {
        type: String,  // Example: "4:15 PM"
        required: true
    },
    seatType: {
        type: String,
        enum: ['Standard', 'Full Recliner', 'Luxury', 'VIP'],  // Define different types of seats here
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    availableSeats: {
        type: Number,
        required: true
    },
});

// Ensure that you export the model with the same name used in the controller
const MovieShowTime = mongoose.model('MovieShowTime', showtimeSchema);
export default MovieShowTime; // Use default export for easier imports
