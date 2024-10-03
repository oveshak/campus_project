import { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
// Import MovieCard component
import './style.css';
import MovieCard from '../sheard/moviecard/MovieCard';

const MovieTab = () => {
    const movieCategories = ['show now', 'upcoming'];
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('http://127.0.0.1:5000/api/all');
                const filteredMovies = response.data.filter(movie => movie.category);
                setMovies(filteredMovies);
            } catch (err) {
                console.error('Error fetching movies:', err);
                setError('Error fetching movies');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, []);

    const getMoviesByCategory = (category) => {
        return movies.filter(movie => movie.category?.toLowerCase() === category.toLowerCase());
    };

    return (
        <div>
            <Tabs>
                <TabList>
                    <section className='flex justify-between mb-2'>
                        <div className='flex gap-4'>
                            {movieCategories.map((item, index) => (
                                <Tab key={index} className='tab-btn items-center capitalize cursor-pointer'>
                                    {item}
                                </Tab>
                            ))}
                        </div>
                        <button className='btn'>
                            <Link to='/viewallmovie'>View All Movies</Link>
                        </button>
                    </section>
                </TabList>

                <div className='my-6'>
                    {movieCategories.map((category, index) => (
                        <TabPanel key={index}>
                            {isLoading ? (
                                <p>Loading movies...</p>
                            ) : error ? (
                                <p>{error}</p>
                            ) : getMoviesByCategory(category).length > 0 ? (
                                <MovieCard movies={getMoviesByCategory(category).slice(0, 4)} />
                            ) : (
                                <p>No movies available in this category.</p>
                            )}
                        </TabPanel>
                    ))}
                </div>

                <div className='flex justify-center mt-4'>
                    <button className='btn'>
                        <Link to='/viewallmovie'>Show All Movies</Link>
                    </button>
                </div>
            </Tabs>
        </div>
    );
};

export default MovieTab;
