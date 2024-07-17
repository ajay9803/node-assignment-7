import express from "express";
import {
  createNewUser,
  deleteUserById,
  getUserById,
  updateUserById,
} from "../controllers/user";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import {
  validateReqBody,
  validateRequestParams,
} from "../middlewares/validator";
import { createUserBodySchema, getUserParamsSchema } from "../schemas/user";

const router = express();

// create-user route to create new user
router.post(
  "/",
  validateReqBody(createUserBodySchema),
  authenticate,
  authorize("users.create"),
  createNewUser
);

// get-user router to fetch user by id
// make use of authenticate middleware to authenticate user for accessing further contents
router.get(
  "/:id",
  validateRequestParams(getUserParamsSchema),
  authenticate,
  authorize("users.fetch"),
  getUserById
);

// update-user-router to  update user data
router.put(
  "/:id",
  validateRequestParams(getUserParamsSchema),
  validateReqBody(createUserBodySchema),
  authenticate,
  authorize("users.update"),
  updateUserById
);

// delete-user-router to delete user data
router.delete(
  "/:id",
  validateRequestParams(getUserParamsSchema),
  authenticate,
  authorize("users.delete"),
  deleteUserById
);

export default router;
