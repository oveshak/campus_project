import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AllUserBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    const paymentStatuses = ['Paid', 'Pending', 'Cancelled'];

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const headers = {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                    'Content-Type': 'application/json',
                };

                const response = await axios.get('http://127.0.0.1:5000/user/alluserbook', { headers });
                setBookings(response.data.userBookings);
            } catch (err) {
                setError(err.response?.data?.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const formatShowtime = (showDate, showTime) => {
        const date = new Date(showDate);
        const [hours, minutes] = showTime.split(':');
        date.setHours(hours, minutes);

        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const updatePaymentStatus = async (bookingId) => {
        try {
            const headers = {
                Authorization: `Bearer ${Cookies.get('token')}`,
                'Content-Type': 'application/json',
            };

            const response = await axios.put(`http://127.0.0.1:5000/user/updateStatus/${bookingId}`, { paymentStatus: newStatus }, { headers });

            // Update the local state with the updated booking
            setBookings((prevBookings) => 
                prevBookings.map((booking) =>
                    booking._id === bookingId ? { ...booking, paymentStatus: newStatus } : booking
                )
            );

            console.log(response.data.message);
            setUpdatingId(null);
            setNewStatus('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update payment status');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Movie | All User Bookings</h1>
            {bookings.length > 0 ? (
                <table className="min-w-full border">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">User Name</th>
                            <th className="border px-4 py-2">Movie Title</th>
                            <th className="border px-4 py-2">Showtime</th>
                            <th className="border px-4 py-2">Seats</th>
                            <th className="border px-4 py-2">Total Price</th>
                            <th className="border px-4 py-2">Payment Status</th>
                            <th className="border px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking._id}>
                                <td className="border px-4 py-2">{booking.user?.name || 'N/A'}</td>
                                <td className="border px-4 py-2">{booking.movie ? booking.movie.title : 'N/A'}</td>
                                <td className="border px-4 py-2">{booking.showtime ? formatShowtime(booking.showtime.showDate, booking.showtime.showTime) : 'N/A'}</td>
                                <td className="border px-4 py-2">{booking.ticketQuantity || 'N/A'}</td>
                                <td className="border px-4 py-2">{booking.totalPrice || 'N/A'}</td>
                                <td className="border px-4 py-2">{booking.paymentStatus || 'N/A'}</td>
                                <td className="border px-4 py-2">
                                    {updatingId === booking._id ? (
                                        <>
                                            <select
                                                value={newStatus}
                                                onChange={(e) => setNewStatus(e.target.value)}
                                                className="border px-2 py-1"
                                            >
                                                <option value="">Select Status</option>
                                                {paymentStatuses.map((status) => (
                                                    <option key={status} value={status}>
                                                        {status}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={() => updatePaymentStatus(booking._id)}
                                                className="bg-blue-500 text-white px-2 py-1 rounded ml-2"
                                            >
                                                Update
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setUpdatingId(booking._id);
                                                setNewStatus(booking.paymentStatus);
                                            }}
                                            className="bg-green-500 text-white px-2 py-1 rounded"
                                        >
                                            Edit Status
                                        </button>
                                    )}
                                </td>
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

export default AllUserBookings;
