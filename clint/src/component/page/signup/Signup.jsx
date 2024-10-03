import React, { useContext, useState } from 'react';
import { GiSightDisabled } from "react-icons/gi";
import { BiSolidShow } from "react-icons/bi";
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../../../provider/AuthProvider';
import Swal from 'sweetalert2'; // Import SweetAlert2 for notifications

const Signup = () => {
    const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
    const [loading, setLoading] = useState(false); // State for loading indicator
    const { createUser } = useContext(AuthContext); // Get createUser from AuthContext
    const navigate = useNavigate(); // Hook for navigation

    const handleSubmit = async (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;

        console.log({ name, email, password });
        try {
            setLoading(true); // Set loading to true while registering
            await createUser(name, email, password); // Await the createUser process
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Registered successfully!",
                showConfirmButton: false,
                timer: 900,
            });
            
            // Delay navigation to ensure SweetAlert finishes
            setTimeout(() => {
                navigate('/login'); // Redirect to login page after success
            }, 1000); // Delay for smooth transition
            
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Registration failed. Please try again.",
            }); // Show SweetAlert for errors
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible); // Toggle password visibility
    };

    return (
        <>
            <Helmet>
                <title>Movie | Sign Up</title>
            </Helmet>
            <div className="hero my-3 min-h-screen">
                <div className="hero-content flex-col">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold">Sign Up!</h1>
                    </div>
                    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                        <form onSubmit={handleSubmit} className="card-body">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Username</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="username"
                                    className="input input-bordered"
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="email"
                                    className="input input-bordered"
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={passwordVisible ? 'text' : 'password'}
                                        placeholder="password"
                                        name="password"
                                        className="input input-bordered w-full"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 px-3 flex items-center text-sm"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {passwordVisible ? <BiSolidShow /> : <GiSightDisabled />}
                                    </button>
                                </div>
                            </div>
                            <div className="form-control mt-6">
                                <button className="btn btn-primary" disabled={loading}>
                                    {loading ? "Signing Up..." : "Sign Up"}
                                </button>
                            </div>
                        </form>
                        <p className="text-center mb-7">
                            Already have an account? <Link className="text-gray-50" to="/login">Login!</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signup;
