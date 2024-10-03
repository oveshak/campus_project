import mongoose from "mongoose";

const connectdb=async()=>{
    try {
        await mongoose.connect(process.env.mongo_url,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected!");
    } catch (err) {
        console.error(err);
        
    }
}
export default connectdb