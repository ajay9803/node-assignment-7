import { ConflictError } from "../error/conflict_error";
import { NotFoundError } from "../error/not_found_error";
import { User } from "../interfaces/user";
import * as UserModel from "../models/user";
import bcrypt from "bcrypt";
import HttpStatusCodes from "http-status-codes";

export const add = (a: number, b: number) => {
  return a + b;
};

// create new user
export const createUser = async (user: Omit<User, "id">) => {
  const existingUser = UserModel.getUserByEmail(user.email);

  // avoid duplicate email address
  if (existingUser) {
    throw new ConflictError("User already exists.");
  }

  // hash the password - to store hashed password to the users data
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const newUser = {
    ...user,
    password: hashedPassword,
  };

  UserModel.createUser(newUser);

  // return success-message
  return {
    statusCode: HttpStatusCodes.CREATED,
    message: "User created successfully",
  };
};

// get user by id
export const getUserById = (id: string) => {
  const data = UserModel.getUserById(id);

  // return success-message
  if (data) {
    return {
      statusCode: HttpStatusCodes.OK,
      message: "User fetched successfully.",
      user: data,
    };
  } else {
    // throw user-user-not-found error
    const error = new NotFoundError("User not found.");
    throw error;
  }
};

// fetch user by email
export const getUserByEmail = (email: string) => {
  const data = UserModel.getUserByEmail(email);

  // return user data: null / real data
  return data;
};

// update user by id
export const updateUserById = (
  id: string,
  theUser: Omit<User, "id" | "permissions">
) => {
  const user = UserModel.updateUserById(id, theUser);

  if (user) {
    return {
      statusCode: HttpStatusCodes.OK,
      message: "User updated successfully",
      user: user,
    };
  } else {
    throw new NotFoundError("No such user found.");
  }
};

// delete user by id
export const deleteUserById = (id: string) => {
  UserModel.deleteUserById(id);
  return {
    statusCode: HttpStatusCodes.NO_CONTENT,
    message: "User deleted successfully",
  };
};
