import { Injectable, ExecutionContext, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      this.setAuthenticationStatus(context.switchToHttp().getRequest(), true);
      return true;
    }

    return super.canActivate(context);
  }

  private setAuthenticationStatus(request: any, isPublic: boolean): void {
    request.isPublicRoute = isPublic;
  }

  handleRequest(err, user, context) {
    const request = context?.switchToHttp().getRequest();
    const isPublicRoute = request?.isPublicRoute;

    if (isPublicRoute) {
      return { isPublicRoute: true };
    }

    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
