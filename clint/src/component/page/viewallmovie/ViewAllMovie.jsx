import { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import axios from 'axios';
import MovieCard from '../../sheard/moviecard/MovieCard'; // Adjust path as per your folder structure
import './style.css';
import { Helmet } from 'react-helmet-async';

const ViewAllMovie = () => {
    const movecategory = ['show now', 'upcoming'];
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Define the isLoading state

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/api/all');
                const filteredMovies = response.data.filter(movie => movie.category); // Ensure each movie has a category
                setMovies(filteredMovies);
                setIsLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error('Error fetching movies:', error);
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, []);

    const getMoviesByCategory = category => {
        return movies.filter(movie => movie.category === category);
    };

    return (
        <div>
            <Helmet>
            <title>Movie | Show-All-Movie </title>
            </Helmet>
            <div className="hero bg-base-200 h-[380px]">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold">Show All Movie</h1>
                        <p className="py-6">
                            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                            quasi. In deleniti eaque aut repudiandae et a id nisi.
                        </p>
                    </div>
                </div>
            </div>

            <div className="my-10">
                <Tabs>
                    <TabList>
                        <section className="flex justify-between mb-3">
                            <div className="flex gap-8 justify-center m-auto mb-1">
                                {movecategory.map((item, index) => (
                                    <Tab
                                        key={index}
                                        className={`tab-btn items-center capitalize cursor-pointer  ${
                                            index === 0 ? 'active' : ''
                                        }`}
                                    >
                                        {item}
                                    </Tab>
                                ))}
                            </div>
                        </section>
                    </TabList>

                    <div className="my-9">
                        {movecategory.map((category, index) => (
                            <TabPanel key={index}>
                                {isLoading ? (
                                    <p>Loading movies...</p>
                                ) : getMoviesByCategory(category).length > 0 ? (
                                    <div>
                                        <MovieCard movies={getMoviesByCategory(category)} />
                                    </div> // Pass the movies as props to MovieCard
                                ) : (
                                    <p>No movies available in this category.</p>
                                )}
                            </TabPanel>
                        ))}
                    </div>
                </Tabs>
            </div>
        </div>
    );
};

export default ViewAllMovie;
