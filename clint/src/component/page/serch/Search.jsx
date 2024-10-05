import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import MovieCard from '../../sheard/moviecard/MovieCard';

const Search = () => {
    const [searchQuery, setSearchQuery] = useState(''); // State for search input
    const [filterProduct, setFilterProduct] = useState([]); // State for filtered products (movies)
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state

    // Function to handle search with backend API or fetch all movies
    const handleSearch = async () => {
        setLoading(true);
        setError(null); // Reset error state before new search
    
        try {
            let response;
            if (searchQuery.trim()) {
                response = await axios.get(`http://127.0.0.1:5000/api/search`, {
                    params: { title: searchQuery },
                });
            } else {
                response = await axios.get(`http://127.0.0.1:5000/api/all`);
            }
    
            setFilterProduct(response.data);
        } catch (err) {
            console.error("Error details:", err.response ? err.response.data : err.message);
            setError(err.response?.data?.message || 'Error fetching movies. Please try again later.');
        } finally {
            setLoading(false);
        }
    };
    

    // Fetch all movies when the component mounts
    useEffect(() => {
        handleSearch(); // Fetch all movies initially
    }, []);

    // Log fetched movies for debugging
    useEffect(() => {
        console.log('Movies fetched:', filterProduct);
    }, [filterProduct]);

    return (
        <>
            <Helmet>
                <title>Movie | Search Page</title>
            </Helmet>

            <div className="hero bg-base-200 h-[480px]">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold">Search Page</h1>
                        <p className="py-6">Find your favorite movies by searching for their title, category, or synopsis.</p>
                    </div>
                </div>
            </div>

            <section className="py-10">
                <div className="container mx-auto px-6">
                    {/* Search Input and Button */}
                    <div className="flex flex-col md:flex-row justify-center items-center md:items-start mb-8 space-y-4 md:space-y-0 md:space-x-4">
                        <input
                            type="text"
                            placeholder="Search for a movie..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} // Update search query on change
                            className="w-full max-w-lg px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                        />
                        <button
                            onClick={handleSearch} // Trigger search on button click
                            className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-md"
                        >
                            Search
                        </button>
                    </div>

                    {/* Display loading, error, or filtered products */}
                    {loading ? (
                        <p className="text-center text-gray-600 text-lg">Loading...</p>
                    ) : error ? (
                        <p className="text-center text-red-600 text-lg">{error}</p>
                    ) : filterProduct.length > 0 ? (
                        <div>
                            <MovieCard movies={filterProduct} /> {/* Display movies */}
                        </div>
                    ) : (
                        <p className="text-center text-gray-600 text-lg mt-8">No movies found. Please try a different search.</p>
                    )}
                </div>
            </section>
        </>
    );
};

export default Search;
