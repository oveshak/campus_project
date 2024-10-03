import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

import img1 from '../../assets/subhome-ai.jpeg'; 

import { useState, useEffect } from "react";

const HeroSlider = () => {
    const [heroImages, setHeroImages] = useState([]);

    const images = [img1, img1, img1]; // Add all your images to this array

    useEffect(() => {
        setHeroImages(images); // Set images array in state if needed later
    }, []);

    return (
        <Carousel>
            {heroImages.map((image, index) => (
                <div key={index}>
<img 
  src={image} 
  className='rounded-[14px] w-full h-auto object-cover' 
  alt={`Slide ${index + 1}`} 
/>
                </div>
            ))}
        </Carousel>
    );
}

export default HeroSlider;
