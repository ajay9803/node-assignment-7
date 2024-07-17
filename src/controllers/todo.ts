import { UnauthorizedError } from "../error/unauthorized_error";
import { Request } from "../interfaces/auth";
import * as TodoService from "../services/todo";
import { NextFunction, Response } from "express";
import { adminCheck } from "../utils/admin_check";

// send appropriate result based on the result from the services
// execute basic crud operations on todos

// create todo
export const createTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

    const result = await TodoService.createTodo(newTodo);
    res.status(result.statusCode).send(result);
  } catch (e) {
    next(e);
  }
};

// fetch all todos
export const getAllTodos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (adminCheck(user!.id)) {
      throw new UnauthorizedError("Task forbidden.");
    }
    const result = await TodoService.getAllTodos(user!.id);

    res.status(result.statusCode).send(result);
  } catch (e) {
    next(e);
  }
};

// fetch todo by id
export const getTodoById = async (
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

    const result = await TodoService.getTodoById(id, user!.id);

    res.status(result.statusCode).send(result);
  } catch (e) {
    next(e);
  }
};

// delete todo by id
export const deleteTodoById = async (
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
    const result = await TodoService.deleteTodo(id, user!.id);

    res.send(result);
  } catch (e) {
    next(e);
  }
};

// update todo by id
export const updateTodo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const user = req.user;

    if (adminCheck(user!.id)) {
      throw new UnauthorizedError("Task forbidden.");
    }

    const result = await TodoService.updateTodo(id, title, description, user!.id);

    res.status(result.statusCode).send(result);
  } catch (e) {
    next(e);
  }
};

// update todo by id
export const updateTodoIsCompletedStatus = async (
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

    const result = await TodoService.updateTodoIsCompleteStatus(id, user!.id);

    res.status(result.statusCode).send(result);
  } catch (e) {
    next(e);
  }
};
