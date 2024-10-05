import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Helmet } from 'react-helmet-async';

const AllContactMessage = () => {
    const [contacts, setContacts] = useState([]); // State to hold contact messages
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                // Set up headers with the token from cookies
                const headers = {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                };

                // Make the GET request with headers
                const response = await axios.get('http://127.0.0.1:5000/apis/all', { headers });

                // Check if the response is valid
                if (response.status === 200) {
                    setContacts(response.data); // Set contacts state
                } else {
                    setError('Failed to fetch contact messages.'); // Handle non-200 responses
                }
            } catch (err) {
                console.error('Error fetching contacts:', err);
                setError('Failed to fetch contact messages.'); // Set error message
            } finally {
                setLoading(false); // Set loading to false after fetch
            }
        };

        fetchContacts(); // Call the fetch function
    }, []); // Empty dependency array to run only once on mount

    // Function to delete a contact message
   
    
    

    return (
        <div className="container mx-auto p-4">
            <Helmet>
                <title>Movie | All Contact Message</title>
            </Helmet>
            <h1 className="text-3xl font-bold mb-6 text-center">All Contact Messages</h1>

            {loading ? (
                <p className="text-center text-xl text-gray-500">Loading...</p> // Show loading text while fetching
            ) : error ? (
                <p className="text-red-600 text-center text-lg">{error}</p> // Show error message
            ) : (
                <div className="bg-white shadow-lg rounded-lg p-6">
                    {contacts.length > 0 ? (
                        <ul className="space-y-4">
                            {contacts.map(contact => (
                                <li key={contact._id} className="border p-4 mb-2 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <h2 className="font-semibold text-lg">{contact.name}</h2>
                                    <p className="text-gray-600">{contact.email}</p>
                                    <p className="text-gray-800">{contact.message}</p>
                                    
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-lg text-gray-500">No contact messages found.</p> // Show message if no contacts exist
                    )}
                </div>
            )}
        </div>
    );
};

export default AllContactMessage;
