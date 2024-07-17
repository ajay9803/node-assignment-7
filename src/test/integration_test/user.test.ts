import request from "supertest";

import express from "express";
import router from "../../routes";
import { users } from "../../models/user";
import expect from "expect";
import { genericErrorHandler } from "../../middlewares/error_handler";
import { User } from "../../interfaces/user";
import HttpStatusCodes from "http-status-codes";

// User Integration - Test Suite
describe("User Integration Test Suite", () => {
  const app = express();

  app.use(express.json());
  app.use(router);

  // pass error handling middleware
  app.use(genericErrorHandler);
  const superUser: Omit<User, "password"> = {
    id: "1",
    name: "Admin",
    email: "admin@gmail.com",
    permissions: [
      "users.create",
      "users.update",
      "users.delete",
      "users.fetch",
      "todos.create",
      "todos.update",
      "todos.delete",
      "todos.fetch",
    ],
  };

  // integration test for - create user
  describe("Create user - API Test", () => {
    let token: string;

    beforeEach(async () => {
      token = (
        await request(app).post("/auth/login").send({
          email: superUser.email,
          password: "Test@9803",
        })
      ).body.accessToken;
    });

    afterEach(() => {
      token = "";
    });

    // test case for - conflict if the user exits
    it("Should return conflict error, if user already exists", async () => {
      let userCredentials = {
        name: "test",
        email: "test1@gmail.com",
        password: "Test@9803",
      };

      const response = await request(app)
        .post("/users")
        .set("Authorization", `Bearer ${token}`)
        .send(userCredentials);

      expect(response.status).toBe(HttpStatusCodes.CONFLICT);
      expect(response.body.message).toBe("User already exists.");
    });

    // test case for - bad request
    it("Should return bad request error, on bad request", async () => {
      let userCredentials = {
        email: "test4@gmail.com",
        password: "Test@9803",
      };

      const response = await request(app)
        .post("/users")
        .set("Authorization", `Bearer ${token}`)
        .send(userCredentials);

      expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
    });

    // test case for - successful user created
    it("Should success status / message, when user is created", async () => {
      let userCredentials = {
        name: "test4",
        email: "test4@gmail.com",
        password: "Test@9803",
      };

      const response = await request(app)
        .post("/users")
        .set("Authorization", `Bearer ${token}`)
        .send(userCredentials);

      expect(response.status).toBe(HttpStatusCodes.CREATED);
      expect(response.body.message).toBe("User created successfully");
    });
  });

  // integration test for - get user by id
  describe("Get user by id - API test", () => {
    let token: string;

    beforeEach(async () => {
      token = (
        await request(app).post("/auth/login").send({
          email: "admin@gmail.com",
          password: "Test@9803",
        })
      ).body.accessToken;
    });

    afterEach(() => {
      token = "";
    });

    let id: string = "5";

    // test case for - no user found
    it("Should throw not-found-error, when no user is found", async () => {
      const response = await request(app)
        .get(`/users/${id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
      expect(response.body.message).toBe("User not found.");
    });

    // test case for - user found
    it("Should return user, when user is found", async () => {
      let userId: string = "2";
      const response = await request(app)
        .get(`/users/${userId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatusCodes.OK);
    });
  });

  // Integration test for - update user by id
  describe("Updade user by id - API test", () => {
    let token: string;

    beforeEach(async () => {
      token = (
        await request(app).post("/auth/login").send({
          email: "admin@gmail.com",
          password: "Test@9803",
        })
      ).body.accessToken;
    });

    afterEach(() => {
      token = "";
    });

    // test case - when user not found
    it("Should return no user found, when user isn't found", async () => {
      let userId: string = "5";

      let updateCredentials = {
        name: "Test1",
        email: "test1@gmail.com",
        password: "Test@9803",
      };

      const response = await request(app)
        .put(`/users/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateCredentials);

      expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    // test case - when user is found
    it("Should return updated user, when user is found", async () => {
      let userId: string = "1";

      let updateCredentials = {
        name: "Example",
        email: "exmaple@gmail.com",
        password: "Test@9803",
      };

      const response = await request(app)
        .put(`/users/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateCredentials);

      expect(response.status).toBe(HttpStatusCodes.OK);
      expect(response.body.message).toBe("User updated successfully");
    });

    // test case for - bad request
    it("Should throw bad request error on bad request", async () => {
      let userId: string = "1";

      let updateCredentials = {
        email: "exmaple@gmail.com",
        password: "Test@9803",
      };

      const response = await request(app)
        .put(`/users/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateCredentials);

      expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
    });
  });

  // Integration test for - delete user by id
  describe("Delete user by id - API Test", () => {
    let token: string;

    beforeEach(async () => {
      token = (
        await request(app).post("/auth/login").send({
          email: "admin@gmail.com",
          password: "Test@9803",
        })
      ).body.accessToken;
    });

    afterEach(() => {
      token = "";
    });

    // test case - when user not found
    it("Should return no user found, when user isn't found", async () => {
      let userId: string = "5";

      const response = await request(app)
        .delete(`/users/${userId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    // test case - delete user when found
    it("Should delete the user when user is found", async () => {
      let userId: string = "1";

      const response = await request(app)
        .delete(`/users/${userId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatusCodes.OK);
    });

    // test case - delete admin
    it("Should throw forbidden error", async () => {
      let userId: string = "0";

      const response = await request(app)
        .delete(`/users/${userId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });
  });
});
