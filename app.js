require("dotenv").config();
require('express-async-errors')

//express
const express = require("express");
const app = express();

// rest of the packages
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
// db
const connectDB = require("./db/connect");

// routers
const authRouter = require('./routes/authRoutes.js')
const userRouter = require('./routes/userRoutes.js')
const productRouter = require('./routes/productRoutes.js')
const reviewRouter = require('./routes/reviewRoutes.js')

// middleware
const NotFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(morgan('tiny'))
// middleware to access json body in req.body for post/patch/put operations
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
// upload the path
app.use(express.static('./public'))
app.use(fileUpload())

app.get('/', (req,res)=>{
    // console.log(req.cookies);
    res.send('E-Commerce API')
})

app.get('/api/v1', (req,res)=>{
    // console.log(req.cookies); 
    console.log(req.signedCookies); 
    res.send('E-Commerce API')
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/reviews', reviewRouter)

app.use(NotFoundMiddleware);
app.use(errorHandlerMiddleware)


const port = process.env.PORT || 5000;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();
