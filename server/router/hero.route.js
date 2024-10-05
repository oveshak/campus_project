import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
 // Import AllImage model
import { isAuthenticated } from '../midelware/user.auth.js'; // Ensure the authentication middleware is imported
import { AllImage } from '../model/Image.model.js';
import { HeroImage } from '../model/hero.model.js';

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'public/Image'; // Ensure this directory exists
        cb(null, dir);
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

const upload = multer({ storage });

// Route to upload hero image
router.post('/addHeroImage', isAuthenticated, upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    try {
        // Create a new image document in AllImage
        const newImage = new AllImage({
            title: req.body.title, // Get title from request body
            image: req.file.path // Store the file path in the database
        });
        await newImage.save(); // Save the document to the database

        // Create a new HeroImage document and add the reference to AllImage
        const newHeroImage = new HeroImage({
            heroimage: [newImage._id] // Save the ObjectId of the newly created image
        });
        await newHeroImage.save(); // Save the hero image reference to the database

        return res.status(200).json({
            message: 'Hero image uploaded and saved successfully!',
            file: req.file,
            heroImageId: newHeroImage._id
        });
    } catch (error) {
        console.error('Error saving to database:', error);
        return res.status(500).json({ message: 'Error saving hero image to database.' });
    }
});

export default router;
