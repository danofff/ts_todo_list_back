import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

import { corsErrorHandler } from "./util/corsErrorHandler";
import { checkUser } from "./util/checkUser";
import path from "path";

const app = express();

/******** app settings *********/
//json parser
app.use(express.json());
//avoid cors problem
app.use(corsErrorHandler);
//authorize user
app.use(checkUser);

/******* routes *********/
app.use(express.static(path.join(__dirname, "public")));
//authentication routes
import authRouter from "./routes/authRoutes";
app.use("/api/auth", authRouter);

//todos routes
import todoRouter from "./routes/todoRoutes";
app.use("/api/todos", todoRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

//retrive data from environment variables
const PORT = process.env.PORT || 8000;
const DB_CONNECTION = process.env.DB_CONNECTION_STRING || "";

//connect to DB and start the SERVER
mongoose
  .connect(DB_CONNECTION)
  .then((result) => {
    app.listen(PORT, () => {
      console.log("App is started on Port " + PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
