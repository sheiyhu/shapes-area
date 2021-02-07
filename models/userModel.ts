import mongoose from "mongoose";
import {hashPassword} from '../utils/authUtils';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email!'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    }
},{ timestamps: true});

//to hash the passord before saving
userSchema.pre("save", async function(next) {
    const user = this;
    await hashPassword(user, next)
    
});


export const User = mongoose.model('User', userSchema);
