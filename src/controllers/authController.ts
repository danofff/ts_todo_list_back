import { Request, Response, NextFunction } from "express";
import bcypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModel from "../models/User";

const saltRounds: number = Number.parseInt(process.env.SALT_ROUNDS || "10");
const jwtSecret =
  process.env.JWT_SECRET || "oh, yep, I can't reach environment variables";

const getUser = async (username: string) => {
  const findedUser = await UserModel.find({ username }).exec();
  return findedUser[0];
};

//singup user
export const signupUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  try {
    //username and password validation
    if (username.length < 3) {
      throw {
        message: "Username must be at least 3 characters",
        name: "UsernameValidationError",
      };
    }

    if (password.length < 6) {
      throw {
        message: "Password must be at least 6 characters",
        name: "PasswordValidationError",
      };
    }
    const isUserExist = await getUser(username);

    //check if user already exist
    if (isUserExist) {
      const error = {
        message: `User with username ${username} already exists`,
        name: "UserAlreadyExists",
      };
      throw error;
    }

    //password crypting
    const salt = await bcypt.genSalt(saltRounds);
    const hashedPassword = await bcypt.hash(password, salt);

    //creating a new user
    const newUser = new UserModel({
      username,
      password: hashedPassword,
    });
    const createdUser = await newUser.save();

    //send successfull status and createdUser data
    res.status(201).json({
      user: {
        username: createdUser.username,
        id: createdUser._id,
      },
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

//login user
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  try {
    //retrive user from DB
    const findedUser = await getUser(username);

    //check if user exists
    if (!findedUser) {
      const error = {
        message: "No such user, try to signup first",
        name: "NoSuchUser",
      };
      throw error;
    }

    //check password validity
    const isValidPassword = await bcypt.compare(password, findedUser.password);
    if (!isValidPassword) {
      const error = {
        message: "Password is not valid for this user",
        name: "InvalidPassword",
      };
      throw error;
    }

    //generate token
    const token = await jwt.sign(
      { username: findedUser.username, id: findedUser._id },
      jwtSecret
    );

    //send login user and generated token
    res.status(200).json({
      user: {
        id: findedUser._id,
        username: findedUser.username,
      },
      token,
    });
  } catch (error) {
    res.status(401).json(error);
  }
};
