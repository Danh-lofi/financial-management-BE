import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | object = 'Internal server error';
        let error: string = '';
        if (err instanceof HttpException) {
          status = err.getStatus();
          const response = err.getResponse();
          if (
            typeof response === 'object' &&
            response.hasOwnProperty('message')
          ) {
            message = response['message'];
          } else {
            message = response;
          }
          if (
            typeof response === 'object' &&
            response.hasOwnProperty('error')
          ) {
            error = response['error'];
          }
        }

        return throwError(
          () =>
            new HttpException(
              {
                status: status,
                message,
                error,
              },
              status,
            ),
        );
      }),
    );
  }
}
