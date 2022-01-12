import { Router } from "express";
import {
  deleteTodo,
  editTodo,
  getTodos,
  postTodo,
} from "../controllers/todoController";

const router = Router();

router.get("/", getTodos);

router.post("/", postTodo);

router.delete("/:id", deleteTodo);

router.patch("/:id", editTodo);

export default router;
