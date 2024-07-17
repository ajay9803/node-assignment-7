import { BaseError } from "./base_error";

export class InvalidError extends BaseError {
  constructor(message = "Invalid.") {
    super(message);

    this.message = message;
  }
}
