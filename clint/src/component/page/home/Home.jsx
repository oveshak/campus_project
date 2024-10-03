import React from 'react';
import HeroSlider from '../../HeroSlider/HeroSlider';
import MovieTab from '../../movietab/MovieTab';
import { Helmet } from 'react-helmet-async';

const Home = () => {
    return (
        <div className='my-5'>
            <Helmet>
            <title>Movie | Home</title>
            </Helmet>
           <HeroSlider/>
           <MovieTab/>
        </div>
    );
}

export default Home;
