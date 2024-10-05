import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    }
});
export const AllImage=mongoose.model('AllImage',imageSchema);