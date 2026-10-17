import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from '../article/entities/article.entity';
import { Banner } from '../banner/entities/banner.entity';
import { CatalogItem } from '../catalog/entities/catalog-item.entity';
import { Guide } from '../guide/entities/guide.entity';
import { Inquiry } from '../inquiry/entities/inquiry.entity';
import { Service } from '../service/entities/service.entity';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { PageView } from './entities/page-view.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PageView,
      Article,
      Banner,
      Service,
      CatalogItem,
      Guide,
      Inquiry,
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
