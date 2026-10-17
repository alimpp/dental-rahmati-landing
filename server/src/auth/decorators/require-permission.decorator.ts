import { SetMetadata } from '@nestjs/common';
import type { AdminModuleKey, PermissionAction } from '../permissions';

export const PERMISSION_KEY = 'admin_permission';

export const RequirePermission = (
  module: AdminModuleKey,
  action: PermissionAction,
) => SetMetadata(PERMISSION_KEY, { module, action });
