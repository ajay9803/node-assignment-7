import { NextFunction, Response } from "express";
import { Request } from "../interfaces/auth";
import { JsonWebTokenError, verify } from "jsonwebtoken";
import config from "../config";
import { UnauthenticatedError } from "../error/unauthenticated_error";
import { InvalidError } from "../error/invalid_error";
import { User } from "../interfaces/user";

// authentication middleware - for verifying / authenticating user
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get authorization - headers
    const { authorization } = req.headers;

    // throw unauthenticated error - when header not found
    if (!authorization) {
      next(new UnauthenticatedError("Authorization header not found."));
      return;
    }

    // throw unauthenticated error - bearer token not provided
    const token = authorization?.split(" ");
    if (token?.length !== 2 || token[0] !== "Bearer") {
      next(new UnauthenticatedError("No bearer token provided."));
      return;
    }

    // verify token
    const decodedToken = verify(token[1], config.jwt_secret!) as Omit<
      User,
      "password"
    >;

    // throw unauthenticated error - token data invalid
    if (!decodedToken) {
      next(new UnauthenticatedError());
    }
    let user = {
      id: decodedToken.id,
      email: decodedToken.email,
      name: decodedToken.name,
      permissions: decodedToken.permissions,
    };

    req.user = user;

    next();
  } catch (e) {
    // throw invalid token error
    if (e instanceof JsonWebTokenError) {
      throw new InvalidError("Invalid token.");
    }
    throw e;
  }
};
