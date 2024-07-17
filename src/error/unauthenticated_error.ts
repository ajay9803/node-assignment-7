import { BaseError } from "./base_error";

// base class for unauthenticated error
export class UnauthenticatedError extends BaseError {
  constructor(message = "Authentication failed.") {
    super(message);

    this.message = message;
  }
}
