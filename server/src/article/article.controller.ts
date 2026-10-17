import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuditService } from '../auth/audit.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import type { AdminUser } from '../auth/entities/admin-user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { assertCanListAll, wantsAll } from '../auth/list-all.util';
import { ArticleService } from './article.service';
import {
  ArticleListQueryDto,
  CreateArticleDto,
  UpdateArticleDto,
} from './dto/article.dto';

@Controller('articles')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly auditService: AuditService,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findAll(
    @Query() query: ArticleListQueryDto,
    @CurrentUser() user?: AdminUser,
  ) {
    assertCanListAll(user, 'articles', query.all);
    const data = await this.articleService.findPaged(query, !wantsAll(query.all));
    return {
      success: true,
      message: '',
      data,
    };
  }

  @Get('featured')
  async findFeatured(
    @Query('limit', new DefaultValuePipe(4), ParseIntPipe) limit: number,
  ) {
    const data = await this.articleService.findFeatured(limit);
    return {
      success: true,
      message: '',
      data,
    };
  }

  @Get('categories')
  async findCategories() {
    const data = await this.articleService.findCategories(true);
    return {
      success: true,
      message: '',
      data,
    };
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const data = await this.articleService.findBySlug(slug);
    return {
      success: true,
      message: '',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.articleService.findOne(id);
    return {
      success: true,
      message: '',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('articles', 'create')
  @Post()
  async create(@Body() dto: CreateArticleDto, @CurrentUser() actor: AdminUser) {
    const data = await this.articleService.create(dto);
    await this.auditService.log({
      actor,
      module: 'articles',
      action: 'create',
      entityId: data.id,
      summary: `ایجاد مقاله «${data.title}»`,
    });
    return {
      success: true,
      message: 'مقاله با موفقیت ایجاد شد',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('articles', 'edit')
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateArticleDto,
    @CurrentUser() actor: AdminUser,
  ) {
    const data = await this.articleService.update(id, dto);
    await this.auditService.log({
      actor,
      module: 'articles',
      action: 'update',
      entityId: id,
      summary: `ویرایش مقاله «${data.title}»`,
    });
    return {
      success: true,
      message: 'مقاله به‌روزرسانی شد',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('articles', 'delete')
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() actor: AdminUser,
  ) {
    const existing = await this.articleService.findOne(id);
    await this.articleService.remove(id);
    await this.auditService.log({
      actor,
      module: 'articles',
      action: 'delete',
      entityId: id,
      summary: `حذف مقاله «${existing.title}»`,
    });
    return {
      success: true,
      message: 'مقاله حذف شد',
      data: null,
    };
  }
}
