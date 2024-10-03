import mongoose from "mongoose"; // Import mongoose to validate ObjectId
import MovieShowTime from "../model/showtime.model.js"; // Ensure correct import

// Add a new showtime
export const addShowtime = async (req, res) => {
  try {
    const { hallName, showDate, showTime, seatType, price, availableSeats } = req.body;

    // Log incoming data
    console.log('Adding showtime with data:', req.body);

    // Create new showtime instance
    const newShowtime = new MovieShowTime({
      hallName,
      showDate,
      showTime,
      seatType,
      price,
      availableSeats
    });

    // Save to database
    const savedShowtime = await newShowtime.save();
    res.status(201).json(savedShowtime);
  } catch (error) {
    console.error('Error adding showtime:', error); // Log error details
    res.status(500).json({ message: 'Error adding showtime', error: error.message });
  }
};

// Get all showtimes
export const getShowtimes = async (req, res) => {
  console.log("Fetching all showtimes..."); // Log when fetching is initiated
  try {
    const showtimes = await MovieShowTime.find();
    console.log("Showtimes fetched successfully:", showtimes);
    res.json(showtimes);
  } catch (error) {
    console.error('Error fetching showtimes:', error); // Log error details
    res.status(500).json({ message: 'Error fetching showtimes', error: error.message });
  }
};

// Update a showtime by ID
export const updateShowtime = async (req, res) => {
  const { id } = req.params;
  console.log(`Received ID for update: ${id}`); // Debugging line

  // Check if the ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid showtime ID format' });
  }

  try {
    const updatedData = req.body;

    // Find and update the showtime
    const updatedShowtime = await MovieShowTime.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedShowtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    res.status(200).json(updatedShowtime);
  } catch (error) {
    console.error('Error updating showtime:', error); // Log error details
    res.status(500).json({ message: 'Error updating showtime', error: error.message });
  }
};

// Delete a showtime by ID
export const deleteShowtime = async (req, res) => {
  const { id } = req.params;

  // Check if the ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid showtime ID format' });
  }

  try {
    // Find and delete the showtime
    const deletedShowtime = await MovieShowTime.findByIdAndDelete(id);

    if (!deletedShowtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    res.status(200).json({ message: 'Showtime deleted successfully' });
  } catch (error) {
    console.error('Error deleting showtime:', error); // Log error details
    res.status(500).json({ message: 'Error deleting showtime', error: error.message });
  }
};
