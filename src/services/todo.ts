import * as TodoModel from "../models/todo";
import { Todo } from "../interfaces/todo";
import { NotFoundError } from "../error/not_found_error";
import HttpStatusCodes from "http-status-codes";

// create todo - return success / failure result
export const createTodo = async (todo: Omit<Todo, "id">) => {
  await TodoModel.TodoModel.createTodo(todo);
  return {
    statusCode: HttpStatusCodes.CREATED,
    message: "Todo created successfully.",
  };
};

// delete todo - return success result
export const deleteTodo = async (todoId: string, userId: string) => {
  await TodoModel.TodoModel.deleteTodo(todoId, userId);
  return {
    statusCode: HttpStatusCodes.NO_CONTENT,
    message: "Todo deleted successfully.",
  };
};

// fetch all todos - return success / failure result
export const getAllTodos = async (userId: string) => {
  const todos = await TodoModel.TodoModel.getAllTodos(userId);

  if (todos.length === 0) {
    throw new NotFoundError("No todos found.");
  } else {
    return {
      statusCode: HttpStatusCodes.OK,
      todos: todos,
    };
  }
};

// fetch tody by id - return success / failure result
export const getTodoById = async (todoId: string, userId: string) => {
  const todo = await TodoModel.TodoModel.getTodoById(todoId, userId);

  if (!todo) {
    throw new NotFoundError(`No todo found with id: ${todoId}`);
  } else {
    return {
      statusCode: HttpStatusCodes.OK,
      todo: todo,
    };
  }
};

// update todo by id - return success / failure result
export const updateTodo = async (
  id: string,
  title: string,
  description: string,
  userId: string
) => {
  await TodoModel.TodoModel.updateTodo(id, title, description, userId);

  return {
    statusCode: HttpStatusCodes.OK,
    message: "Todo updated successfully",
  };
};

// update todo's is-complete status
export const updateTodoIsCompleteStatus = async (
  id: string,
  userId: string
) => {
  await TodoModel.TodoModel.updateTodoCompletedStatus(id, userId);

  return {
    statusCode: HttpStatusCodes.OK,
    message: "Todo updated successfully",
  };
};
