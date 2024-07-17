import { NextFunction, Response } from "express";
import { Request } from "../interfaces/auth";
import { UnauthorizedError } from "../error/unauthorized_error";

// authorize function - to forbid user from certain operations
export const authorize = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // get request object with user data
      const user = req.user!;

      // check if the user has necessary permission to move along the operation
      if (!user.permissions.includes(permission)) {
        next(new UnauthorizedError("Your access is forbidden."));
      }
      next();
    } catch (e) {
      // throw any occuring error
      throw e;
    }
  };
};
