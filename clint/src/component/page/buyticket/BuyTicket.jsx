import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const BuyTicket = () => {
  const { id } = useParams();
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const MAX_TICKET_LIMIT = 5; // Set a constant for max ticket quantity

  // Helper function to format the date to include the local day name and date
  const formatLocalDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      weekday: 'long', // Day name
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Helper function to format time to local time
  const formatLocalTime = (timeString) => {
    const time = new Date(`1970-01-01T${timeString}Z`); // Convert time to Date object (adjust for timezone if needed)
    return time.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, // Display time in 12-hour format (optional)
    });
  };

  // Fetch movie data from the API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/${id}`);
        console.log("API Response:", response.data.showtimes); // Log the response to check its structure

        setMovies(response.data.showtimes); // Assuming the API returns an array of showtimes
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    fetchMovies();
  }, [id]);

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left section: Movie Selection */}
        <div className="col-span-2 space-y-8">
          <h3 className="text-2xl font-semibold text-white">Select a Movie</h3>
          <div className="flex space-x-4 overflow-x-auto">
            {movies.length > 0 ? (
              movies.map((movie) => (
                <div
                  key={movie.title}
                  className={`bg-white p-4 rounded-lg shadow-lg cursor-pointer ${
                    selectedMovie === movie ? 'border-2 border-purple-600' : ''
                  }`}
                  onClick={() => setSelectedMovie(movie)}
                >
                  <h4 className="text-lg font-semibold text-center">
                    {movie.showDate ? formatLocalDate(movie.showDate) : 'No Date Available'}
                  </h4>
                  <p className="text-sm text-center">
                    Show Time: {movie.showTime ? formatLocalTime(movie.showTime) : 'No Time Available'}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-white">No movies available.</p>
            )}
          </div>

          {/* Show Hall Details */}
          {selectedMovie && (
            <div className="bg-white p-4 rounded-lg shadow mt-6">
              <h3 className="text-lg font-semibold mb-2">Show Hall Details</h3>
              <p className="text-sm">Hall Name: <span className="font-medium">{selectedMovie.hallName || 'N/A'}</span></p>
              <p className="text-sm">Available Seats: <span className="font-medium">{selectedMovie.availableSeats || 'N/A'}</span></p>
              <p className="text-sm">Pricing: <span className="font-medium">{selectedMovie.price || 'N/A'} Taka</span></p>
              <p className="text-sm">Seat Type: <span className="font-medium">{selectedMovie.seatType || 'N/A'}</span></p>
            </div>
          )}

          {/* Select Ticket Quantity */}
          <div className="bg-white p-4 rounded-lg shadow mt-6">
            <h3 className="text-lg font-semibold mb-2">Ticket Quantity</h3>
            <div className="flex items-center space-x-4">
              <button
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg"
                onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
              >
                -
              </button>
              <span>{ticketQuantity} Tickets</span>
              <button
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg"
                onClick={() => {
                  if (ticketQuantity < MAX_TICKET_LIMIT) {
                    setTicketQuantity(ticketQuantity + 1);
                  } else {
                    alert("Cannot add more than 5 tickets.");
                  }
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Right section: Ticket Summary */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h3 className="text-lg font-semibold">Ticket Summary</h3>
          <div className="space-y-2">
            {selectedMovie && (
              <>
                <h4 className="text-lg font-semibold">{selectedMovie.title}</h4>
                <p className="text-sm">Show Date: <span className="font-medium">{selectedMovie.showDate ? formatLocalDate(selectedMovie.showDate) : 'No Date Available'}</span></p>
                <p className="text-sm">Show Time: <span className="font-medium">{selectedMovie.showTime ? formatLocalTime(selectedMovie.showTime) : 'No Time Available'}</span></p>
                <p className="text-sm">Ticket Quantity: <span className="font-medium">{ticketQuantity}</span></p>
                <p className="text-sm">Total Amount: <span className="font-medium">{ticketQuantity * (selectedMovie.price || 0)} Taka</span></p>
              </>
            )}
          </div>

          {/* Ticket Purchase */}
          <div className="space-y-4">
            <button className="w-full bg-purple-600 text-white py-2 rounded-lg">
              PURCHASE TICKET
            </button>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyTicket;
