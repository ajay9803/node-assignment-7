import { UnauthorizedError } from "../error/unauthorized_error";
import { Request } from "../interfaces/auth";
import * as TodoService from "../services/todo";
import { NextFunction, Response } from "express";
import { adminCheck } from "../utils/admin_check";

// send appropriate result based on the result from the services
// execute basic crud operations on todos

// create todo
export const createTodo = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description } = req.body;

    let user = req.user;

    if (adminCheck(user!.id)) {
      throw new UnauthorizedError("Task forbidden.");
    }
    const newTodo = {
      title: title,
      description: description,
      userId: user!.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      isCompleted: false,
    };

    const result = TodoService.createTodo(newTodo);
    res.status(result.statusCode).send(result);
  } catch (e) {
    next(e);
  }
};

// fetch all todos
export const getAllTodos = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (adminCheck(user!.id)) {
      throw new UnauthorizedError("Task forbidden.");
    }
    const result = TodoService.getAllTodos(user!.id);

    res.status(result.statusCode).send(result);
  } catch (e) {
    next(e);
  }
};

// fetch todo by id
export const getTodoById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const user = req.user;

    if (adminCheck(user!.id)) {
      throw new UnauthorizedError("Task forbidden.");
    }

    const result = TodoService.getTodoById(id, user!.id);

    res.status(result.statusCode).send(result);
  } catch (e) {
    next(e);
  }
};

// delete todo by id
export const deleteTodoById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const user = req.user;

    if (adminCheck(user!.id)) {
      throw new UnauthorizedError("Task forbidden.");
    }
    const result = TodoService.deleteTodo(id, user!.id);

    res.send(result);
  } catch (e) {
    next(e);
  }
};

// update todo by id
export const updateTodo = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const user = req.user;

    if (adminCheck(user!.id)) {
      throw new UnauthorizedError("Task forbidden.");
    }

    const result = TodoService.updateTodo(id, title, description, user!.id);

    res.status(result.statusCode).send(result);
  } catch (e) {
    next(e);
  }
};

// update todo by id
export const updateTodoIsCompletedStatus = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const user = req.user;

    if (adminCheck(user!.id)) {
      throw new UnauthorizedError("Task forbidden.");
    }

    const result = TodoService.updateTodoIsCompleteStatus(id, user!.id);

    res.status(result.statusCode).send(result);
  } catch (e) {
    next(e);
  }
};
