import { Body, Controller, Get, Post } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import type { AdminUser } from './entities/admin-user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminUsersService } from './admin-users.service';
import {
  ACTION_LABELS,
  ADMIN_MODULES,
  MODULE_LABELS,
  PERMISSION_ACTIONS,
} from './permissions';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly adminUsersService: AdminUsersService,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const data = await this.authService.login(dto);
    return {
      success: true,
      message: 'ورود موفق',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: AdminUser) {
    return {
      success: true,
      message: '',
      data: this.adminUsersService.toPublic(user),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('permission-schema')
  permissionSchema() {
    return {
      success: true,
      message: '',
      data: {
        modules: ADMIN_MODULES.map((key) => ({
          key,
          label: MODULE_LABELS[key],
        })),
        actions: PERMISSION_ACTIONS.map((key) => ({
          key,
          label: ACTION_LABELS[key],
        })),
      },
    };
  }
}
