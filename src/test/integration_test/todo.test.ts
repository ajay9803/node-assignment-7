import express from "express";
import router from "../../routes";
import { genericErrorHandler } from "../../middlewares/error_handler";
import request from "supertest";
import expect from "expect";
import HttpStatusCodes from "http-status-codes";

describe("Todo Integration Test Suite", () => {
  const app = express();

  app.use(express.json());
  app.use(router);

  // pass error handling middleware
  app.use(genericErrorHandler);

  let user = {
    id: "1",
    name: "test 1",
    email: "test1@gmail.com",
    permissions: [
      "todos.create",
      "todos.update",
      "todos.delete",
      "todos.fetch",
    ],
  };

  // Integration Test for - create todo
  describe("Create Todo - API Test", () => {
    let token: string;

    beforeEach(async () => {
      token = (
        await request(app)
          .post("/auth/login")
          .send({ email: user.email, password: "Test@9803" })
      ).body.accessToken;
    });

    afterEach(() => {
      token = "";
    });

    // test case for - bad request
    it("Should throw bad request error on bad request", async () => {
      let todoData = {
        title: "new todo",
      };

      const response = await request(app)
        .post("/todos")
        .set("Authorization", `Bearer ${token}`)
        .send(todoData);

      expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
    });

    // test case for - todo created
    it("Should send success message when todo is created", async () => {
      let todoData = {
        title: "new todo",
        description: "this is new todo.",
      };

      const response = await request(app)
        .post("/todos")
        .set("Authorization", `Bearer ${token}`)
        .send(todoData);

      expect(response.status).toBe(HttpStatusCodes.CREATED);
    });
  });

  // Integration Test for - get all todos
  describe("Get all todos - API Test", () => {
    let token: string;

    beforeEach(async () => {
      token = (
        await request(app)
          .post("/auth/login")
          .send({ email: user.email, password: "Test@9803" })
      ).body.accessToken;
    });

    afterEach(() => {
      token = "";
    });

    // test case for - todos found
    it("Should return list of todos", async () => {
      const response = await request(app)
        .get("/todos/all")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatusCodes.OK);
    });
  });

  // Integration Test for - get a todo
  describe("Get a todo - API Test", () => {
    let token: string;

    beforeEach(async () => {
      token = (
        await request(app)
          .post("/auth/login")
          .send({ email: user.email, password: "Test@9803" })
      ).body.accessToken;
    });

    afterEach(() => {
      token = "";
    });

    // test case for - todo not found
    it("Should throw not found error", async () => {
      let id: string = "3";
      const response = await request(app)
        .get(`/todos/${id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
      expect(response.body.message).toBe(`No todo found with id: ${id}`);
    });

    // test case for - todo found
    it("Should return success message on todo found", async () => {
      const response = await request(app)
        .get("/todos/1")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatusCodes.OK);
    });
  });

  // Integration Test for - update todo
  describe("Update todo - API Test", () => {
    let token: string;

    beforeEach(async () => {
      token = (
        await request(app)
          .post("/auth/login")
          .send({ email: user.email, password: "Test@9803" })
      ).body.accessToken;
    });

    afterEach(() => {
      token = "";
    });

    // test case for - no todo found
    it("Should throw not found error", async () => {
      let updateCredentials = {
        title: "example",
        description: "example 123 example",
      };
      let id: string = "3";
      const response = await request(app)
        .put(`/todos/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateCredentials);

      expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
      expect(response.body.message).toBe(`No such todo found.`);
    });

    // test case for - bad request
    it("Should throw bad request error", async () => {
      let updateCredentials = {
        title: "example",
      };
      let id: string = "3";
      const response = await request(app)
        .put(`/todos/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateCredentials);

      expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
    });

    // test case for - todo updated
    it("Should return update-success message", async () => {
      let updateCredentials = {
        title: "example",
        description: "example 123 example",
      };
      let id: string = "1";
      const response = await request(app)
        .put(`/todos/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateCredentials);

      expect(response.status).toBe(HttpStatusCodes.OK);
      expect(response.body.message).toBe("Todo updated successfully");
    });
  });

  // Integration Test for - update todo's is-complete status
  describe("Update todo's is-complete status - API Test", () => {
    let token: string;

    beforeEach(async () => {
      token = (
        await request(app)
          .post("/auth/login")
          .send({ email: user.email, password: "Test@9803" })
      ).body.accessToken;
    });

    afterEach(() => {
      token = "";
    });

    // test case for - no todo found
    it("Should throw not found error", async () => {
      let id: string = "3";
      const response = await request(app)
        .patch(`/todos/${id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
      expect(response.body.message).toBe(`No such todo found.`);
    });

    // test case for - todo's is-complete status updated
    it("Should return update-success message", async () => {
      let id: string = "1";
      const response = await request(app)
        .patch(`/todos/${id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatusCodes.OK);
      expect(response.body.message).toBe("Todo updated successfully");
    });
  });

  // Integration Test for - delete todo
  describe("Delete todo, API Test", () => {
    let token: string;

    beforeEach(async () => {
      token = (
        await request(app)
          .post("/auth/login")
          .send({ email: user.email, password: "Test@9803" })
      ).body.accessToken;
    });

    afterEach(() => {
      token = "";
    });

    // test case for - no todo found
    it("Should throw not found error", async () => {
      let id: string = "3";
      const response = await request(app)
        .delete(`/todos/${id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
      expect(response.body.message).toBe(`No such todo found.`);
    });

    // test case for - todo's is-complete status updated
    it("Should return update-success message", async () => {
      let id: string = "1";
      const response = await request(app)
        .delete(`/todos/${id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatusCodes.OK);
      expect(response.body.statusCode).toBe(HttpStatusCodes.NO_CONTENT);
    });
  });
});
