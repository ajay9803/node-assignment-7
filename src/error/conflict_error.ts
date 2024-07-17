import { BaseError } from "./base_error";

export class ConflictError extends BaseError {
  constructor(message = "Conflict in Resources.") {
    super(message);

    this.message = message;
  }
}
