import express from "express";
import {
  createTodo,
  deleteTodoById,
  getAllTodos,
  getTodoById,
  updateTodo,
  updateTodoIsCompletedStatus,
} from "../controllers/todo";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import {
  validateReqBody,
  validateRequestParams,
} from "../middlewares/validator";
import { createTodoBodySchema, getTodoParamsSchema } from "../schemas/todo";

// todo - router
const router = express();

// router methods on todos

// get all the todos of - a user
router.get("/all/", authenticate, authorize("todos.fetch"), getAllTodos);

// get a particular todo of - a user
router.get("/:id", authenticate, authorize("todos.fetch"), getTodoById);

// create a todo
router.post(
  "/",
  validateReqBody(createTodoBodySchema),
  authenticate,
  authorize("todos.create"),
  createTodo
);

// delete a todo
router.delete(
  "/:id",
  validateRequestParams(getTodoParamsSchema),
  authenticate,
  authorize("todos.delete"),
  deleteTodoById
);

// update a todo
router.put(
  "/:id",
  validateRequestParams(getTodoParamsSchema),
  validateReqBody(createTodoBodySchema),
  authenticate,
  authorize("todos.update"),
  updateTodo
);

// update todo's is-completed status
router.patch(
  "/:id",
  validateRequestParams(getTodoParamsSchema),
  authenticate,
  authorize("todos.update"),
  updateTodoIsCompletedStatus
);

export default router;
