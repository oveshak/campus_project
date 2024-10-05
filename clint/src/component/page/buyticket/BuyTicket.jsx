// src/components/tickets/BuyTicket.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { AuthContext } from '../../../provider/AuthProvider';
import { loadStripe } from '@stripe/stripe-js';

const BuyTicket = () => {
  const { id } = useParams(); // Movie ID from URL parameters
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [bookingStatus, setBookingStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const MAX_TICKET_LIMIT = 5;
  const { user } = useContext(AuthContext);
  const stripePromise = loadStripe('pk_test_51Q68Bz047YvEic2unxeyquStzpfPYqgvsKRxGNQnrfi1jNUoxMzn7VlYvYwqLxnlmZpgGdsuexv5BUC9EoLkkHU800umhlMecK');

  // Fetch movie data from the API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/${id}`);
        setMovies(response.data.showtimes);
      } catch (error) {
        setBookingStatus('Error fetching movie data. Please refresh the page.');
      }
    };

    fetchMovies();
  }, [id]);

  // Function to format date and time
  const formatDateTime = (dateString,) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
      return { formattedDate: 'Invalid Date', formattedTime: 'Invalid Time' };
    }

    const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const optionsTime = { hour: 'numeric', minute: 'numeric', hour12: true };

    const formattedDate = date.toLocaleDateString(undefined, optionsDate);
    const formattedTime = date.toLocaleTimeString(undefined, optionsTime);

    return { formattedDate, formattedTime };
  };

  // Function to handle ticket booking
  const handleBookTicket = async () => {
    if (!selectedMovie) {
      setBookingStatus("Please select a movie before booking.");
      return;
    }

    if (!user || !user._id) {
      setBookingStatus("User is not logged in. Please log in to book tickets.");
      return;
    }

    setLoading(true);
    setBookingStatus('');

    try {
      const bookingDetails = {
        showtimeId: selectedMovie._id,
        movie: id,
        userId: user._id,
        ticketQuantity,
      };

      const response = await axios.post(`http://127.0.0.1:5000/api/book`, bookingDetails, {
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`,
        },
      });
      setBookingStatus('Ticket booked successfully!');

      // If the booking is successful, trigger payment
      handlePayment(response.data.sessionId);
    } catch (error) {
      setBookingStatus('Error booking ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle payment after successful booking
  const handlePayment = async (sessionId) => {
    const stripe = await stripePromise;

    const { error } = await stripe.redirectToCheckout({
      sessionId, // Session ID from the backend
    });

    if (error) {
      setBookingStatus('Payment failed. Please try again.');
    }
  };

  return (
    <div className="bg-black p-6">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left section: Movie Selection */}
        <div className="col-span-2 space-y-8">
          <h3 className="text-2xl font-semibold text-white">Select a Movie</h3>
          <div className="flex space-x-4 overflow-x-auto">
            {movies.length > 0 ? (
              movies.map((movie) => {
                const { formattedDate, formattedTime } = formatDateTime(movie.showDate, movie.showTime);
                console.log(movie.showTime)
                return (
                  <div
                    key={movie._id}
                    className={`bg-white p-4 rounded-lg shadow-lg cursor-pointer ${selectedMovie === movie ? 'border-2 border-purple-600' : ''}`}
                    onClick={() => {
                      setSelectedMovie(movie);
                      setTicketQuantity(1); // Reset ticket quantity when selecting a new movie
                    }}
                  >
                    <h4 className="text-lg font-semibold text-center">
                      {formattedDate || 'No Date Available'}
                    </h4>
                    <p className="text-sm text-center">
                    Show Time: {new Date(`1970-01-01T${movie.showTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-white">No movies available.</p>
            )}
          </div>

          {/* Show Hall Details */}
          {selectedMovie && (
            <div className="bg-white p-4 rounded-lg shadow mt-6">
              <h3 className="text-lg font-semibold mb-2">Show Hall Details</h3>
              <p className="text-sm">Hall Name: <span className="font-medium">{selectedMovie.hallName || 'N/A'}</span></p>

              {selectedMovie.availableSeats > 0 ? (
                <>
                  <p className="text-sm">Available Seats: <span className="font-medium">{selectedMovie.availableSeats}</span></p>
                  <p className="text-sm">Pricing: <span className="font-medium">{selectedMovie.price || 'N/A'} Taka</span></p>
                  <p className="text-sm">Seat Type: <span className="font-medium">{selectedMovie.seatType || 'N/A'}</span></p>

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
                            setBookingStatus("Cannot add more than 5 tickets.");
                          }
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-red-500 font-semibold">Housefull</p>
              )}
            </div>
          )}
        </div>

        {/* Right section: Ticket Summary */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h3 className="text-lg font-semibold">Ticket Summary</h3>
          <div className="space-y-2">
            {selectedMovie && (
              <>
                <h4 className="text-lg font-semibold">{selectedMovie.title}</h4>
                <p className="text-sm">Show Date: <span className="font-medium">{selectedMovie.showDate ? formatDateTime(selectedMovie.showDate).formattedDate : 'No Date Available'}</span></p>
                <p className="text-sm">Show Time: <span className="font-medium">{selectedMovie.showDate ? formatDateTime(selectedMovie.showDate).formattedTime : 'No Time Available'}</span></p>
                <p className="text-sm">Ticket Quantity: <span className="font-medium">{ticketQuantity}</span></p>
                <p className="text-sm">Total Amount: <span className="font-medium">{ticketQuantity * (selectedMovie.price || 0)} Taka</span></p>
              </>
            )}
          </div>

          {/* Ticket Purchase */}
          <div className="space-y-4">
            <button 
              className="w-full bg-purple-600 text-white py-2 rounded-lg" 
              onClick={handleBookTicket}
              disabled={loading || (selectedMovie && selectedMovie.availableSeats === 0)} // Disable if housefull
            >
              {loading ? 'Booking...' : 'PURCHASE TICKET'}
            </button>
            
            {bookingStatus && <p className="text-red-500">{bookingStatus}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyTicket;
