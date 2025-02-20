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
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        if (err instanceof HttpException) {
          status = err.getStatus();
          message = `${err.getResponse()}`;
        }

        return throwError(
          () =>
            new HttpException(
              {
                status: status,
                message: message,
                error: message,
              },
              status,
            ),
        );
      }),
    );
  }
}
