import express, { json } from 'express';
import multer from 'multer';
import fs from 'fs';
import { isAuthenticated } from '../midelware/user.auth.js';
import { AllImage } from '../model/Image.model.js';

 // Adjust the import path as necessary

const router = express.Router();
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
  

  router.post('/upload', isAuthenticated, upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    try {
        const newImage = new AllImage({
            title: req.body.title, // Assuming you're sending the title in the request body
            image: `/Image/${req.file.filename}` // Path to the uploaded image without "public"
        });

        // Save the document to the database
        await newImage.save();
        return res.status(200).json({ message: 'File uploaded and saved successfully!', file: req.file });
    } catch (error) {
        console.error('Error saving to database:', error); // Log the error for debugging
        return res.status(500).json({ message: 'Error saving image to database.', error: error.message });
    }
});


//get all the images
// Route to fetch all images
router.get("/get", async (req, res) => {
    try {
        const images = await AllImage.find();
        console.log('Fetched Images:', images); // Log fetched images
        res.status(200).json(images);
    } catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


//handle delete images
router.delete('/delete/:id', isAuthenticated, async (req, res) => {
    try {
        const image = await AllImage.findByIdAndDelete(req.params.id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        // Delete the corresponding file from the disk
        fs.unlinkSync(image.image); // Ensure this path is correct

        return res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ message: 'Error deleting image', error: error.message });
    }
});


export default router;
