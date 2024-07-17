import { NotFoundError } from "../error/not_found_error";
import { Todo } from "../interfaces/todo";

// track todo's to avoid duplicate id's
let todosCount = 1;

// initialize todos with test values
export const todos: Todo[] = [
  {
    id: "0",
    title: "Todo 1",
    description: "This is todo 1",
    userId: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
    isCompleted: false,
  },
  {
    id: "1",
    title: "Todo 2",
    description: "This is todo 2",
    userId: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
    isCompleted: false,
  },
];

// create a todo
export const createTodo = (todo: Omit<Todo, "id">) => {
  // create a new todo with increased-count-id
  const newTodo = { id: `${todosCount + 1}`, ...todo };
  todos.push(newTodo);

  // increase the counter of todosCount
  todosCount++;
};

// delete a todo by id
export const deleteTodo = (todoId: string, userId: string) => {
  const index = todos.findIndex(
    (todo) => todo.id === todoId && todo.userId === userId
  );

  // delete a todo if index is greater than or equals to 0
  if (index >= 0) {
    todos.splice(index, 1);
  } else {
    throw new NotFoundError("No such todo found.");
  }
};

// update a tody by id
export const udpateTodo = (
  id: string,
  title: string,
  description: string,
  userId: string
) => {
  const todo = todos.find((todo) => todo.id === id && todo.userId === userId);

  if (todo) {
    todo.title = title;
    todo.description = description;
    todo.updatedAt = new Date();
    return todo;
  } else {
    throw new NotFoundError("No such todo found.");
  }
};

// update todo's is-complete status
export const updateTodoCompletedStatus = (id: string, userId: string) => {
  const todo = todos.find((todo) => todo.id === id && todo.userId === userId);

  if (todo) {
    todo.isCompleted = !todo.isCompleted;
    todo.updatedAt = new Date();
    return todo;
  } else {
    throw new NotFoundError("No such todo found.");
  }
};

// fetch all todos
export const getAllTodos = (userId: string) => {
  return todos.filter((todo) => todo.userId === userId);
};

// fetch todo by id
export const getTodoById = (todoId: string, userId: string) => {
  const todo = todos.find((todo) => {
    return todo.id === todoId && todo.userId === userId;
  });
  return todo;
};
