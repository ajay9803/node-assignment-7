import express from "express";
import router from "../../routes";
import { genericErrorHandler } from "../../middlewares/error_handler";
import request from "supertest";
import expect from "expect";
import HttpStatusCodes from "http-status-codes";

// Auth Integration - Test Suite
describe("Auth Integration - Test Suite", () => {
  const app = express();

  app.use(express.json());
  app.use(router);

  // pass error handling middleware
  app.use(genericErrorHandler);

  // Integration test for - login user
  describe("Login user - API Test", () => {
    // test case for - no user found
    it("Should return not found error", async () => {
      let userCredentails = {
        email: "test5@gmail.com",
        password: "Test@123",
      };

      const response = await request(app)
        .post("/auth/login")
        .send(userCredentails);

      expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    // test case for - invalid login credentials
    it("Should return unauthorized-error", async () => {
      let userCredentails = {
        email: "test1@gmail.com",
        password: "Wrong@123",
      };

      const response = await request(app)
        .post("/auth/login")
        .send(userCredentails);

      expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    // test case for - user login
    it("Should return access tokens along with user", async () => {
      let userCredentails = {
        email: "test1@gmail.com",
        password: "Test@9803",
      };

      const response = await request(app)
        .post("/auth/login")
        .send(userCredentails);

      expect(response.status).toBe(HttpStatusCodes.OK);
    });
  });

  //   Integration test for - refresh access token
  describe("Refresh access token - API Test", () => {
    let refreshToken: string;
    let userCredentails = {
      email: "test1@gmail.com",
      password: "Test@9803",
    };

    beforeEach(async () => {
      refreshToken = (
        await request(app).post("/auth/login").send(userCredentails)
      ).body.refreshToken;
    });

    afterEach(() => {
      refreshToken = "";
    });
    // test case for - bearer token not provided
    it("Should throw bearer token not found error", async () => {
      const response = await request(app).post("/auth/refresh-access-token");

      expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    // test case for - invalid token
    it("Should return invalid token error", async () => {
      const response = await request(app)
        .post("/auth/refresh-access-token")
        .set("Authorization", "Bearer randomVariable");

      expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    // test case for - user login
    it("Should return invalid token error", async () => {
      const response = await request(app)
        .post("/auth/refresh-access-token")
        .set("Authorization", `Bearer ${refreshToken}`);

      expect(response.status).toBe(HttpStatusCodes.OK);
    });
    it("Should create new access token and return the token", async () => {});
  });
});
