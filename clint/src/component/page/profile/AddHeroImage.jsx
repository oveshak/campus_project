import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // For cookie handling
import { Helmet } from 'react-helmet-async';

const HeroImageManager = () => {
    const [images, setImages] = useState([]); // State for the images list
    const [error, setError] = useState(''); // State for error messages
    const [success, setSuccess] = useState(''); // State for success messages

    // Fetch images from the AllImage collection
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/image/get'); // Fetching all images
                setImages(response.data); // Store fetched images in state
            } catch (err) {
                console.error('Error fetching images:', err); // Log error if fetching fails
                setError('Failed to load images. Please try again later.'); // Set error message
            }
        };

        fetchImages(); // Call the function to fetch images
    }, []); // Empty dependency array ensures this runs once

    const handleDelete = async (imageId) => {
        console.log(imageId); // Log the imageId to ensure it's being passed correctly

        // Optimistically update the state
        const updatedImages = images.filter(image => image._id !== imageId);
        setImages(updatedImages); // Update state immediately

        try {
            const headers = {
                Authorization: `Bearer ${Cookies.get('token')}`, // Include token if required
            };
            await axios.delete(`http://127.0.0.1:5000/image/delete/${imageId}`, { headers });
            setSuccess('Image deleted successfully!');
        } catch (err) {
            console.error('Error deleting image:', err.response?.data || err.message);
            setError('Failed to delete the image. Please try again.');
            setImages(images); // Revert back to the original images state on error
        }
    };
    

    // Function to update an image (assumes title is being updated)
    

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow-lg">
            <Helmet>
                <title>Manage Hero Images</title>
            </Helmet>
            <h2 className="text-3xl font-bold mb-6 text-center">Manage Hero Images</h2>

            <div className="mb-6">
                <label className="block text-gray-700 text-lg font-bold mb-2">Images List</label>
                {images.length === 0 ? (
                    <p className="text-gray-500">No images available.</p>
                ) : (
                    images.map((image) => (
                        <div key={image._id} className="flex items-center border-b border-gray-300 py-4">
                            <img src={`http://127.0.0.1:5000${image.image}`} alt={image.title} className="w-16 h-16 object-cover rounded mr-4" /> {/* Image thumbnail */}
                            <div className="flex-1">
                                <label className="text-gray-700 font-semibold">{image.title || 'Image'}</label>
                            </div>
                         
                            <button 
                                type="button" 
                                onClick={() => handleDelete(image._id)} 
                                className="ml-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>

            {error && <p className="text-red-500 mt-4 font-semibold">{error}</p>} {/* Display error message */}
            {success && <p className="text-green-500 mt-4 font-semibold">{success}</p>} {/* Display success message */}
        </div>
    );
};

export default HeroImageManager;
