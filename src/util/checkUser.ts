import { Response, NextFunction } from "express";
import ICustomRequest from "../models/ICustomRequest";
import jwt from "jsonwebtoken";
import IUser from "../models/IUser";
import UserModel from "../models/User";

const jwtSecret =
  process.env.JWT_SECRET || "oh, yep, I can't reach environment variables";

export const checkUser = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  //check request headers
  if (req.headers && req.headers.authorization) {
    const authorizationStr: string = req.headers.authorization;
    //retrive token
    const token: string = authorizationStr.split(" ")[1] || "";
    if (token !== "") {
      try {
        //verify token
        const verifiedUser = await (<IUser>jwt.verify(token, jwtSecret));
        const { id } = verifiedUser;
        if (id) {
          //retrive user from DB
          const user = await UserModel.findById(id);
          if (user) {
            //set user to request
            req.user = user;
            return next();
          }
        }
      } catch (error) {
        console.log(error);
        return next();
      }
    } else {
      return next();
    }
  } else {
    next();
  }
};
