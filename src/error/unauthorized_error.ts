import { BaseError } from "./base_error";

export class UnauthorizedError extends BaseError {
  constructor(message = "Unauthorized access.") {
    super(message);
    this.message = message;
  }
}
