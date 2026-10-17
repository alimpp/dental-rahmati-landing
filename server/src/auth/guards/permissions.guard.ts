import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { PERMISSION_KEY } from '../decorators/require-permission.decorator';
import type { AdminUser } from '../entities/admin-user.entity';
import {
  hasPermission,
  type AdminModuleKey,
  type PermissionAction,
} from '../permissions';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const meta = this.reflector.getAllAndOverride<{
      module: AdminModuleKey;
      action: PermissionAction;
    }>(PERMISSION_KEY, [context.getHandler(), context.getClass()]);

    if (!meta) return true;

    const request = context.switchToHttp().getRequest<Request & { user?: AdminUser }>();
    if (!request.user) {
      throw new UnauthorizedException('وارد شوید');
    }
    if (!hasPermission(request.user, meta.module, meta.action)) {
      throw new ForbiddenException('دسترسی این عملیات را ندارید');
    }
    return true;
  }
}
