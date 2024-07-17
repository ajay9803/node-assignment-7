import { NextFunction, Response } from "express";

import { Request } from "../interfaces/auth";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("RequestLogger");

// log request-method and request-url for easy debugging
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  logger.info(`${req.method}: ${req.url}`);
  next();
}
