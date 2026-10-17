import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import type { CreateAdminDto, UpdateAdminDto } from './dto/admin-user.dto';
import { AdminUser } from './entities/admin-user.entity';
import {
  ADMIN_MODULES,
  emptyPermissions,
  type AdminPermissions,
  type PermissionAction,
} from './permissions';

export type PublicAdmin = Omit<AdminUser, 'passwordHash'>;

@Injectable()
export class AdminUsersService implements OnModuleInit {
  constructor(
    @InjectRepository(AdminUser)
    private readonly adminRepository: Repository<AdminUser>,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    await this.seedSuperAdmin();
  }

  private sanitizePermissions(
    raw?: AdminPermissions | null,
  ): AdminPermissions {
    const next = emptyPermissions();
    if (!raw) return next;
    for (const key of ADMIN_MODULES) {
      const actions = raw[key];
      if (!Array.isArray(actions)) continue;
      next[key] = actions.filter((action): action is PermissionAction =>
        ['view', 'create', 'edit', 'delete'].includes(action),
      );
    }
    return next;
  }

  toPublic(user: AdminUser): PublicAdmin {
    const { passwordHash: _passwordHash, ...rest } = user;
    return rest;
  }

  async findById(id: string) {
    return this.adminRepository.findOne({ where: { id } });
  }

  async findByUsername(username: string) {
    return this.adminRepository.findOne({
      where: { username: username.trim().toLowerCase() },
    });
  }

  async findAll() {
    const users = await this.adminRepository.find({
      order: { isSuperAdmin: 'DESC', createdAt: 'ASC' },
    });
    return users.map((user) => this.toPublic(user));
  }

  async create(dto: CreateAdminDto, actorIsSuper: boolean) {
    if (!actorIsSuper) {
      throw new ForbiddenException('فقط سوپر ادمین می‌تواند ادمین بسازد');
    }
    const username = dto.username.trim().toLowerCase();
    const exists = await this.findByUsername(username);
    if (exists) {
      throw new BadRequestException('این نام کاربری قبلاً ثبت شده است');
    }
    const user = this.adminRepository.create({
      username,
      displayName: dto.displayName.trim(),
      passwordHash: await bcrypt.hash(dto.password, 10),
      isSuperAdmin: false,
      isActive: dto.isActive !== false,
      permissions: this.sanitizePermissions(dto.permissions),
    });
    const saved = await this.adminRepository.save(user);
    return this.toPublic(saved);
  }

  async update(id: string, dto: UpdateAdminDto, actorIsSuper: boolean) {
    if (!actorIsSuper) {
      throw new ForbiddenException('فقط سوپر ادمین می‌تواند ادمین را ویرایش کند');
    }
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('ادمین یافت نشد');
    if (user.isSuperAdmin) {
      if (dto.isActive === false) {
        throw new ForbiddenException('سوپر ادمین را نمی‌توان غیرفعال کرد');
      }
      if (dto.permissions) {
        throw new ForbiddenException('دسترسی سوپر ادمین قابل محدود کردن نیست');
      }
    }
    if (dto.displayName) user.displayName = dto.displayName.trim();
    if (dto.password) user.passwordHash = await bcrypt.hash(dto.password, 10);
    if (dto.permissions && !user.isSuperAdmin) {
      user.permissions = this.sanitizePermissions(dto.permissions);
    }
    if (typeof dto.isActive === 'boolean' && !user.isSuperAdmin) {
      user.isActive = dto.isActive;
    }
    const saved = await this.adminRepository.save(user);
    return this.toPublic(saved);
  }

  async remove(id: string, actorIsSuper: boolean) {
    if (!actorIsSuper) {
      throw new ForbiddenException('فقط سوپر ادمین می‌تواند ادمین را حذف کند');
    }
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('ادمین یافت نشد');
    if (user.isSuperAdmin) {
      throw new ForbiddenException('سوپر ادمین قابل حذف نیست');
    }
    await this.adminRepository.remove(user);
  }

  private async seedSuperAdmin() {
    const username = (
      this.config.get<string>('SUPERADMIN_USERNAME') || 'superadmin'
    )
      .trim()
      .toLowerCase();
    const password =
      this.config.get<string>('SUPERADMIN_PASSWORD') || 'Dadsar@1405';
    const displayName =
      this.config.get<string>('SUPERADMIN_NAME') || 'سوپر ادمین';

    const existing = await this.findByUsername(username);
    if (existing) {
      existing.isSuperAdmin = true;
      existing.isActive = true;
      existing.displayName = displayName;
      await this.adminRepository.save(existing);
      return;
    }

    const user = this.adminRepository.create({
      username,
      displayName,
      passwordHash: await bcrypt.hash(password, 10),
      isSuperAdmin: true,
      isActive: true,
      permissions: emptyPermissions(),
    });
    await this.adminRepository.save(user);
  }
}
