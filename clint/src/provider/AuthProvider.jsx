import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios'; // Importing Axios
import Cookies from 'js-cookie';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = 'http://127.0.0.1:5000/user'; // Your backend API URL

    const createUser = async (name,email, password) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/signup`, {name, email, password });
            setUser(response.data.user);
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logIn = async (email, password) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            const { token } = response.data;
            Cookies.set('token', token); // Store token in cookies
            setUser(response.data.user);
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logOut = async () => {
        setLoading(true);
        try {
            await axios.post(`${API_URL}/logout`);
            Cookies.remove('token');
            setUser(null);
        } catch (error) {
            console.error('Error logging out:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            const token = Cookies.get('token'); // Check if token exists
            if (!token) {
                setLoading(false);
                return; // No token, exit early
            }

            try {
                const response = await axios.get(`${API_URL}/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Send token in the Authorization header
                    },
                    withCredentials: true,
                });
                setUser(response.data.user);
            } catch (error) {
                console.error('Error fetching user:', error);
                Cookies.remove('token'); // Clear token if there's an error
            } finally {
                setLoading(false);
            }
        };

        fetchUser(); // Fetch user on initial load
    }, []);

    const authInfo = {
        user,
        loading,
        logIn,
        createUser,
        logOut,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
