import React, { useContext, useState } from 'react';
import { GiSightDisabled } from "react-icons/gi";
import { BiSolidShow } from "react-icons/bi";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import { AuthContext } from '../../../provider/AuthProvider';
import Swal from 'sweetalert2';

const Login = () => {
    const { logIn } = useContext(AuthContext);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    

    // Get the 'from' location or set it to home if undefined
   const from=location.state?.from?.pathname || "/"
   console.log(from)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            setLoading(true);
            await logIn(email, password);
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Login successfully",
                showConfirmButton: false,
                timer: 1300,
            });
            e.target.reset()
             // Navigate to the page the user came from
             setTimeout(() => {
                // Refresh the page
                
                // Navigate to login page after refresh
                navigate(from,{replace:true})
                window.location.reload();
            }, 1000);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Logn Failed",
            });
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <>
            <Helmet>
                <title>Movie | Login</title>
            </Helmet>
            <div className="hero my-3 min-h-screen">
                <div className="hero-content flex-col">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold">Login now!</h1>
                    </div>
                    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                        <form onSubmit={handleSubmit} className="card-body">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    type="email"
                                    name='email'
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
                                        name='password'
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
                                    {loading ? 'Logging in...' : 'Login'}
                                </button>
                            </div>
                        </form>
                        <p className='text-center mb-7'>Don't have an account? <Link className='text-gray-50' to="/signup">Register</Link></p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login