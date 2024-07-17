import * as TodoService from "../../../services/todo";
import * as TodoModel from "../../../models/todo";
import Sinon from "sinon";
import expect from "expect";
import HttpStatusCodes from "http-status-codes";
import { NotFoundError } from "../../../error/not_found_error";
import { Todo } from "../../../interfaces/todo";

// Todo Service - Test Suite
describe("Todo Service Test Suite", () => {
  // unit test for - create todo
  describe("Create todo", () => {
    let todoModelCreateTodoStub: Sinon.SinonStub;

    beforeEach(() => {
      todoModelCreateTodoStub = Sinon.stub(TodoModel, "createTodo");
    });

    afterEach(() => {
      todoModelCreateTodoStub.restore();
    });

    // test case for - todo creation
    it("Should create a todo and return success status", () => {
      let newTodo = {
        id: "2",
        title: "Todo 2",
        description: "This is todo 2",
        userId: "2",
        createdAt: new Date(),
        updatedAt: new Date(),
        isCompleted: false,
      };
      const response = TodoService.createTodo(newTodo);

      expect(response.statusCode).toBe(HttpStatusCodes.CREATED);
    });
  });

  // Unit test for - delete todo
  describe("Delete user by id", () => {
    let todoModelDeleteUserByIdStub: Sinon.SinonStub;

    beforeEach(() => {
      todoModelDeleteUserByIdStub = Sinon.stub(TodoModel, "deleteTodo");
    });

    afterEach(() => {
      todoModelDeleteUserByIdStub.restore();
    });

    // test case for - user deletion
    it("Should return successful deletion status", () => {
      const response = TodoService.deleteTodo("1", "1");

      expect(response.statusCode).toBe(HttpStatusCodes.NO_CONTENT);
    });
  });

  // Unit test for - get all todos
  describe("Get all todos by userId", () => {
    let todoModelGetAllTodosByUserIdStub: Sinon.SinonStub;

    beforeEach(() => {
      todoModelGetAllTodosByUserIdStub = Sinon.stub(TodoModel, "getAllTodos");
    });

    afterEach(() => {
      todoModelGetAllTodosByUserIdStub.restore();
    });

    // test case for - no todos found
    it("Should not found error on empty todos returned", () => {
      todoModelGetAllTodosByUserIdStub.returns([]);
      expect(() => TodoService.getAllTodos("1")).toThrow(
        new NotFoundError("No todos found.")
      );
    });

    // test case for - todos found
    it("Should return list of todos", () => {
      let todos = [
        {
          id: "1",
          title: "Todo 1",
          description: "This is todo 1",
          userId: "2",
          createdAt: new Date(),
          updatedAt: new Date(),
          isCompleted: false,
        },
        {
          id: "2",
          title: "Todo 2",
          description: "This is todo 2",
          userId: "2",
          createdAt: new Date(),
          updatedAt: new Date(),
          isCompleted: false,
        },
      ];

      todoModelGetAllTodosByUserIdStub.returns(todos);

      const response = TodoService.getAllTodos("1");
      expect(response.statusCode).toBe(HttpStatusCodes.OK);
      expect(response.todos).toStrictEqual(todos);
    });
  });

  // Unit test for - get todo by id
  describe("Get todo by id", () => {
    let todoModelGetUserByidStub: Sinon.SinonStub;

    beforeEach(() => {
      todoModelGetUserByidStub = Sinon.stub(TodoModel, "getTodoById");
    });

    afterEach(() => {
      todoModelGetUserByidStub.restore();
    });

    // test case for - todo not found
    it("Should return not-found-error, if user isn't found", () => {
      todoModelGetUserByidStub.returns(undefined);

      expect(() => TodoService.getTodoById("1", "1")).toThrow(
        new NotFoundError(`No todo found with id: 1`)
      );
    });

    // test case for - todo found
    it("Should return a todo", () => {
      let todo: Todo = {
        id: "2",
        title: "Todo 2",
        description: "This is todo 2",
        userId: "2",
        createdAt: new Date(),
        updatedAt: new Date(),
        isCompleted: false,
      };

      todoModelGetUserByidStub.returns(todo);

      const response = TodoService.getTodoById("1", "1");

      expect(response.statusCode).toBe(HttpStatusCodes.OK);
      expect(response.todo).toStrictEqual(todo);
    });
  });

  // Unit test for - update todo
  describe("updateTodo", () => {
    let todoModelUpdateTodoStub: Sinon.SinonStub;

    beforeEach(() => {
      todoModelUpdateTodoStub = Sinon.stub(TodoModel, "udpateTodo");
    });

    afterEach(() => {
      todoModelUpdateTodoStub.restore();
    });

    // test case for - update todo
    it("Should return successful todo-updated status", () => {
      const id = "123";
      const title = "Updated Todo";
      const description = "Updated Description";
      const userId = "456";

      const response = TodoService.updateTodo(id, title, description, userId);

      expect(response.statusCode).toBe(HttpStatusCodes.OK);
    });
  });

  // Unit test for - update todo's isComplete status
  describe("updateTodoIsCompleteStatus", () => {
    let todoModelUpdateTodosIsCompleteStatus: Sinon.SinonStub;

    beforeEach(() => {
      todoModelUpdateTodosIsCompleteStatus = Sinon.stub(
        TodoModel,
        "updateTodoCompletedStatus"
      );
    });

    afterEach(() => {
      todoModelUpdateTodosIsCompleteStatus.restore();
    });
    // test case for - update is complete status of a todo

    it("Should return successful todo's-isCompleted status", () => {
      const response = TodoService.updateTodoIsCompleteStatus("1", "1");

      expect(response.statusCode).toBe(HttpStatusCodes.OK);
    });
  });
});
