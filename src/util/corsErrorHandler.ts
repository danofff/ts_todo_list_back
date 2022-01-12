import { Request, Response, NextFunction } from "express";

export const corsErrorHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
};
