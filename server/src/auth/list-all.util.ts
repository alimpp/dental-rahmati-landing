import {
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import type { AdminUser } from './entities/admin-user.entity';
import {
  hasPermission,
  type AdminModuleKey,
} from './permissions';

export function wantsAll(all?: string): boolean {
  return all === 'true' || all === '1';
}

export function assertCanListAll(
  user: AdminUser | undefined,
  module: AdminModuleKey,
  all?: string,
): void {
  if (!wantsAll(all)) return;
  if (!user) {
    throw new UnauthorizedException('برای دیدن همه رکوردها وارد شوید');
  }
  if (!hasPermission(user, module, 'view')) {
    throw new ForbiddenException('دسترسی مشاهده این بخش را ندارید');
  }
}
