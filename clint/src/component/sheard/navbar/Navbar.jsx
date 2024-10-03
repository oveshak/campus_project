import React, { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { CiSearch } from "react-icons/ci";
import { FaUserAlt } from "react-icons/fa";
import { AuthContext } from '../../../provider/AuthProvider';

const Navbar = () => {

    const {user}=useContext(AuthContext)
    // Simulate user authentication status (change this according to your logic)
    // Example: simulate the user being logged out

    // State tracking the authentication status (initially set based on `user`)
    

    const link = [
        <li key="home"><NavLink to="/">Home</NavLink></li>,
        <li key="about"><NavLink to="/about">About</NavLink></li>,
        <li key="contact"><NavLink to="/contact">Contact</NavLink></li>
    ];

    return (
        <div className="navbar bg-base-100 z-10">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16"
                            />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                    >
                        {link}
                    </ul>
                </div>
                <div className="flex items-center space-x-2">
  <img className="w-[40px]" src="https://t4.ftcdn.net/jpg/05/00/61/19/360_F_500611919_5wuf1qGRCubiXXxIa7og1fLLCyHi6qP9.jpg" alt="movie icon" />
  <h1 className="text-2xl">MOVIE</h1>
</div>

            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {link}
                </ul>
            </div>
            <div className="navbar-end gap-2">
                {/* Search Icon */}
                <Link to="/search-movie" className="btn"><CiSearch size={24} /></Link>

                {/* Conditionally render Login/Logout buttons based on authentication */}
                {user? (
                    <Link to="/profile" className="btn"><FaUserAlt/></Link>
                ) : (
                    <>
                        <Link to="/login" className="btn">Login</Link>
                        {/* Uncomment if you want to show the Sign Up option */}
                        {/* <Link to="/signup" className="btn">Sign Up</Link> */}
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;
