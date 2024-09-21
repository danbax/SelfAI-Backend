// src/common/interceptors/response.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = new Date();
    return next.handle().pipe(
      map((data) => ({
        status: 'ok',
        serverResponseTime: now.toISOString(),
        response: data,
      })),
      catchError((err) => {
        // Determine if the error is an HttpException
        const status =
          err instanceof HttpException
            ? err.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        // In case of 500, include the exception message and stack trace
        if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
          return throwError(() => ({
            status: 'error',
            message: err.message || 'Internal server error',
            stack: err.stack,  // Include stack trace
            statusCode: status,
            serverResponseTime: now.toISOString(),
          }));
        }

        // For other errors, return a generic error response
        return throwError(() => ({
          status: 'error',
          message: err.message || 'An error occurred',
          statusCode: status,
          serverResponseTime: now.toISOString(),
        }));
      }),
    );
  }
}
