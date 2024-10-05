import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthContext } from '../../../provider/AuthProvider';

const Favourites = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user || !user._id) {
                setError('User is not logged in.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('http://127.0.0.1:5000/user/allbook', {
                    headers: {
                        'Authorization': `Bearer ${Cookies.get('token')}`
                    }
                });

                console.log('API Response:', response.data.user.ticketBook);
                setBookings(response.data.user.ticketBook || []);
            } catch (err) {
                console.error("Error fetching booking data:", err);
                const errorMessage = err.response?.data?.message || 'Error fetching booking data. Please try again later.';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user]);

    // Function to format showtime
    const formatShowtime = (date, time) => {
        return `${new Date(date).toLocaleDateString()} - ${time}`;
    };

    // Function to generate random numbers
    const generateRandomNumbers = (quantity) => {
        return Array.from({ length: quantity }, () => Math.floor(Math.random() * 10000));
    };

    return (
        <div className="bg-gray-100 p-6">
            <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
            {loading ? (
                <p>Loading bookings...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : bookings.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Movie Title</th>
                            <th className="border px-4 py-2">Show Date</th>
                            <th className="border px-4 py-2">Show Time</th>
                            <th className="border px-4 py-2">Tickets</th>
                            <th className="border px-4 py-2">Total Amount</th>
                            <th className="border px-4 py-2">Payment Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking._id} className="hover:bg-gray-100">
                                <td className="border px-4 py-2">{booking.movie ? booking.movie.title : 'Movie Title Not Available'}</td>
                                <td className="border px-4 py-2">{booking.showtime ? new Date(booking.showtime.showDate).toLocaleDateString() : 'N/A'}</td>
                                <td className="border px-4 py-2">
                                    {booking.showtime
                                        ? formatShowtime(
                                            booking.showtime.showDate,
                                            new Date(`1970-01-01T${booking.showtime.showTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
                                          )
                                        : 'N/A'}
                                </td>
                                <td className="border px-4 py-2">{booking.ticketQuantity || 0}</td>
                                <td className="border px-4 py-2">{booking.totalPrice || 0} Taka</td>
                                
                                {booking.paymentStatus === 'Paid' ? (
                                    <td className="border px-4 py-2">
                                        <button className="btn" onClick={() => document.getElementById(`modal_${booking._id}`).showModal()}>Open Modal</button>
                                        <dialog id={`modal_${booking._id}`} className="modal">
                                            <div className="modal-box text-center">
                                                <p>Movie Name: {booking.movie ? booking.movie.title : 'Movie Title Not Available'}</p>
                                                <p>Hall Name: {booking.showtime ? booking.showtime.hallName : 'N/A'}</p>
                                                <p>Show Date: {booking.showtime ? new Date(booking.showtime.showDate).toLocaleDateString() : 'N/A'}</p>
                                                <p>Show Time: {booking.showtime ? new Date(`1970-01-01T${booking.showtime.showTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'}</p>
                                                <p>Ticket Quantity: {booking.ticketQuantity || 0}</p>
                                                <p>Total Price: {booking.totalPrice || 0} Taka</p>

                                                {/* Display random numbers based on ticket quantity */}
                                                <div className='flex flex-row m-auto text-center justify-center'>
  <p>Ticket Numbers :  </p>
  <div>
    {generateRandomNumbers(booking.ticketQuantity).map((number, index) => (
      <span key={index} className="inline-block mr-2"> { number}</span>
    ))}
  </div>
</div>



                                                <div className="modal-action">
                                                    <button className="btn" onClick={() => document.getElementById(`modal_${booking._id}`).close()}>Close</button>
                                                </div>
                                            </div>
                                        </dialog>
                                    </td>
                                ) : (
                                    <td className="border px-4 py-2">
                                        <span className="font-bold">{booking.paymentStatus || 'N/A'}</span>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No bookings found.</p>
            )}
        </div>
    );
};

export default Favourites;
