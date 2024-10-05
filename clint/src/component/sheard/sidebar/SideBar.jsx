import React, { useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../provider/AuthProvider';
import Cookies from 'js-cookie';

const SideBar = ({ data, handleLogout }) => {
  const { user } = useContext(AuthContext);

  const [uploadedImage, setUploadedImage] = useState(data.profileImg); // Use the correct field for the image
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState();

  const handleImageUpload = async () => {
    if (!file) {
      console.log('No file selected');
      return;
    }

    const headers = {
      Authorization: `Bearer ${Cookies.get('token')}`, // Get token from cookies
    };

    const fileData = new FormData(); // Create a FormData object for file upload
    fileData.append('file', file);

    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:5000/user/upload', fileData, { headers });
      setUploadedImage(res.data.profileImage); // Match with backend response
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-800 p-4 rounded flex flex-col items-center justify-between h-full">
      <div className="flex flex-col justify-center items-center">
        {uploadedImage ? (
          <>
            {/* Show the uploaded image */}
            <img 
              src={`http://127.0.0.1:5000${uploadedImage}`} 
              alt="user avatar" 
              className="h-[12vh]" 
            />
          </>
        ) : (
          <>
            {/* Show the file input only if no image is uploaded */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="mt-2 mb-4 text-zinc-100"
              disabled={loading}
            />
            <button className="" onClick={handleImageUpload} disabled={loading}>
              {loading ? 'Uploading...' : 'Upload Image'}
            </button>
            {loading && <p className="text-zinc-300">Uploading...</p>}
          </>
        )}

        <p className="mt-3 text-xl text-zinc-100 font-semibold">{data.username}</p>
        <p className="mt-1 text-normal text-zinc-300">{data.email}</p>
        <div className="w-full mt-4 h-[1px] bg-zinc-500 hidden lg:block"></div>
      </div>

      {data.role === 'user' && (
        <div className="w-full flex-col items-center justify-center hidden lg:flex">
          <NavLink to="/profile" className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-900 rounded transition-all">
          Order History
          </NavLink>
          
        </div>
      )}

      {data.role === 'admin' && (
        <div className="w-full flex-col items-center justify-center hidden lg:flex">
          <NavLink to="/profile/add-admin" className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-900 rounded">
            Add Admin
          </NavLink>
          <NavLink to="/profile/addbook" className="text-zinc-100 font-semibold w-full py-2 mt-4 text-center hover:bg-zinc-900 rounded">
            Add Movie
          </NavLink>
          <NavLink to="/profile/allmovie" className="text-zinc-100 font-semibold w-full py-2 mt-4 text-center hover:bg-zinc-900 rounded">
            All Movie
          </NavLink>
          <NavLink to="/profile/showtime" className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-900 rounded">
            Add Showtime
          </NavLink>
          <NavLink to="/profile/allbooking" className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-900 rounded">
            All booking
          </NavLink>
          <NavLink to="/profile/allshowtime" className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-900 rounded">
            All Show Time
          </NavLink>
<NavLink to="/profile/imageadd" className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-900 rounded">
            Add Image
          </NavLink>
<NavLink to="/profile/contact" className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-900 rounded">
            All Contact
          </NavLink>
<NavLink to="/profile/addHeroImage" className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-900 rounded">
            Add Hero Image
          </NavLink>
          
        </div>
      )}

      <button className="bg-zinc-900 w-3/6 py-2 mt-4 text-white" onClick={handleLogout}>
        LogOut
      </button>
    </div>
  );
};

export default SideBar;
