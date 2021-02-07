import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

//to sign and generate token
const signToken = id => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.EXPIRES_IN
});

//helper for hashing passord
export const hashPassword = async(user, next) => {

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) {
      return next();
    }


    // override the cleartext password with the hashed one
    user.password = await bcrypt.hash(user.password, 12);

    return next();
};

//to compare the inputted password against the stored password
export const correctPassword = async (candidatePassword, user) => {
  return await bcrypt.compare(candidatePassword, user.password);
}

//to send user data ro clien
export const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // to remove the password duringsignup
  user.password = undefined
  
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};


