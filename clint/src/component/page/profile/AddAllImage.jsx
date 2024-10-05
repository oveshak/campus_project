import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // For cookie handling
import { Helmet } from 'react-helmet-async';

const AddAllImage = () => {
    const [title, setTitle] = useState(''); // State for the title input
    const [image, setImage] = useState(null); // State for the image file
    const [error, setError] = useState(''); // State for error messages
    const [success, setSuccess] = useState(''); // State for success messages
    const [imagePreview, setImagePreview] = useState(null); // State for image preview

    // Handle image file selection
    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Get the selected file
        setImage(file); // Store the selected file in state

        // Create a preview of the selected image
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setError('');
        setSuccess('');
        
        // Validate inputs
        if (!title || !image) {
            setError('Please fill in all fields.');
            return;
        }
        
        const formData = new FormData(); // Create a new FormData object
        formData.append('title', title); // Append title to the form data
        formData.append('image', image); // Append image file to the form data
        
        try {
            const headers = {
                Authorization: `Bearer ${Cookies.get('token')}`, // Include token if required
            };
            
            // Send the request to the backend
            const response = await axios.post('http://127.0.0.1:5000/image/upload', formData, { headers });
            setSuccess('Image uploaded successfully!'); // Success message
            
            // Reset form fields
            setTitle('');
            setImage(null);
            setImagePreview(null);
        } catch (err) {
            console.error('Error Details:', err); // Log full error details
            const errorMessage = err.response?.data?.message || 'Error uploading image. Please try again.';
            setError(errorMessage); // Set error message if the request fails
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
            <Helmet>
                <title>Movie | Add Image</title>
            </Helmet>
            <h2 className="text-2xl font-bold mb-4">Add New Image</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                        Image
                    </label>
                    <input
                        type="file"
                        id="image"
                        onChange={handleImageChange}
                        className="border border-gray-300 rounded p-2 w-full"
                        accept="image/*"
                        required
                    />
                </div>

                {/* Image Preview */}
                {imagePreview && (
                    <div className="mb-4">
                        <img src={imagePreview} alt="Image Preview" className="w-full h-auto border rounded" />
                    </div>
                )}

                <button
                    type="submit"
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
                >
                    Upload
                </button>
            </form>
            {error && <p className="text-red-500 mt-4">{error}</p>} {/* Display error message */}
            {success && <p className="text-green-500 mt-4">{success}</p>} {/* Display success message */}
        </div>
    );
};

export default AddAllImage;
