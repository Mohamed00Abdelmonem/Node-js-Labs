const express = require("express")
const mongoose = require("mongoose")
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { xss } = require('express-xss-sanitizer');
const hpp = require('hpp');
const dotenv = require("dotenv")
const app = express()
const errorHandler = require('./middlewares/errorHandler')


const userRouter = require('./routers/userRouter')
const postRouter = require('./routers/postRouter')
const donationsRouter = require('./routers/donationsRouter')
dotenv.config()

// Security middlewares
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: {
    status: 'fail',
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
}));


// Body parser
app.use(express.json())

// Routes
app.use('/users', userRouter)
app.use('/posts', postRouter)
app.use('/donations', donationsRouter)

// Error handling middleware
app.use(errorHandler)

  
app.listen(3000, async () => {
  console.log('Server is running on port 3000')
  mongoose.connect('mongodb://localhost:27017/mydb').then(() => {
  console.log('✅✅Connected to MongoDB')
  }).catch(err => {
    console.error('❌❌Failed to connect to MongoDB', err)
  });
})

