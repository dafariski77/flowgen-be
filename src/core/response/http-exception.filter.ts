import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import { errorResponse } from "./api-response";

/**
 * Global exception filter that wraps all errors into the standardized
 * { meta, data, error } format.
 *
 * Handles both HttpException (known errors) and unexpected exceptions.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";
    let errorMessage = "An unexpected error occurred";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
        errorMessage = exceptionResponse;
      } else if (typeof exceptionResponse === "object") {
        const res = exceptionResponse as Record<string, unknown>;
        message = (res.error as string) || exception.message;

        // class-validator returns an array of messages
        if (Array.isArray(res.message)) {
          errorMessage = res.message.join(", ");
        } else {
          errorMessage = (res.message as string) || exception.message;
        }
      }
    } else if (exception instanceof Error) {
      errorMessage = exception.message;
    }

    response.status(status).json(errorResponse(errorMessage, status, message));
  }
}
