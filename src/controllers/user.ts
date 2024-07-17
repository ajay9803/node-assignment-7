import { users } from "../models/user";
import * as UserService from "../services/user";
import { NextFunction, Request, Response } from "express";

// controller to create new user
export const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    // create new user
    let newUser = {
      name: name,
      email: email,
      password: password,
      permissions: [
        "todos.create",
        "todos.update",
        "todos.delete",
        "todos.fetch",
      ],
    };

    const result = await UserService.createUser(newUser);
    // send success message
    res.status(result.statusCode).send(result);
  } catch (e) {
    next(e);
  }
};

// controller to fetch user by id
export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = UserService.getUserById(id);

    // send success message
    res.status(result.statusCode).send(result);
  } catch (e) {
    // send error to generic error handler
    next(e);
  }
};

// controller to update user by id
export const updateUserById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // the body only contains email, name and password
    const { email, name, password } = req.body;

    const user = {
      email: email,
      name: name,
      password: password,
    };

    const result = UserService.updateUserById(id, user);

    // send success message
    res.status(result.statusCode).send(result);
  } catch (e) {
    // send error to generic error handler
    next(e);
  }
};

// controller to delete user by id
export const deleteUserById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const result = UserService.deleteUserById(id);

    // send success message
    res.send(result);
  } catch (e) {
    // send error to generic error handler
    next(e);
  }
};
