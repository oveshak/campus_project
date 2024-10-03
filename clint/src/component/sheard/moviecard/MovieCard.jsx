import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const MovieCard = ({ movies }) => {
    return (
        <div className="container mx-auto p-5">
            <Helmet>
                <title>Movie | Movie-Details</title>
            </Helmet>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {movies.map(movie => (
                    <div key={movie._id} className="w-full bg-gradient-to-r from-purple-800 to-purple-600 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition duration-300">
                        <div className="relative">
                        <img
    src={`http://127.0.0.1:5000${movie.image}`}
    alt={movie.title}
    className="w-full h-48 object-cover"
/>
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition duration-300">
                                <button className="text-white bg-purple-700 hover:bg-purple-900 rounded-full p-3 focus:outline-none">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M4.293 9.293a1 1 0 011.414 0L10 13.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <h2 className="text-white text-lg font-bold mb-2 truncate">{movie.title}</h2>
                            <p className="text-gray-300 text-sm mb-1">Release: {movie.releaseDate}</p>
                            <p className="text-gray-300 text-sm mb-4">Genre: {movie.genre}</p>
                            <div className="flex space-x-2">
                            <Link to={`/ticket/${movie._id}`}>
                            <button className="bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-900 transition duration-300 focus:outline-none">
                                    Get Tickets
                                </button>
                            </Link>
                                <Link to={`/detail/${movie._id}`}>
                                    <button className="bg-transparent border border-purple-700 text-purple-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 hover:text-white transition duration-300 focus:outline-none">
                                        Details
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MovieCard;
