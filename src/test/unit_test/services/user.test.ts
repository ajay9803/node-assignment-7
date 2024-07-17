import {
  add,
  createUser,
  getUserById,
  getUserByEmail,
  deleteUserById,
  updateUserById,
} from "../../../services/user";
import sinon from "sinon";

import expect from "expect";

import * as UserModel from "../../../models/user";
import { NotFoundError } from "../../../error/not_found_error";
import bcrypt from "bcrypt";
import Sinon from "sinon";
import { ConflictError } from "../../../error/conflict_error";
import HttpStatusCodes from "http-status-codes";

// Example - test suite
describe("Example Test Suite", () => {
  describe("Addition Example", () => {
    it("Return sum of 2 numbers", () => {
      const result = add(1, 2);

      expect(result).toBe(3);
    });
  });
});

// User service - test suite
describe("User Service Test Suite", () => {
  // unit test for - getUserById
  describe("Get user by id", () => {
    let userModelGetUserByIdStub: sinon.SinonStub;
    beforeEach(() => {
      userModelGetUserByIdStub = sinon.stub(UserModel, "getUserById");
    });

    afterEach(() => {
      userModelGetUserByIdStub.restore();
    });

    // not found error - test case
    it("Should throw error when user isn't found", () => {
      userModelGetUserByIdStub.returns(undefined);

      expect(() => getUserById("10")).toThrow(
        new NotFoundError("User not found.")
      );
    });

    // user found - test case
    it("Should return a user when user is found", () => {
      const user = {
        id: "1",
        name: "Test",
        email: "test@gmail.com",
        password: "test123",
        permissions: [],
      };
      userModelGetUserByIdStub.returns(user);

      const response = getUserById("1");

      expect(response.user).toStrictEqual(user);
      expect(response.statusCode).toBe(HttpStatusCodes.OK);
    });
  });

  // unit test for - createUser
  describe("Create user", () => {
    let bcryptHasStub: sinon.SinonStub;
    let userModelCreateUserStub: sinon.SinonStub;
    let userModelGetUserByEmailStub: sinon.SinonStub;

    beforeEach(() => {
      bcryptHasStub = sinon.stub(bcrypt, "hash");
      userModelCreateUserStub = sinon.stub(UserModel, "createUser");
      userModelGetUserByEmailStub = sinon.stub(UserModel, "getUserByEmail");
    });

    afterEach(() => {
      bcryptHasStub.restore();
      userModelCreateUserStub.restore();
      userModelGetUserByEmailStub.restore();
    });

    // test case for - conflict error on existing emails
    it("Should return a conflict error when user existing user is found", async () => {
      const user = {
        id: "1",
        name: "Test",
        email: "test@gmail.com",
        password: "test123",
        permissions: [],
      };
      userModelGetUserByEmailStub.returns(user);
      bcryptHasStub.resolves("hashedPassword");

      await expect(createUser(user)).rejects.toThrow(
        new ConflictError("User already exists.")
      );
    });

    // test case for - successful user creation
    it("Should create new user", async () => {
      bcryptHasStub.resolves("hashedPassword");

      const user = {
        name: "Test",
        email: "test@gmail.com",
        password: "test123",
        permissions: [],
      };

      const response = await createUser(user);

      expect(response.statusCode).toBe(HttpStatusCodes.CREATED);

      expect(bcryptHasStub.callCount).toBe(1);
      expect(bcryptHasStub.getCall(0).args).toStrictEqual([user.password, 10]);

      expect(userModelCreateUserStub.callCount).toBe(1);
      expect(userModelCreateUserStub.getCall(0).args).toStrictEqual([
        { ...user, password: "hashedPassword" },
      ]);
    });
  });

  // unit test for - getUserByEmail
  describe("Get user by email", () => {
    let userModelGetUserByEmailStub: sinon.SinonStub;

    beforeEach(() => {
      userModelGetUserByEmailStub = sinon.stub(UserModel, "getUserByEmail");
    });

    afterEach(() => {
      userModelGetUserByEmailStub.restore();
    });

    // test case for - no user found
    it("Should throw not-found-error", () => {
      userModelGetUserByEmailStub.returns(undefined);

      const response = getUserByEmail("test@gmail.com");

      expect(response).toBe(undefined);
    });

    // test case for - user found
    it("Should return user", () => {
      const user = {
        id: "1",
        name: "Test",
        email: "test@gmail.com",
        password: "test123",
        permissions: [],
      };

      userModelGetUserByEmailStub.returns(user);

      const response = getUserByEmail("test@gmail.com");
      expect(response).toBe(user);
    });
  });

  // unit test for - update user by id
  describe("Update user by id", () => {
    let userModelUpdateUserById: Sinon.SinonStub;

    beforeEach(() => {
      userModelUpdateUserById = Sinon.stub(UserModel, "updateUserById");
    });

    afterEach(() => {
      userModelUpdateUserById.restore();
    });

    let updatingValues = {
      name: "example",
      password: "Test@9803",
      email: "example@gmail.com",
    };

    // test case for - user not found
    it("Should throw not-found-error, if user id isn't found", () => {
      userModelUpdateUserById.returns(undefined);

      expect(() => updateUserById("1", updatingValues)).toThrow(
        new NotFoundError("No such user found.")
      );
    });

    // test case for - user updated
    it("Should return updated user, if user is found", () => {
      let updatedUser = {
        id: "1",
        name: "example",
        password: "Test@9803",
        email: "example@gmail.com",
        permissions: [],
      };
      userModelUpdateUserById.returns(updatedUser);

      const response = updateUserById("1", updatingValues);

      expect(response.statusCode).toBe(HttpStatusCodes.OK);
      expect(response.user).toStrictEqual(updatedUser);
    });
  });

  // unit test for - deleteUserById
  describe("Get user by id", () => {
    let userModelDeleteUserByIdStub: sinon.SinonStub;
    beforeEach(() => {
      userModelDeleteUserByIdStub = sinon.stub(UserModel, "deleteUserById");
    });

    afterEach(() => {
      userModelDeleteUserByIdStub.restore();
    });

    // user deleted - test case
    it("Should return no-content statusCode when user is deleted", () => {
      const response = deleteUserById("1");

      expect(response.statusCode).toStrictEqual(HttpStatusCodes.NO_CONTENT);
    });
  });
});
