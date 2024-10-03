import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AddShowtime = () => {
  const [showtimeData, setShowtimeData] = useState({
    hallName: '',
    showDate: '',
    showTime: '',
    seatType: 'Standard', // Default value
    price: 0,
    availableSeats: 0
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShowtimeData({
      ...showtimeData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const headers = {
      Authorization: `Bearer ${Cookies.get('token')}`, // Get token from cookies
    };

    setLoading(true); // Start loading

    try {
      const res = await axios.post('http://127.0.0.1:5000/api/showtimes', showtimeData, { headers });
      setSuccessMessage('Showtime added successfully!');
      setShowtimeData({
        hallName: '',
        showDate: '',
        showTime: '',
        seatType: 'Standard',
        price: 0,
        availableSeats: 0,
      });
    } catch (error) {
      setErrorMessage('Error adding showtime, please try again.');
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add Showtime</h2>
      <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg shadow-md">
        
        {/* Hall Name */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="hallName">Hall Name</label>
          <input
            type="text"
            name="hallName"
            value={showtimeData.hallName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Show Date */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="showDate">Show Date</label>
          <input
            type="date"
            name="showDate"
            value={showtimeData.showDate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Show Time */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="showTime">Show Time</label>
          <input
            type="time"
            name="showTime"
            value={showtimeData.showTime}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Seat Type */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="seatType">Seat Type</label>
          <select
            name="seatType"
            value={showtimeData.seatType}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="Standard">Standard</option>
            <option value="Full Recliner">Full Recliner</option>
            <option value="Luxury">Luxury</option>
            <option value="VIP">VIP</option>
          </select>
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="price">Price</label>
          <input
            type="number"
            name="price"
            value={showtimeData.price}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Available Seats */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="availableSeats">Available Seats</label>
          <input
            type="number"
            name="availableSeats"
            value={showtimeData.availableSeats}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Success/Error Messages */}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className={`bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading} // Disable button while loading
        >
          {loading ? 'Adding...' : 'Add Showtime'}
        </button>
      </form>
    </div>
  );
};

export default AddShowtime;

