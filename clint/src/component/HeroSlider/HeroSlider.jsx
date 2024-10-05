import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { useState, useEffect } from "react";
import axios from 'axios';

const HeroSlider = () => {
    const [heroImages, setHeroImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/image/get'); // Fetching image data
                setHeroImages(response.data); // Assuming your API returns an array of image objects
           
           
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };

        fetchImages();
    }, []);

    return (
        <Carousel>
            {heroImages.map((imageData, index) => (
                <div key={index}>
                    <img 
                        src={`http://127.0.0.1:5000${imageData.image}`} // Adjust this depending on your API response structure
                        className='rounded-[14px] w-full h-auto object-cover' 
                        alt={`Slide ${index + 1}`} 
                    />
                </div>
            ))}
        </Carousel>
    );
}

export default HeroSlider;
