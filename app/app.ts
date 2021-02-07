import dotenv from 'dotenv';
import express, {Application, Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';


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

//Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//Express server configuration
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});