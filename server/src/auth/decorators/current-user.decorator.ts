import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AdminUser } from '../entities/admin-user.entity';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AdminUser | undefined => {
    const request = ctx.switchToHttp().getRequest<{ user?: AdminUser }>();
    return request.user;
  },
);
