import { BaseError } from "./base_error";

export class NotFoundError extends BaseError {
    constructor(message = "Not found.") {
        super(message);

        this.message = message;
    }
}