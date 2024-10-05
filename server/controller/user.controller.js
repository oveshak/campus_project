import jwt from 'jsonwebtoken'
import  bcrypt  from "bcryptjs";
import { User } from "../model/user.model.js";
import mongoose from 'mongoose';
import TicketBooking from '../model/buyticket.model.js';


//register user
export const registerUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Check if all fields are provided
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Please enter all fields" });
      }
  
      // Check if the password length is at least 8 characters
      if (password.length < 8) {
        return res.status(400).json({ message: "Password should be at least 8 characters long" });
      }
  
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }
  
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create new user
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });
  
      // Respond with the created user
      return res.status(201).json({ user: newUser });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Server Error" });
    }
  };
  
    

    //login user
    export const loginUser = async (req, res) => {
      try {
        const { email, password } = req.body;
    
        // Check if all fields are provided
        if (!email || !password) {
          return res.status(400).json({ message: "Please enter all fields" });
        }
    
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: "Invalid credentials" });
        }
    
        // Create and return JWT
        const token = jwt.sign(
          { id: user._id }, 
          process.env.JWT_SECRET,  // Ensure this is defined correctly
          { expiresIn: '1h' }
        );
    
        // Set the cookie with the token
        return res
          .status(200)
          .cookie("token", token, {
            maxAge: 50 * 60 * 1000,   // 50 minutes
            httpOnly: true,           // Client-side JS can't access it
            sameSite: 'strict',       // Helps prevent CSRF
            // secure: process.env.NODE_ENV === 'production',  // Uncomment in production for HTTPS
          })
          .json({ user, token }); // Also returning the token in the response body
      } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server Error' });
      }
    };
    


//logout user

export const logout=async(req,res)=>{
    try{
        res.clearCookie("token","",{maxAge:0})
        return res.status(200).json({message:"Logged out"})
    }catch(e){
        console.error(e);
        res.status(500).json({error: 'Server Error'})
    }
}


//get all user in admin

export const getUsers=async(req,res)=>{
    try{
        const users=await User.find()
        return res.json(users)
    }catch(e){
        console.error(e)
        res.status(500).json({error: 'Server Error'})
    }
}

//update user role in admin

export const updateUserRole = async (req, res) => {
  try {
      const { role } = req.body; // Get the new role from the request body
      const userId = req.params.id; // Get the user ID from request parameters
      
      // Use the userId directly as the first argument
      const user = await User.findByIdAndUpdate(userId, { role }, { new: true });

      // Check if the user was found
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      
      return res.json(user); // Return the updated user
  } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Server Error" }); // Handle server errors
  }
}

  
export const loginUserProfile= async (req, res) => {
  try {
      const user = await User.findById(req.user.id); // Fetch user data from the database
      if (!user) return res.sendStatus(404); // User not found
      res.json({ user }); // Return user data
  } catch (error) {
      console.error('Error fetching user:', error);
      res.sendStatus(500); // Internal server error
  }
};



export const loginUserbooking = async (req, res) => {
  try {
      const userId = req.user.id; 

      // Validate the user ID format
      if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ message: 'Invalid user ID format' });
      }

      // Fetch user data from the database and populate 'ticketBook' with 'showtime' and 'movie'
      const user = await User.findById(userId)
          .populate({
              path: 'ticketBook', // Populate the ticketBook field
              populate: [
                  {
                      path: 'showtime', // Populate the showtime field within ticketBook
                      model: 'MovieShowTime' // Ensure you use the correct model name for showtime
                  },
                  {
                      path: 'movie', // Populate the movie field within ticketBook
                      model: 'Movie' // Ensure you use the correct model name for movie
                  }
              ]
          });

      if (!user) {
          return res.sendStatus(404); // User not found
      }

      console.log('Populated user:', user); // Log populated user for debugging

      // Return user data, including ticket bookings
      res.json({ user });
  } catch (error) {
      console.error('Error fetching user:', error);
      res.sendStatus(500); // Internal server error
  }
};






// Update user profile image in Cloudinary
export const updateUserProfileImage = async (req, res) => {
  try {
    // Check if a file is uploaded
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // Find the user by ID
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's profile image
    user.profileImg = `/Image/${req.file.filename}`; // Set the path to the uploaded image

    // Save the updated user object
    await user.save();

    // Return success message with the image URL
    res.json({ message: 'Profile image updated successfully', profileImage: user.profileImg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating profile image' });
  }
};




//get all user ticketBook admin can be seen
export const getUserWithBookings = async (req, res) => {
  try {
      const userId = req.user.id; 
      console.log(userId); // Assuming user is authenticated

      // Validate the user ID format
      if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ message: 'Invalid user ID format' });
      }

      const user = await User.findById(userId)
      .populate({
          path: 'ticketBook', // Populate the ticketBook field
          populate: [
              {
                  path: 'showtime', // Populate the showtime field within ticketBook
                  model: 'MovieShowTime' // Ensure you use the correct model name for showtime
              },
              {
                  path: 'movie', // Populate the movie field within ticketBook
                  model: 'Movie' // Ensure you use the correct model name for movie
              }
          ]
      });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ user });
  } catch (error) {
      console.error("Error fetching user with bookings:", error); // Log the error for debugging
      return res.status(500).json({ message: 'Server error', error: error.message });
  }
};



//update booking prayment status

export const updateBookingPaymentStatus = async (req, res) => {
  try {
      const bookingId = req.params.id; 
      const { paymentStatus } = req.body;

      // Validate the booking ID format
      if (!mongoose.Types.ObjectId.isValid(bookingId)) {
          return res.status(400).json({ message: 'Invalid booking ID format' });
      }

      // Update the booking's payment status
      const booking = await TicketBooking.findByIdAndUpdate(bookingId, { paymentStatus }, { new: true });

      // Check if the booking was found
      if (!booking) {
          return res.status(404).json({ message: "Booking not found" });
      }

      return res.json({ message: "Payment status updated successfully", booking }); 
  } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Error updating booking" });
  }
};


