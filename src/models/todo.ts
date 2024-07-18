import { NotFoundError } from "../error/not_found_error";
import { Todo } from "../interfaces/todo";
import BaseModel from "./base";

export class TodoModel extends BaseModel {
  // create a todo
  static createTodo = async (todo: Omit<Todo, "id">) => {
    let newTodo = {
      title: todo.title,
      description: todo.description,
      userId: todo.userId,
    };
    await this.queryBuilder().insert(newTodo).table("todos");
  };

  // delete todo
  static deleteTodo = async (todoId: string, userId: string) => {
    const existingTodo = await this.queryBuilder()
      .select()
      .from("todos")
      .where({ id: todoId, user_id: userId })
      .first();

    if (existingTodo) {
      await this.queryBuilder()
        .delete()
        .table("todos")
        .where({ id: todoId, user_id: userId });
    } else {
      throw new NotFoundError("No such todo found.");
    }
  };

  // update todo
  static updateTodo = async (
    id: string,
    title: string,
    description: string,
    userId: string
  ) => {
    let updatedAt = new Date();
    const existingTodo = await this.queryBuilder()
      .select()
      .from("todos")
      .where({ id: id, user_id: userId })
      .first();

    if (existingTodo) {
      await this.queryBuilder()
        .update({
          title: title,
          description: description,
          updated_at: updatedAt,
        })
        .table("todos")
        .where({ id: id, user_id: userId });
      return {
        ...existingTodo,
        title: title,
        description: description,
        updated_at: updatedAt,
      };
    } else {
      throw new NotFoundError("No such todo found.");
    }
  };

  // update todo's is-complete status
  static updateTodoCompletedStatus = async (id: string, userId: string) => {
    let updatedAt = new Date();
    const existingTodo = await this.queryBuilder()
      .select()
      .from("todos")
      .where({ id: id, user_id: userId })
      .first();

    if (existingTodo) {
      await this.queryBuilder()
        .update({
          is_completed: !existingTodo.isCompleted,
          updated_at: updatedAt,
        })
        .table("todos")
        .where({ id: id, user_id: userId });
      return {
        ...existingTodo,
        updated_at: updatedAt,
      };
    } else {
      throw new NotFoundError("No such todo found.");
    }
  };

  // get all todos
  static getAllTodos = async (userId: string, page: number, size: number) => {
    const todos = await this.queryBuilder()
      .select()
      .table("todos")
      .where("user_id", userId)
      .limit(size)
      .offset((page - 1) * size);
    return todos;
  };

  // get todo by id
  static getTodoById = async (todoId: string, userId: string) => {
    const existingTodo = await this.queryBuilder()
      .select()
      .table("todos")
      .where({ id: todoId, user_id: userId })
      .first();
    return existingTodo;
  };
}
