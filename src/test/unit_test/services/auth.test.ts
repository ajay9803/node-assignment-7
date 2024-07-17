import Sinon from "sinon";
import * as UserModel from "../../../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as AuthService from "../../../services/auth";
import expect from "expect";
import { NotFoundError } from "../../../error/not_found_error";
import { UnauthenticatedError } from "../../../error/unauthenticated_error";
import HttpStatusCodes from "http-status-codes";

// Auth Service - Test Suite
describe("Auth Service Test Suite", () => {
  // Unit test for - login user
  describe("Login", () => {
    let userModelGetUserByEmailStub: Sinon.SinonStub;
    let isValidPasswordStub: Sinon.SinonStub;
    let tokenStub: Sinon.SinonStub;

    let testCredentials = {
      email: "test@gmail.com",
      password: "Test@9803",
    };

    beforeEach(() => {
      userModelGetUserByEmailStub = Sinon.stub(UserModel, "getUserByEmail");
      isValidPasswordStub = Sinon.stub(bcrypt, "compare");
      tokenStub = Sinon.stub(jwt, "sign");
    });

    afterEach(() => {
      userModelGetUserByEmailStub.restore();
      isValidPasswordStub.restore();
      tokenStub.restore();
    });

    // test case for - when user isn't found
    it("Should throw not-found error, when user isn't found", async () => {
      userModelGetUserByEmailStub.returns(undefined);

      await expect(
        AuthService.login(testCredentials.email, testCredentials.password)
      ).rejects.toThrow(
        new NotFoundError("No user found with associated email.")
      );
    });

    // test case for - when password isn't valid
    it("Should throw unauthenticated-error, when password isn't valid", async () => {
      let existingUser = {
        id: "2",
        name: "test 1",
        email: "test1@gmail.com",
        password:
          "$2b$10$qU4R6tjzgsJIRYNEuzGSAO7cL2qDGg2.N4QMw0w2GXQvA1hM36R2W",
        permissions: [
          "todos.create",
          "todos.update",
          "todos.delete",
          "todos.fetch",
        ],
      };
      userModelGetUserByEmailStub.returns(existingUser);

      isValidPasswordStub.resolves(false);

      await expect(
        AuthService.login(testCredentials.email, testCredentials.password)
      ).rejects.toThrow(new UnauthenticatedError("Invalid email or password."));
    });

    // test case for - when user is successfully logged in
    it("Should return tokens along with the logged in user", async () => {
      let existingUser = {
        id: "2",
        name: "test 1",
        email: "test1@gmail.com",
        password:
          "$2b$10$qU4R6tjzgsJIRYNEuzGSAO7cL2qDGg2.N4QMw0w2GXQvA1hM36R2W",
        permissions: [
          "todos.create",
          "todos.update",
          "todos.delete",
          "todos.fetch",
        ],
      };
      userModelGetUserByEmailStub.returns(existingUser);

      isValidPasswordStub.resolves(true);

      tokenStub.returns("#token");
      const response = await AuthService.login(
        testCredentials.email,
        testCredentials.password
      );

      expect(response).toStrictEqual({
        statusCode: HttpStatusCodes.OK,
        message: "User login successful.",
        user: existingUser,
        accessToken: "#token",
        refreshToken: "#token",
      });
    });
  });

  // unit test for - refersh access token
  describe("refreshAccessToken", () => {
    let verifyTokenStub: Sinon.SinonStub;
    let signTokenStub: Sinon.SinonStub;

    beforeEach(() => {
      verifyTokenStub = Sinon.stub(jwt, "verify");
      signTokenStub = Sinon.stub(jwt, "sign");
    });

    afterEach(() => {
      verifyTokenStub.restore();
      signTokenStub.restore();
    });

    // test case for - no token provided
    it("Should throw unauthenticated error on no token provided", () => {
      let refreshToken = "random variable";
      expect(() => AuthService.refreshAccessToken(refreshToken)).toThrow(
        new NotFoundError("No Bearer token provided.")
      );
    });

    // test case for - invalid token provided
    it("Should throw unauthenticated error on invalid token provided", () => {
      let refreshToken = "Bearer random#123";
      verifyTokenStub.returns(false);
      expect(() => AuthService.refreshAccessToken(refreshToken)).toThrow(
        new UnauthenticatedError("Invalid token provided.")
      );
    });

    // test case for - successful access-token regeneration
    it("Should return access token on valid token provided", () => {
      let refreshToken = "Bearer random#123";
      const decodedToken = {
        id: "1",
        name: "test ",
        email: "test@gmail.com",
        permissions: [],
      };

      verifyTokenStub.returns(decodedToken);
      signTokenStub.returns("#newToken");

      const response = AuthService.refreshAccessToken(refreshToken);

      expect(response).toStrictEqual({
        statusCode: HttpStatusCodes.OK,
        accessToken: "#newToken",
      });
    });
  });
});
