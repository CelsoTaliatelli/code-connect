import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtGuard implements CanActivate {
  private readonly jwtGuard = new (AuthGuard('jwt'))();

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    if (!authorization) {
      request.user = null;
      return true;
    }
    return this.jwtGuard.canActivate(context);
  }
}