import dotenv from 'dotenv';
import express, {Application, Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

import appError from './../utils/appError';
import {globalErrorHandler} from './../controllers/errorController';
import userRoute from './../routes/userRoutes';
import shapeRoute from './../routes/shapeRoutes';

dotenv.config({ path: './config.env' });

const app: Application = express();

// Database configuration
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useCreateIndex : true,
    useFindAndModify: false,
    useUnifiedTopology: true 
}).then(con => {
    console.log('DB connected successfully');
})

// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
  });
  app.use('/api', limiter);

//Express middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

//API endpoint
app.get('/', (req, res) => {
    res.status(200).json({ 
        "App": "Area of shapes",
        "message" : "Wellcome",
        "available routes" : {
            "signup": "/api/users/signup",
            "login": "/api/users/login",
            "calculate area": "/api/shapes/calculate",
            "get previous calculations": "/api/shapes/get-previous-calculations"
        }
    })
});
app.use('/api/users', userRoute);
app.use('/api/shapes', shapeRoute);
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next( new appError(`Can't find ${req.originalUrl} on the server`, 404))
});

//Error handling
app.use(globalErrorHandler)

//Express server configuration
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});