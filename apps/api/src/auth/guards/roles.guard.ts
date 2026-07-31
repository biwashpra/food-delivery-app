import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtPayload, UserRole } from '@food-delivery-app/types';
import { ROLES_KEY } from 'src/constants/key';

type RequestWithUser = Request & { user: JwtPayload };

@Injectable()
export class RolesGuard implements CanActivate {
  // Reflector is used to read the value from metadata set using roles decorator
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest<RequestWithUser>();

    if (!user || !user?.role)
      throw new UnauthorizedException('User is not authorized to access.');

    return requiredRoles.includes(user.role as UserRole);
  }
}
