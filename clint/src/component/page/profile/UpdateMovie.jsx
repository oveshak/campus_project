import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateMovie = () => {
  const { id } = useParams(); // Get the movie ID from the URL
  const navigate = useNavigate();

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
    showtimes: [], // Include showtimes
  });

  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showtimeOptions, setShowtimeOptions] = useState([]); // To store available showtimes

  // Fetch the existing movie data
  const fetchMovieData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/${id}`);
      setMovieData(response.data); // Ensure response data structure matches the state
    } catch (error) {
      console.error(error);
      setErrorMessage('Error fetching movie data, please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch available showtimes
  const fetchShowtimes = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/'); // Adjust the URL based on your API
      setShowtimeOptions(res.data); // Assuming the API returns an array of showtimes
    } catch (error) {
      console.error('Error fetching showtimes:', error);
    }
  };

  useEffect(() => {
    fetchMovieData(); // Fetch movie data on component mount
    fetchShowtimes(); // Fetch showtimes on component mount
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'image') {
      setMovieData({
        ...movieData,
        [name]: e.target.files[0], // Correctly handle file input
      });
    } else {
      setMovieData({
        ...movieData,
        [name]: value,
      });
    }
  };

  // Handle showtime changes
  const handleShowtimeChange = (e) => {
    const selectedShowtimes = Array.from(e.target.selectedOptions, (option) => option.value);
    setMovieData({ ...movieData, showtimes: selectedShowtimes });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const headers = {
      Authorization: `Bearer ${Cookies.get('token')}`,
      'Content-Type': 'multipart/form-data', // Ensure the correct content type
    };
    const formData = new FormData();

    // Append each property to the form data
    Object.entries(movieData).forEach(([key, value]) => {
      if (key === "showtimes") {
        // Append each showtime ID separately
        value.forEach(showtimeId => {
          formData.append('showtimes[]', showtimeId);
        });
      } else {
        formData.append(key, value);
      }
    });

    try {
      const response = await axios.put(`http://127.0.0.1:5000/api/${id}`, formData, { headers });
      console.log('API Response:', response.data); // Log success response
      setSuccessMessage('Movie updated successfully!');
      
      // Redirect to the movie list or any other page
      setTimeout(() => {
        navigate('/');
      }, 2000); // Optional delay before redirecting
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message); // Log error response
      setErrorMessage('Error updating movie, please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Update Movie</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form 
          onSubmit={handleSubmit} 
          className="bg-gray-100 p-6 rounded-lg shadow-md" 
          encType="multipart/form-data" // Important for file uploads
        >
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
              value={movieData.releaseDate.split('T')[0]} // Format date to match input
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
            {movieData.image && typeof movieData.image === 'string' && (
              <img 
                src={movieData.image} // Use the existing image URL
                alt="Current Movie"
                className="mb-2 w-32 h-32 object-cover"
              />
            )}
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
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

          {/* Showtimes Selection */}
         
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

          {/* Submit Button */}
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Update Movie
          </button>

          {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
          {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
        </form>
      )}
    </div>
  );
};

export default UpdateMovie;
