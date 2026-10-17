import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUsersController } from './admin-users.controller';
import { AdminUsersService } from './admin-users.service';
import { AuditService } from './audit.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminUser } from './entities/admin-user.entity';
import { AuditLog } from './entities/audit-log.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from './guards/optional-jwt.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { HistoryController } from './history.controller';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([AdminUser, AuditLog]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret:
          config.get<string>('JWT_SECRET') ||
          'dadsar-dev-jwt-secret-change-me',
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [AuthController, AdminUsersController, HistoryController],
  providers: [
    AuthService,
    AdminUsersService,
    AuditService,
    JwtAuthGuard,
    OptionalJwtAuthGuard,
    PermissionsGuard,
  ],
  exports: [
    AuthService,
    AdminUsersService,
    AuditService,
    JwtAuthGuard,
    OptionalJwtAuthGuard,
    PermissionsGuard,
    JwtModule,
  ],
})
export class AuthModule {}
