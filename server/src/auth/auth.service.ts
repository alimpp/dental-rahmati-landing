import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AdminUsersService } from './admin-users.service';
import { AuditService } from './audit.service';
import type { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminUsersService: AdminUsersService,
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.adminUsersService.findByUsername(dto.username);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('نام کاربری یا رمز عبور نادرست است');
    }
    const matches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!matches) {
      throw new UnauthorizedException('نام کاربری یا رمز عبور نادرست است');
    }

    const token = await this.jwtService.signAsync({
      sub: user.id,
      username: user.username,
      isSuperAdmin: user.isSuperAdmin,
    });

    await this.auditService.log({
      actor: user,
      module: 'admins',
      action: 'login',
      entityId: user.id,
      summary: `ورود ${user.displayName}`,
    });

    return {
      token,
      user: this.adminUsersService.toPublic(user),
    };
  }
}
