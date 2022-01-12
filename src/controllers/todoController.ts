import { Response, NextFunction } from "express";
import ICustomRequest from "../models/ICustomRequest";
import { Todo } from "../models/Todo";
import ITodo from "../models/ITodo";

import TodoModel from "../models/Todo";

export const getTodos = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  //check authorized user
  if (!req.user) {
    res.status(403).json({
      name: "UnauthorizedOperation",
      message: "No todos for you. Login first",
    });
  }
  //check if authorized user have an id
  if (req.user?.id) {
    try {
      //retrieve data from DB
      const todos = await TodoModel.find({ userId: req.user?.id });
      res.status(200).json(todos);
    } catch (error) {
      res.status(404).json({
        name: "SomethingWrong",
        message: "Something went wrong, try again later",
      });
    }
  }
};

export const postTodo = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  //check authorized user
  if (!req.user) {
    res.status(403).json({
      name: "Unauthorized",
      message: "You have no right to post todos",
    });
    return next();
  }
  try {
    const newTodo = new TodoModel({
      text: req.body.text,
      userId: req.user?.id,
    });
    const createdTodo = await newTodo.save();
    res.status(200).json({ todo: createdTodo });
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const editTodo = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  //check if authorized user
  if (!req.user) {
    res.status(403).json({
      name: "UnauthorizedRequest",
      message: "You have no right to delete todo",
    });
    console.log("no user");

    return;
  }

  //check if :id param exists
  if (req.params && req.params.id) {
    const id = req.params.id;

    //check if stored user has an id
    if (!req.user.id) {
      res.status(403).json({
        name: "UnauthorizedRequest",
        message: "You have no right to edit todo",
      });
      return;
    }

    if (req.body && req.body.todo) {
      const editedTodo: Todo = req.body.todo;
      //retrive userId from authorized user
      const { id: userId } = req.user;
      try {
        //retrieve todo from db
        const todo: ITodo | null = await TodoModel.findById(id);

        //check if todo with todo Id exists and check if todo created by auth user
        if (
          todo &&
          todo.userId &&
          todo.userId.toString() === userId.toString()
        ) {
          //find and update todo
          const editedTodoDb: Todo | null = await TodoModel.findByIdAndUpdate(
            id,
            {
              text: editedTodo.text,
              editedAt: new Date(),
              isDone: editedTodo.isDone,
            },
            {
              new: true,
            }
          );
          //send updated todo to client
          res.status(200).send({
            todo: editedTodoDb,
          });
        } else {
          res.status(403).json({
            name: "UnauthorizedRequest",
            message: "You have no right to edit this todo",
          });
        }
      } catch (error) {
        res.status(404).json({
          name: "TodoDeleteProblem",
          message: "Could not edit Todo",
        });
      }
    }
  } else {
    res.status(404).json({
      name: "NoParams",
      message: "Invalid edit request",
    });
  }
};

export const deleteTodo = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  //check if authorized user
  if (!req.user) {
    res.status(403).json({
      name: "UnauthorizedRequest",
      message: "You have no right to delete todo",
    });
    console.log("no user");

    return;
  }

  //check if :id param exists
  if (req.params && req.params.id) {
    const id = req.params.id;

    //check if stored user has an id
    if (!req.user.id) {
      res.status(403).json({
        name: "UnauthorizedRequest",
        message: "You have no right to delete todo",
      });
      console.log("no user id");

      return;
    }

    //retrive userId from authorized user
    const { id: userId } = req.user;
    try {
      //retrieve todo from db
      const todo: ITodo | null = await TodoModel.findById(id);

      //check if todo with todo Id exists and check if todo created by auth user
      if (todo && todo.userId && todo.userId.toString() === userId.toString()) {
        await TodoModel.deleteOne({ _id: todo.id });
        res.status(204).send();
      } else {
        res.status(403).json({
          name: "UnauthorizedRequest",
          message: "You have no right to delete this todo",
        });
      }
    } catch (error) {
      res.status(404).json({
        name: "TodoDeleteProblem",
        message: "Could not delete Todo",
      });
    }
  } else {
    res.status(404).json({
      name: "NoParams",
      message: "Invalid delete request",
    });
  }
};
