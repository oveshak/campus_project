import express from 'express';
const app = express();
import cookieParser from 'cookie-parser';
import cors from 'cors';
const port = process.env.port || 5000;
const hostname='http://127.0.0.1:'
import dotenv from 'dotenv'
import connectdb from './utils/db.js';

import path from 'path';


//router
//rohenroy9999
//

dotenv.config({})

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
const corsOptions = {
    origin: 'http://localhost:5173', // replace with your frontend application URL
    credentials: true
}
app.use(cors(corsOptions));
app.use('/Image', express.static('public/Image'));



//rohenroy9999
//5ox9KhpezGsMrCPr
app.get('/', (req, res) => {
  res.send('Hello World!')
})


//api's
import userRouter from './router/user.route.js'
import movieRoutes from './router/movie.route.js' 
import showtimeRoutes from './router/showtime.route.js'
import bookingRoutes from './router/buyticket.route.js'
import addImageRoutes from './router/allimage.route.js'
import connectdbRoutes from './router/contact.route.js'
import heroRoutes from './router/hero.route.js'

app.use("/user",userRouter)
app.use('/api', movieRoutes); 
app.use('/api', showtimeRoutes);

app.use('/api', bookingRoutes);
app.use('/api', bookingRoutes);
app.use('/image', addImageRoutes);
app.use('/apis', connectdbRoutes);
app.use('/hero', heroRoutes);
app.listen(port, () => {
    connectdb()
  console.log(`${hostname}${port}`)
})