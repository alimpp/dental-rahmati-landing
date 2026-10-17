import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { AdminUsersService } from '../admin-users.service';
import { extractBearerToken } from './jwt-auth.guard';

@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminUsersService: AdminUsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = extractBearerToken(request);
    if (!token) return true;

    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string }>(token);
      const user = await this.adminUsersService.findById(payload.sub);
      if (user?.isActive) {
        (request as Request & { user: typeof user }).user = user;
      }
    } catch {
      return true;
    }
    return true;
  }
}
