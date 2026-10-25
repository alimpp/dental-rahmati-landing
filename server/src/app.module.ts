import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BannerModule } from './banner/banner.module';
import { ServiceModule } from './service/service.module';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';
import { InquiryModule } from './inquiry/inquiry.module';
import { CatalogModule } from './catalog/catalog.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { UploadModule } from './upload/upload.module';
import { StatModule } from './stat/stat.module';
import { ProcessStepModule } from './process-step/process-step.module';
import { TestimonialModule } from './testimonial/testimonial.module';
import { FaqModule } from './faq/faq.module';
import { PromiseModule } from './promise/promise.module';
import { GuideModule } from './guide/guide.module';
import { AppointmentModule } from './appointment/appointment.module';
import { ThemeModule } from './theme/theme.module';
import { PortfolioModule } from './portfolio/portfolio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.getOrThrow<string>('DB_HOST'),
        port: Number(config.getOrThrow<string>('DB_PORT')),
        username: config.getOrThrow<string>('DB_USERNAME'),
        password: config.getOrThrow<string>('DB_PASSWORD'),
        database: config.getOrThrow<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: config.get<string>('DB_SYNCHRONIZE') !== 'false',
        logging: config.get<string>('DB_LOGGING') === 'true',
      }),
    }),
    AuthModule,
    BannerModule,
    ServiceModule,
    ArticleModule,
    InquiryModule,
    CatalogModule,
    AnalyticsModule,
    UploadModule,
    StatModule,
    PromiseModule,
    ProcessStepModule,
    TestimonialModule,
    FaqModule,
    GuideModule,
    AppointmentModule,
    ThemeModule,
    PortfolioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
