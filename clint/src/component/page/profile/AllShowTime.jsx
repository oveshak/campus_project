import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; 
import { Helmet } from 'react-helmet-async';
import Cookies from 'js-cookie';

const AllShowTime = () => {
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedShowtime, setSelectedShowtime] = useState({
        _id: '',
        hallName: '',
        showDate: '',
        showTime: '',
        seatType: '',
        price: '',
        availableSeats: '',
    });

    // Define available seat types
    const seatTypes = ['Standard', 'VIP', 'Deluxe', 'Couple', 'Child'];

    useEffect(() => {
        const fetchShowtimes = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/api/'); // Adjust to your actual endpoint
                setShowtimes(response.data); 
            } catch (err) {
                console.error("Error fetching showtimes:", err);
                setError('Error fetching showtimes. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchShowtimes();
    }, []);

    const handleDelete = async (showtimeId) => {
        try {
            const headers = {
                Authorization: `Bearer ${Cookies.get('token')}`,
            };
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3B82F6",
                cancelButtonColor: "#EF4444",
                confirmButtonText: "Yes, delete it!",
            });

            if (result.isConfirmed) {
                await axios.delete(`http://127.0.0.1:5000/api/showtimes/${showtimeId}`, { headers });
                setShowtimes(showtimes.filter(showtime => showtime._id !== showtimeId));
                Swal.fire("Deleted!", "Your showtime has been deleted.", "success");
            }
        } catch (err) {
            console.error("Error deleting showtime:", err);
            Swal.fire("Error!", "Failed to delete showtime.", "error");
        }
    };

    const handleUpdate = (showtime) => {
        setSelectedShowtime(showtime);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedShowtime({
            _id: '',
            hallName: '',
            showDate: '',
            showTime: '',
            seatType: '',
            price: '',
            availableSeats: '',
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedShowtime((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const headers = {
            Authorization: `Bearer ${Cookies.get('token')}`,
        };

        try {
            await axios.put(`http://127.0.0.1:5000/api/showtimes/${selectedShowtime._id}`, selectedShowtime, { headers });
            setShowtimes((prev) =>
                prev.map((showtime) =>
                    showtime._id === selectedShowtime._id ? selectedShowtime : showtime
                )
            );
            Swal.fire("Updated!", "Your showtime has been updated.", "success");
            handleModalClose();
        } catch (err) {
            console.error("Error updating showtime:", err);
            Swal.fire("Error!", "Failed to update showtime.", "error");
        }
    };

    if (loading) {
        return <p className="text-center text-gray-500 animate-pulse">Loading showtimes...</p>;
    }

    if (error) {
        return <p className="text-center text-red-600">{error}</p>;
    }

    return (
        <div className="bg-gray-50 p-8 rounded-lg shadow-md">
            <Helmet>
                <title>Movie | All ShowTime</title>
            </Helmet>
            <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">All Show Times</h2>
            {showtimes.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow-lg border border-gray-200 mx-auto">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="border-b border-gray-300 px-6 py-3 text-left text-gray-700">Hall Name</th>
                                <th className="border-b border-gray-300 px-6 py-3 text-left text-gray-700">Show Date</th>
                                <th className="border-b border-gray-300 px-6 py-3 text-left text-gray-700">Show Time</th>
                                <th className="border-b border-gray-300 px-6 py-3 text-left text-gray-700">Seat Type</th>
                                <th className="border-b border-gray-300 px-6 py-3 text-left text-gray-700">Price (Taka)</th>
                                <th className="border-b border-gray-300 px-6 py-3 text-left text-gray-700">Available Seats</th>
                                <th className="border-b border-gray-300 px-6 py-3 text-left text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showtimes.map((showtime) => (
                                <tr key={showtime._id} className="hover:bg-blue-50 transition duration-300 ease-in-out">
                                    <td className="border-b border-gray-300 px-6 py-4 text-gray-800">{showtime.hallName}</td>
                                    <td className="border-b border-gray-300 px-6 py-4 text-gray-800">{new Date(showtime.showDate).toLocaleDateString()}</td>
                                    <td className="border-b border-gray-300 px-6 py-4 text-gray-800">{showtime.showTime}</td>
                                    <td className="border-b border-gray-300 px-6 py-4 text-gray-800">{showtime.seatType}</td>
                                    <td className="border-b border-gray-300 px-6 py-4 text-gray-800">{showtime.price} Taka</td>
                                    <td className="border-b border-gray-300 px-6 py-4 text-gray-800">{showtime.availableSeats}</td>
                                    <td className="border-b border-gray-300 px-6 py-4 flex space-x-2">
                                        <button 
                                            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-200" 
                                            onClick={() => handleUpdate(showtime)}
                                        >
                                            Update
                                        </button>
                                        <button 
                                            className="bg-red-600 text-white font-semibold py-2 px-4 rounded hover:bg-red-700 transition duration-200" 
                                            onClick={() => handleDelete(showtime._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-4">No showtimes available.</p>
            )}

            {/* Update Modal */}
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/3">
                        <h2 className="text-2xl font-semibold mb-4">Update Showtime</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Hall Name:</label>
                                <input
                                    type="text"
                                    name="hallName"
                                    value={selectedShowtime.hallName}
                                    onChange={handleChange}
                                    className="border rounded w-full py-2 px-3"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Show Date:</label>
                                <input
                                    type="date"
                                    name="showDate"
                                    value={selectedShowtime.showDate ? selectedShowtime.showDate.substring(0, 10) : ''}
                                    onChange={handleChange}
                                    className="border rounded w-full py-2 px-3"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Show Time:</label>
                                <input
                                    type="time"
                                    name="showTime"
                                    value={selectedShowtime.showTime}
                                    onChange={handleChange}
                                    className="border rounded w-full py-2 px-3"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Seat Type:</label>
                                <select
                                    name="seatType"
                                    value={selectedShowtime.seatType}
                                    onChange={handleChange}
                                    className="border rounded w-full py-2 px-3"
                                    required
                                >
                                    <option value="">Select Seat Type</option>
                                    {seatTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Price (Taka):</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={selectedShowtime.price}
                                    onChange={handleChange}
                                    className="border rounded w-full py-2 px-3"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Available Seats:</label>
                                <input
                                    type="number"
                                    name="availableSeats"
                                    value={selectedShowtime.availableSeats}
                                    onChange={handleChange}
                                    className="border rounded w-full py-2 px-3"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleModalClose}
                                    className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded mr-2 hover:bg-gray-400 transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllShowTime;
