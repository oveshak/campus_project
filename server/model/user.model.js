import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { 
        type: String, 
        required: true,
        minlength: 8 // Enforce a minimum length of 8 characters for the password
    },
    profileImg: {
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
    ,
    ticketBook:[
        {   
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TicketBooking',
        }
    ]

}, { timestamps: true }); // Adds createdAt and updatedAt fields

export const User = mongoose.model('User', userSchema);
