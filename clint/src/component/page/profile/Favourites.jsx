import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthContext } from '../../../provider/AuthProvider';
import { jsPDF } from 'jspdf';
import { Helmet } from 'react-helmet-async';
import logo from '../../../assets/360_F_500611919_5wuf1qGRCubiXXxIa7og1fLLCyHi6qP9.jpg';

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

    const formatShowtime = (date, time) => {
        return `${new Date(date).toLocaleDateString()} - ${time}`;
    };

    const generateRandomNumbers = (quantity) => {
        return Array.from({ length: quantity }, () => Math.floor(Math.random() * 100));
    };

    const downloadBookingData = (booking) => {
        const doc = new jsPDF();
    
        // Check if the logo is correctly loaded
        const img = new Image();
        img.src = logo;
    
        img.onload = () => {
            // Add logo to the PDF (Centered)
            const logoWidth = 50;
            const logoHeight = 20;
            const xPosition = (doc.internal.pageSize.getWidth() - logoWidth) / 2; // Center the logo
            doc.addImage(img, 'JPEG', xPosition, 10, logoWidth, logoHeight);
    
            // Title
            doc.setFontSize(18);
            doc.setTextColor(40, 40, 40);
            doc.text('Booking Details', 20, 40);
    
            // Line separator
            doc.setDrawColor(0, 0, 0);
            doc.line(20, 44, 190, 44);
    
            // Movie Title (Next to the Logo)
            if (booking.movie) {
                const movieTitleY = 50; // Y position for movie title
                const movieTitle = booking.movie.title;
                doc.setFontSize(16);
                doc.setTextColor(40, 40, 40);
                doc.text(movieTitle, 20, movieTitleY);
            }
    
            // Table headers
            const headers = ["Field", "Value"];
            const headerY = 60; // Adjusted for new title position
            const cellWidth = 90;
    
            // Draw headers
            
    
            // Add bottom gap before the table data
            const gap = 10; // Adjust this value to set the gap
            const dataStartY = headerY + 10 + gap; // Start drawing table data after gap
    
            // Draw table data
            const tableData = [
                ["Movie Name", booking.movie ? booking.movie.title : 'N/A'],
                ["Hall Name", booking.showtime ? booking.showtime.hallName : 'N/A'],
                ["Show Date", booking.showtime ? new Date(booking.showtime.showDate).toLocaleDateString() : 'N/A'],
                ["Show Time", booking.showtime ? new Date(`1970-01-01T${booking.showtime.showTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'],
                ["Ticket Quantity", (booking.ticketQuantity || 0).toString()],  // Convert to string
                ["Total Price", `${(booking.totalPrice || 0).toString()} Taka`], // Convert to string
                ["Ticket Numbers", generateRandomNumbers(booking.ticketQuantity).join(' | ')]
            ];
    
            doc.setTextColor(0);
            tableData.forEach((row, rowIndex) => {
                const y = dataStartY + (rowIndex * 10); // Calculate the y position based on dataStartY
                row.forEach((cell, colIndex) => {
                    doc.text(cell.toString(), 20 + colIndex * cellWidth + 5, y); // Ensure all values are string
                    doc.rect(20 + colIndex * cellWidth, y - 8, cellWidth, 10);
                });
            });
    
            // Thank you note
            doc.setFontSize(12);
            doc.setTextColor(80, 80, 80);
            doc.text('Thank you for your booking!', 20, dataStartY + 10 + tableData.length * 10 + 10);
    
            // Save the document
            doc.save(`booking_${booking._id}.pdf`);
        };
    
        // Handle image error
        img.onerror = () => {
            console.error('Error loading image');
        };
    };
    
    
    
    
    
    
    

    return (
        <div className="bg-gray-100 p-6">
            <Helmet>
                <title>Movie | User Booking</title>
            </Helmet>
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
                                        <button className="btn" onClick={() => {
                                            const modal = document.getElementById(`modal_${booking._id}`);
                                            modal.showModal(); // Open modal
                                        }}>Open Modal</button>
                                        <dialog id={`modal_${booking._id}`} className="modal">
                                            <div className="modal-box text-center">
                                                <p>Movie Name: {booking.movie ? booking.movie.title : 'Movie Title Not Available'}</p>
                                                <p>Hall Name: {booking.showtime ? booking.showtime.hallName : 'N/A'}</p>
                                                <p>Show Date: {booking.showtime ? new Date(booking.showtime.showDate).toLocaleDateString() : 'N/A'}</p>
                                                <p>Show Time: {booking.showtime ? new Date(`1970-01-01T${booking.showtime.showTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'}</p>
                                                <p>Ticket Quantity: {booking.ticketQuantity || 0}</p>
                                                <p>Total Price: {booking.totalPrice || 0} Taka</p>
                                                <p>Payment Status: {booking.paymentStatus}</p>
                                                <button className="btn" onClick={() => downloadBookingData(booking)}>Download PDF</button>
                                                <button className="btn" onClick={() => {
                                                    const modal = document.getElementById(`modal_${booking._id}`);
                                                    if (modal) {
                                                        modal.close(); // Close modal
                                                    }
                                                }}>Close</button>
                                            </div>
                                        </dialog>
                                    </td>
                                ) : (
                                    <td className="border px-4 py-2 text-red-500">{booking.paymentStatus}</td>
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
