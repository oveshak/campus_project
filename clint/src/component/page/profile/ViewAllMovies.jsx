import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet-async';
const ViewAllMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate=useNavigate()

  // Fetch movies from the API
  const fetchMovies = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${Cookies.get('token')}`, // Get token from cookies
      };
      const response = await axios.get('http://127.0.0.1:5000/api/all', { headers });
      setMovies(response.data); // Assuming response.data is an array of movies
    } catch (error) {
      console.error(error);
      setErrorMessage('Error fetching movies, please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(); // Fetch movies on component mount
  }, []);

  // Handle delete movie
  const handleDelete = async (movieId) => {
    // Show confirmation dialog first
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });
  
    if (result.isConfirmed) {
      // Optimistically remove the movie from the state
      const updatedMovies = movies.filter(movie => movie._id !== movieId);
      setMovies(updatedMovies); 
  
      try {
        const headers = {
          Authorization: `Bearer ${Cookies.get('token')}`, // Get token from cookies
        };
  
        // Proceed with the delete request
        await axios.delete(`http://127.0.0.1:5000/api/${movieId}`, { headers });
  
        // Show success message after deletion
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Movie deleted successfully!",
          showConfirmButton: false,
          timer: 1500
        });
  
      } catch (error) {
        console.error(error);
        setErrorMessage('Error deleting movie, please try again.');
  
        // Revert back to the previous state if there was an error
        fetchMovies(); // Refetch movies from the API to restore the list
      }
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <Helmet>
                <title>Movie | All Movie</title>
            </Helmet>
      <h2 className="text-2xl font-bold mb-4">Movie List</h2>
      {loading && <p>Loading...</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {movies.length === 0 ? (
        <p>No movies available.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Genre</th>
              <th className="py-2 px-4 border-b">Rating</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie._id}>
                <td className="py-2 px-4 border-b">{movie.title}</td>
                <td className="py-2 px-4 border-b">{movie.genre}</td>
                <td className="py-2 px-4 border-b">{movie.rating}</td>
                <td className="py-2 px-4 border-b">
               <div>
               <button
                    className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 mr-2"
                    onClick={() => navigate(`/profile/update/${movie._id}`)} // Navigate to update page with movie ID
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                    onClick={() => handleDelete(movie._id)}
                  >
                    Delete
                  </button>
               </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ViewAllMovies;
