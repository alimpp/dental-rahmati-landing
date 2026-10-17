import { Body, Controller, Get, Query, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { AnalyticsService } from './analytics.service';
import { ReportsQueryDto } from './dto/reports-query.dto';
import { TrackViewDto } from './dto/track-view.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('hit')
  async hit(@Body() dto: TrackViewDto) {
    const data = await this.analyticsService.track(dto);
    return { success: true, message: '', data };
  }

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  async dashboard() {
    const data = await this.analyticsService.dashboard();
    return { success: true, message: '', data };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('reports', 'view')
  @Get('reports')
  async reports(@Query() query: ReportsQueryDto) {
    const data = await this.analyticsService.reports(query.range || 'daily');
    return { success: true, message: '', data };
  }
}
