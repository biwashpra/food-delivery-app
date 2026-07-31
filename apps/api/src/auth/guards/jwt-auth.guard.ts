import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import type { JwtPayload } from '@food-delivery-app/types';

type RequestWithUser = Request & { user: JwtPayload };

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    // header format: "Bearer token"
    const authHeader = request.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('Token not provided.');

    const token = authHeader.split(' ')[1];
    if (!token) throw new UnauthorizedException('Invalid token.');

    try {
      const payload = this.jwtService.verify<JwtPayload>(token);

      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
}
