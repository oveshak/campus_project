import React, { useState,useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // Assuming you're using js-cookie for cookie handling

const AddMovie = () => {
  const [movieData, setMovieData] = useState({
    title: '',
    description: '',
    releaseDate: '',
    genre: '',
    rating: 0,
    duration: 0,
    cast: '',
    director: '',
    image: null,
    category: '',
    showtimes: [],  // Add showtimes field
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showtimeOptions, setShowtimeOptions] = useState([]); // To store available showtimes

  // Fetch available showtimes from the backend
  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5000/api/');
        setShowtimeOptions(res.data); // Assuming the API returns an array of showtimes
      } catch (error) {
        console.error('Error fetching showtimes:', error);
      }
    };

    fetchShowtimes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'image') {
      setMovieData({
        ...movieData,
        [name]: e.target.files[0],
      });
    } else {
      setMovieData({
        ...movieData,
        [name]: value,
      });
    }
  };

  const handleShowtimeChange = (e) => {
    const selectedShowtimes = Array.from(e.target.selectedOptions, (option) => option.value);
    setMovieData({ ...movieData, showtimes: selectedShowtimes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const headers = {
      Authorization: `Bearer ${Cookies.get('token')}`,
    };
  
    const formData = new FormData();
    
    // Append other fields to formData
    Object.entries(movieData).forEach(([key, value]) => {
      if (key === "showtimes") {
        // Append each showtime ID separately
        value.forEach(showtimeId => {
          formData.append('showtimes[]', showtimeId); // Use 'showtimes[]' to indicate an array
        });
      } else {
        formData.append(key, value);
      }
    });
  
    console.log("Showtimes before submitting:", movieData.showtimes); // Check the format
  
    setLoading(true);
  
    try {
      const res = await axios.post('http://127.0.0.1:5000/api/', formData, { headers });
      console.log(res.data);
      setSuccessMessage('Movie added successfully!');
      setMovieData({
        title: '',
        description: '',
        releaseDate: '',
        genre: '',
        rating: 0,
        duration: 0,
        cast: '',
        director: '',
        image: null,
        category: '',
        showtimes: [], // Reset showtimes
      });
    } catch (error) {
      console.error(error);
      setErrorMessage('Error adding movie, please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add Movie</h2>
      <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg shadow-md">
        {/* Movie Title */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            value={movieData.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Movie Description */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="description">Description</label>
          <textarea
            name="description"
            value={movieData.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Release Date */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="releaseDate">Release Date</label>
          <input
            type="date"
            name="releaseDate"
            value={movieData.releaseDate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Genre */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="genre">Genre</label>
          <input
            type="text"
            name="genre"
            value={movieData.genre}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Rating */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="rating">Rating (0-5)</label>
          <input
            type="number"
            name="rating"
            value={movieData.rating}
            onChange={handleChange}
            min="0"
            max="5"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Duration */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="duration">Duration (in minutes)</label>
          <input
            type="number"
            name="duration"
            value={movieData.duration}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Cast */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="cast">Cast</label>
          <input
            type="text"
            name="cast"
            value={movieData.cast}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Director */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="director">Director</label>
          <input
            type="text"
            name="director"
            value={movieData.director}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Image File */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="image">Image File</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*" // Accept only image files
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="category">Category</label>
          <select
            name="category"
            value={movieData.category}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select a category</option>
            <option value="upcoming">Upcoming</option>
            <option value="show now">Show Now</option>
          </select>
        </div>

        {/* Showtimes */}
        {movieData.category === 'show now' && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="showtimes">Showtimes</label>
            <select
              name="showtimes"
              multiple
              value={movieData.showtimes}
              onChange={handleShowtimeChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {showtimeOptions.map((showtime) => (
                <option key={showtime._id} value={showtime._id}>
                  {`${showtime.hallName} - ${new Date(showtime.showDate).toLocaleDateString()} - ${new Date(`1970-01-01T${showtime.showTime}`).toLocaleTimeString()}`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Success/Error Messages */}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        {/* Submit Button */}
        <button 
          type="submit" 
          className={`bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading} // Disable button when loading
        >
          {loading ? 'Adding...' : 'Add Movie'}
        </button>
      </form>
    </div>
  );
};

export default AddMovie;
