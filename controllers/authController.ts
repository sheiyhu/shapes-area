import { NextFunction, Request, Response } from "express";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import { User } from "./../models/userModel";
import { catchAsync } from "./../utils/catchAsync";
import { sendToken, correctPassword } from "../utils/authUtils";
import appError from "./../utils/appError";
import process from "process";


// signup using name, email and password
export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const { name, email, password} = req.body;

      // checking if the params are available
    if (!name || !email || !password) {
      next(new appError("Please provide name, email and password!", 400))
    }

    //saving the new user to DB
    const newUser = await User.create({
      name,email,password
    });

    //if all is correct, send token to client
    sendToken(newUser, 201, res);
  }
);

//login using email and password
export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // check if the email and password exist
    if (!email && !password) {
      next(new appError("Please provide email and password!", 400));
    }

    //check if the email and password is correct
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await correctPassword(password, user))) {
      return next(new appError("Invalid provide email or password!", 401));
    }

    //if all is correct, send token to client
    sendToken(user, 201, res);
  }
);

//to protect routes from unauthorized users
export const protect = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    //checking and getting of signToken
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(
        new appError("You are not logged in! Please login to get access", 401)
      );
    }

    //validation of token
    const decodedToken = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    //check if user exists
    const currentUser = await User.findById(decodedToken.id);
    if (!currentUser) {
      return next(
        new appError(
          "The user belonging to this token does no longer exist.",
          401
        )
      );
    }

    // grant accessto protected routes
    req.id = currentUser._id
    next();
  }
);
