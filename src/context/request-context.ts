import { RequestContext } from 'nestjs-request-context';

/**
 * Setting some isolated context for each request.
 */

export class AppRequestContext extends RequestContext {
  username?: string;
}

export class RequestContextService {
  static getContext(): AppRequestContext {
    const ctx: AppRequestContext = RequestContext.currentContext.req;
    return ctx;
  }

  static setUsername(username: string): void {
    const ctx = this.getContext();
    ctx.username = username;
  }

  static getUsername(): string {
    return this.getContext().username ?? '';
  }
}
