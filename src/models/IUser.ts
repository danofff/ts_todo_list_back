import { Schema } from "mongoose";
import { User } from "../models/User";

interface IUser extends User {
  id?: Schema.Types.ObjectId;
}

export default IUser;
