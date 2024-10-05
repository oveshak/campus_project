import express from 'express';
import { getUsers, loginUser, loginUserbooking, loginUserProfile, logout, registerUser, updateBookingPaymentStatus, updateUserProfileImage, updateUserRole } from '../controller/user.controller.js';
import { isAuthenticated } from '../midelware/user.auth.js';
import { isAdmin } from '../midelware/admin.js';
import multer from 'multer';
import fs from 'fs'; // Import fs once at the top of the file
import { getAllUserBookings } from '../controller/buyticket.controller.js';

const router =express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = 'public/Image'; // Ensure this directory exists
    cb(null, path);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Generate unique filename
  }
});

// Ensure the directory exists before uploading
const imageDir = 'public/Image';
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

const upload = multer({ storage }); // Fix the 'upload' typo

// Route for uploading the image
router.post('/upload', isAuthenticated, upload.single('file'), updateUserProfileImage);
router.post('/signup', registerUser)
router.post('/login', loginUser)
router.post('/logout', logout)
router.get('/getalluser',isAuthenticated,isAdmin, getUsers)
router.put('/updateadmin/:id',isAuthenticated,isAdmin, updateUserRole)
router.get('/me',isAuthenticated, loginUserProfile)
router.get('/me',isAuthenticated, loginUserProfile)
router.put('/update',isAuthenticated, updateUserProfileImage)
router.get('/allbook',isAuthenticated, loginUserbooking)
router.get('/alluserbook',isAuthenticated,isAdmin, getAllUserBookings)
router.put('/updateStatus/:id', isAuthenticated, isAdmin, updateBookingPaymentStatus);



export default router