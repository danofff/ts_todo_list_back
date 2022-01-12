import { Schema } from "mongoose";

import { Todo } from "./Todo";

interface ITodo extends Todo {
  id?: Schema.Types.ObjectId;
}

export default ITodo;
