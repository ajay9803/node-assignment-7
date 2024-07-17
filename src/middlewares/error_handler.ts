import { Response, Request, NextFunction } from "express";
import HttpStatusCodes from "http-status-codes";
import { UnauthenticatedError } from "../error/unauthenticated_error";
import loggerWithNameSpace from "../utils/logger";
import { NotFoundError } from "../error/not_found_error";
import { InvalidError } from "../error/invalid_error";
import { UnauthorizedError } from "../error/unauthorized_error";
import { ConflictError } from "../error/conflict_error";
import { BadRequestError } from "../error/bad_request_error";

const logger = loggerWithNameSpace("ErrorHandler");

export const genericErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error.stack) {
    // log stacks of errors for debugging
    logger.error(error.stack);
  }

  // check if the retrieved error is an instance of unauthenticated-error
  if (error instanceof UnauthenticatedError) {
    return res.status(HttpStatusCodes.UNAUTHORIZED).json({
      message: error.message,
    });
  }
  // check if the retrieved error is an instance of not-found-error
  else if (error instanceof NotFoundError) {
    return res.status(HttpStatusCodes.NOT_FOUND).json({
      message: error.message,
    });
  }
  // check if the retrieved error is an instance of invalid error
  else if (error instanceof InvalidError) {
    return res.status(HttpStatusCodes.UNAUTHORIZED).json({
      message: error.message,
    });
  }
  // check if the retrieved error is an instance of unauthorized error
  else if (error instanceof UnauthorizedError) {
    return res.status(HttpStatusCodes.FORBIDDEN).json({
      message: error.message,
    });
  }
  // check if the retrieved error is an instance of conflict error
  else if (error instanceof ConflictError) {
    return res.status(HttpStatusCodes.CONFLICT).json({
      message: error.message,
    });
  }
  // check if the retrieved error is an instance of bad request error
  else if (error instanceof BadRequestError) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  } else {
    // default error message - Internal Server Error
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message || "Internal Server Error",
    });
  }
};
