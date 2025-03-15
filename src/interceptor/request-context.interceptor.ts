import { Observable, tap } from 'rxjs';
import IUser from '@/users/interfaces/user.interface';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { RequestContextService } from '../context/request-context';

@Injectable()
export class ContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as IUser;
    if (user) {
      const { username } = user;
      RequestContextService.setUsername(username);
    }
    return next.handle().pipe(
      tap(() => {
        // Perform cleaning if needed
      }),
    );
  }
}
