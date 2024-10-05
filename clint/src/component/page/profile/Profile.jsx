import React, { useContext } from 'react';
import { AuthContext } from '../../../provider/AuthProvider';
import { Outlet, useNavigate } from 'react-router-dom';
import SideBar from '../../sheard/sidebar/SideBar';
 // Assuming you have a loader

const Profile = () => {
    const { user, logOut } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logOut();
        navigate('/');
    };

    return (
        <div className='bg-zinc-900 px-2 md:px-12 flex flex-col md:flex-row  py-8 gap-4'>
            
            {!user && 
                <div className='w-full h-full flex items-center justify-center'>
                    loading
                </div>
            }
            {user && (
                <>
                    <div className='w-2/6'>
                        <SideBar data={user} handleLogout={handleLogout} />
                    </div>
                    <div className='w-4/6'>
                        <Outlet /> {/* This will render the child routes */}
                    </div>
                </>
            )}
        </div>
    );
};

export default Profile;
