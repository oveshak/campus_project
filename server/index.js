import express from 'express';
const app = express();
import cookieParser from 'cookie-parser';
import cors from 'cors';
const port = process.env.port || 5000;
const hostname='http://127.0.0.1:'
import dotenv from 'dotenv'
import connectdb from './utils/db.js';




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
app.use("/user",userRouter)
app.use('/api', movieRoutes); 
app.use('/api', showtimeRoutes);



app.listen(port, () => {
    connectdb()
  console.log(`${hostname}${port}`)
})