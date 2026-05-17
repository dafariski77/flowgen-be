import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiResponse, successResponse } from "./api-response";

/**
 * Global interceptor that wraps all successful controller responses
 * into the standardized { meta, data, error } format.
 *
 * Controllers just return raw data — this interceptor handles the wrapping.
 */
@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse();
    const statusCode: number = response.statusCode;

    return next.handle().pipe(
      map((data) => {
        const message = this.getMessageForStatus(statusCode);
        return successResponse(data, message, statusCode);
      }),
    );
  }

  private getMessageForStatus(code: number): string {
    switch (code) {
      case 200:
        return "Success";
      case 201:
        return "Created successfully";
      case 204:
        return "Deleted successfully";
      default:
        return "Success";
    }
  }
}
