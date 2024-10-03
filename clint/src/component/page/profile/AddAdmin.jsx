import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import Cookies from 'js-cookie'; // Import the js-cookie library
import { AuthContext } from '../../../provider/AuthProvider';

const AddAdmin = () => {
    const [users, setUsers] = useState([]); // State to store users
    const [loading, setLoading] = useState(true); // Loading state
    const { user } = useContext(AuthContext); // Get user details from context

    useEffect(() => {
        // Fetch data from the API on component mount
        const fetchUsers = async () => {
            const headers = {
                Authorization: `Bearer ${Cookies.get('token')}`, // Get token from cookies
            };

            try {
                const response = await axios.get('http://127.0.0.1:5000/user/getalluser', {
                    withCredentials: true,
                    headers,
                });

                setUsers(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setLoading(false);
            }
        };

        if (user) {
            fetchUsers(); // Fetch users if user is logged in
        } else {
            setLoading(false); // Stop loading if no user
        }
    }, [user]);

    // Function to update user role
    const updateUserRole = async (userId, newRole) => {
        const headers = {
            Authorization: `Bearer ${Cookies.get('token')}`, // Get token from cookies
        };

        try {
            const response = await axios.put(`http://127.0.0.1:5000/user/updateadmin/${userId}`, { role: newRole }, { headers });
            setUsers(users.map((u) => (u._id === userId ? response.data : u))); // Update user in state
            console.log(response.data);
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user._id} className={index % 2 === 0 ? 'bg-base-200' : ''}>
                            <th>{index + 1}</th>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button
                                    onClick={() => updateUserRole(user._id, user.role === 'admin' ? 'user' : 'admin')}
                                    className="bg-blue-500 text-white font-semibold py-1 px-2 rounded hover:bg-blue-600"
                                >
                                    {user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AddAdmin;
