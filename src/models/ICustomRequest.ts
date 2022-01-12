import { Request } from "express";

import IUser from "./IUser";

interface ICustomRequest extends Request {
  user?: IUser;
}

export default ICustomRequest;
