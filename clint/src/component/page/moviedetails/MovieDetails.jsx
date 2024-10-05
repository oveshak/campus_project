import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import { Helmet } from 'react-helmet-async';

const MovieDetails = () => {
    const { id } = useParams();
    console.log(id)
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/api/${id}`); // Fetch movie by ID
                setMovie(response.data); // Set the movie data
            } catch (error) {
                console.error("Error fetching movie details:", error);
            } finally {
                setLoading(false); // Set loading to false
            }
        };

        fetchMovieDetails();
    }, [id]);

    if (loading) {
        return <div className="text-center py-5">Loading...</div>;
    }

    if (!movie) {
        return <div className="text-center py-5">Movie not found!</div>;
    }

    return (
        <div className="container mx-auto p-5">
            <Helmet>
                <title>Movie | {movie.title}</title>
            </Helmet>
            {/* Hero Section */}
            <div className="hero bg-slate-500 h-[380px] mb-5 rounded-lg shadow-lg">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold text-white">{movie.title} Movie Details</h1>
                        <p className="py-4 text-white">{movie.description}</p>
                        <Link to={`/ticket/${movie._id}`} className="btn btn-primary">Get Tickets</Link>
                    </div>
                </div>
            </div>

            {/* Movie Details Section */}
            <div className="hero h-[380px] mb-5 rounded-lg ">
                <div>
                    <div className="flex flex-col md:flex-row items-center justify-center rounded-lg space-y-4 md:space-y-0 md:space-x-6">
                    <div className="flex-shrink-0">
    <img 
        src={`http://127.0.0.1:5000${movie.image}`} 
        alt={`${movie.title} Poster`} 
        className="rounded-lg shadow-lg max-w-xs md:max-w-sm max-h-80 object-cover transition-transform transform hover:scale-105"
    />
</div>

                        <div className="flex-grow text-center md:text-left ">
                            <h1 className="text-3xl font-bold text-white">{movie.title}</h1>
                            <p className="text-white mt-2">
    Release Date: <span className="font-medium">
        {new Date(movie.releaseDate).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}
    </span>
</p>
                            <p className="text-white mt-1">Genre: <span className="font-medium">{movie.genre}</span></p>
                            <p className="text-white mt-1">Rating: <span className="font-medium">{movie.rating}</span></p>
                            <p className="text-white mt-1">Duration: <span className="font-medium">{movie.duration} min</span></p>
                            <p className="text-white mt-1">Cast: <span className="font-medium">{movie.cast}</span></p>
                            <p className="text-white mt-1">Director: <span className="font-medium">{movie.director}</span></p>
                            <Link to={`/ticket/${movie.id}`} className="mt-4 inline-block px-6 py-2 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200">
                                Buy Tickets
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
