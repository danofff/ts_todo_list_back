import { Schema, SchemaTypes, model, SchemaType } from "mongoose";

export interface Todo {
  text: string;
  createdAt: Date;
  editedAt: Date;
  userId: Schema.Types.ObjectId;
  isDone: boolean;
}

const todoSchema = new Schema<Todo>(
  {
    text: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    editedAt: {
      type: Date,
      default: new Date(),
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
  }
);

todoSchema.virtual("id").get(function (this: { _id: Schema.Types.ObjectId }) {
  return this._id;
});

const TodoModel = model<Todo>("Todo", todoSchema);

export default TodoModel;
