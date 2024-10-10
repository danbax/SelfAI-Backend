import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        const status =
          err instanceof HttpException
            ? err.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const response = {
          message: err.message || 'An error occurred',
          statusCode: status,
        };

        // Add stack trace if it's an internal server error
        if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
          response['stack'] = err.stack;
        }

        return throwError(() => response);
      }),
    );
  }
}
