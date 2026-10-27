# Graph Report - server  (2026-10-27)

## Corpus Check
- 130 files · ~42,220 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1221 nodes · 2648 edges · 73 communities (44 shown, 29 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e6d0596b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dependencies
- AdminUser
- scripts
- UploadService
- CreateArticleDto
- CreatePromiseDto
- exclude
- devDependencies
- .log
- CreateGuideDto
- BannerService
- AnalyticsService
- CreateFaqDto
- Article
- globals
- jest
- CreateProcessStepDto
- appointment.service.ts
- app.module.ts
- prettier
- source-map-support
- supertest
- SqliteArticle
- ts-node
- .remove
- @types/express
- BulkCreateSlotsDto
- @types/pg
- @types/supertest
- typescript
- typescript-eslint
- CreateServiceDto
- eslint-plugin-prettier
- compilerOptions
- @types/node
- @eslint/js
- HistoryQueryDto
- analytics.module.ts
- README.md
- include
- migrate-sqlite-to-postgres.ts
- @nestjs/cli
- ts-jest
- CreateStatDto
- CreateTestimonialDto
- AppointmentService
- CreatePortfolioItemDto
- nest-cli.json
- .book
- start-local-postgres.sh
- @eslint/eslintrc
- ts-loader
- @types/bcryptjs
- @types/multer
- AppointmentController
- AdminUsersService
- init-db.sh
- jest
- Banner
- package.json
- دیپلوی لیارا — کلینیک امیر رحمتی
- @nestjs/testing
- class-validator
- AppController
- @nestjs/typeorm
- @nestjs/config
- rxjs
- @types/jest
- @nestjs/schematics
- Inquiry
- Service
- @nestjs/platform-express

## God Nodes (most connected - your core abstractions)
1. `AdminUser` - 86 edges
2. `CurrentUser` - 70 edges
3. `RequirePermission()` - 65 edges
4. `AuditService` - 38 edges
5. `assertCanListAll()` - 25 edges
6. `AdminUsersService` - 24 edges
7. `wantsAll()` - 24 edges
8. `JwtAuthGuard` - 23 edges
9. `compilerOptions` - 22 edges
10. `PermissionsGuard` - 21 edges

## Surprising Connections (you probably didn't know these)
- `SqliteArticle` --references--> `ArticleSection`  [EXTRACTED]
  scripts/migrate-sqlite-to-postgres.ts → src/article/entities/article.entity.ts
- `AdminUser` --references--> `AdminPermissions`  [EXTRACTED]
  src/auth/entities/admin-user.entity.ts → src/auth/permissions.ts
- `flattenPhone()` --calls--> `toEnglishDigits()`  [EXTRACTED]
  src/appointment/appointment.schema.ts → src/inquiry/inquiry.schema.ts
- `AppointmentBooking` --references--> `AppointmentSlot`  [EXTRACTED]
  src/appointment/entities/appointment-booking.entity.ts → src/appointment/entities/appointment-slot.entity.ts
- `CreateAdminDto` --references--> `AdminModuleKey`  [EXTRACTED]
  src/auth/dto/admin-user.dto.ts → src/auth/permissions.ts

## Import Cycles
- None detected.

## Communities (73 total, 29 thin omitted)

### Community 0 - "dependencies"
Cohesion: 0.09
Nodes (23): bcryptjs, better-sqlite3, class-transformer, dotenv, @nestjs/common, @nestjs/core, @nestjs/jwt, dependencies (+15 more)

### Community 1 - "AdminUser"
Cohesion: 0.09
Nodes (42): Body, Post, AdminUsersController, Controller, Delete, Get, Param, Patch (+34 more)

### Community 2 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, build, db:init, db:migrate-sqlite, db:postgres, db:sync-articles, db:sync-services, format (+10 more)

### Community 3 - "UploadService"
Cohesion: 0.13
Nodes (13): Controller, Post, Query, UseGuards, UploadController, Module, UploadModule, FILE_TYPES (+5 more)

### Community 4 - "CreateArticleDto"
Cohesion: 0.06
Nodes (35): IsDateString, ArticleController, Body, Controller, Delete, Get, Param, Patch (+27 more)

### Community 5 - "CreatePromiseDto"
Cohesion: 0.07
Nodes (31): CreatePromiseDto, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min (+23 more)

### Community 6 - "exclude"
Cohesion: 0.22
Nodes (8): exclude, extends, dist, node_modules, scripts, **/*spec.ts, test, ./tsconfig.json

### Community 7 - "devDependencies"
Cohesion: 0.29
Nodes (7): eslint, eslint-config-prettier, devDependencies, eslint, eslint-config-prettier, tsconfig-paths, tsconfig-paths

### Community 8 - ".log"
Cohesion: 0.06
Nodes (42): IsHexColor, Length, Body, Post, CreateThemeDto, QueryThemeDto, ThemeColorsDto, IsBoolean (+34 more)

### Community 9 - "CreateGuideDto"
Cohesion: 0.06
Nodes (35): CreateGuideDto, ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional (+27 more)

### Community 10 - "BannerService"
Cohesion: 0.09
Nodes (23): BannerController, Body, Controller, Delete, Get, Param, Patch, Post (+15 more)

### Community 11 - "AnalyticsService"
Cohesion: 0.12
Nodes (12): AnalyticsController, Body, Controller, Get, Post, Query, UseGuards, AnalyticsService (+4 more)

### Community 12 - "CreateFaqDto"
Cohesion: 0.08
Nodes (29): CreateFaqDto, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min (+21 more)

### Community 13 - "Article"
Cohesion: 0.22
Nodes (8): InjectRepository, Article, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn

### Community 16 - "CreateProcessStepDto"
Cohesion: 0.08
Nodes (28): CreateProcessStepDto, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min (+20 more)

### Community 17 - "appointment.service.ts"
Cohesion: 0.13
Nodes (18): JoinColumn, AppointmentModule, Module, InjectRepository, AppointmentBooking, Column, CreateDateColumn, Entity (+10 more)

### Community 18 - "app.module.ts"
Cohesion: 0.09
Nodes (19): Global, AnalyticsModule, Module, AppModule, Module, AuthModule, Module, BannerModule (+11 more)

### Community 22 - "SqliteArticle"
Cohesion: 0.29
Nodes (7): SqliteArticle, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn

### Community 24 - ".remove"
Cohesion: 0.08
Nodes (19): bookingFieldErrors, createBookingSchema, flattenPhone(), InquiryController, Body, Controller, Delete, Get (+11 more)

### Community 26 - "BulkCreateSlotsDto"
Cohesion: 0.16
Nodes (18): IsUUID, BulkCreateSlotsDto, CreateBookingDto, CreateSlotDto, SlotRangeDto, ArrayMaxSize, ArrayMinSize, IsArray (+10 more)

### Community 32 - "CreateServiceDto"
Cohesion: 0.07
Nodes (31): CreateServiceDto, ServiceSectionDto, ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsIn, IsInt (+23 more)

### Community 34 - "compilerOptions"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 37 - "HistoryQueryDto"
Cohesion: 0.13
Nodes (13): HistoryQueryDto, IsInt, IsOptional, IsString, Max, MaxLength, Min, Type (+5 more)

### Community 38 - "analytics.module.ts"
Cohesion: 0.14
Nodes (13): PAGE_LABELS, TrackViewDto, IsNotEmpty, IsString, MaxLength, PageView, Column, Entity (+5 more)

### Community 39 - "README.md"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 40 - "include"
Cohesion: 0.12
Nodes (15): compilerOptions, module, moduleResolution, noEmit, extends, include, scripts/migrate-sqlite-to-postgres.ts, scripts/sync-article-seed.ts (+7 more)

### Community 41 - "migrate-sqlite-to-postgres.ts"
Cohesion: 0.23
Nodes (11): copies, copyTable(), main(), makePostgres(), makeSqlite(), postgresEntities, sqliteEntities, sqliteFile() (+3 more)

### Community 44 - "CreateStatDto"
Cohesion: 0.07
Nodes (31): CreateStatDto, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min (+23 more)

### Community 45 - "CreateTestimonialDto"
Cohesion: 0.08
Nodes (31): CreateTestimonialDto, PublicSubmitTestimonialDto, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Max (+23 more)

### Community 46 - "AppointmentService"
Cohesion: 0.27
Nodes (4): AppointmentService, assertValidRange(), timeToMinutes(), Injectable

### Community 47 - "CreatePortfolioItemDto"
Cohesion: 0.06
Nodes (38): CreatePortfolioItemDto, PortfolioGalleryImageDto, ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsInt, IsNotEmpty (+30 more)

### Community 48 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 49 - ".book"
Cohesion: 0.28
Nodes (3): Query, CreateBookingInput, todayIso()

### Community 55 - "AppointmentController"
Cohesion: 0.20
Nodes (7): AppointmentController, Controller, Delete, Get, Param, Patch, UseGuards

### Community 56 - "AdminUsersService"
Cohesion: 0.07
Nodes (34): AdminUsersService, PublicAdmin, Injectable, InjectRepository, AuthController, Body, Controller, Get (+26 more)

### Community 57 - "init-db.sh"
Cohesion: 0.83
Nodes (3): run_as_password(), run_as_peer(), init-db.sh script

### Community 58 - "jest"
Cohesion: 0.15
Nodes (13): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+5 more)

### Community 59 - "Banner"
Cohesion: 0.25
Nodes (7): InjectRepository, Banner, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn

### Community 60 - "package.json"
Cohesion: 0.22
Nodes (8): author, description, engines, node, license, name, private, version

### Community 61 - "دیپلوی لیارا — کلینیک امیر رحمتی"
Cohesion: 0.29
Nodes (6): دیپلوی لیارا — کلینیک امیر رحمتی, نکات, ۱) دیتابیس, ۲) API (`server/`), ۳) سایت (`client/`), ۴) دامنه

### Community 64 - "AppController"
Cohesion: 0.27
Nodes (5): AppController, Controller, Get, AppService, Injectable

### Community 70 - "Inquiry"
Cohesion: 0.27
Nodes (7): Inquiry, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, InquiryModule, Module

### Community 72 - "Service"
Cohesion: 0.29
Nodes (7): Service, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn

## Knowledge Gaps
- **150 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `name` (+145 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AdminUser` connect `AdminUser` to `CreateServiceDto`, `CreateArticleDto`, `CreatePromiseDto`, `.log`, `migrate-sqlite-to-postgres.ts`, `BannerService`, `CreateGuideDto`, `CreateFaqDto`, `CreateStatDto`, `CreateTestimonialDto`, `CreatePortfolioItemDto`, `CreateProcessStepDto`, `AppointmentController`, `AdminUsersService`, `.remove`?**
  _High betweenness centrality (0.147) - this node is a cross-community bridge._
- **Why does `RequirePermission()` connect `AdminUser` to `CreateServiceDto`, `CreateArticleDto`, `HistoryQueryDto`, `CreatePromiseDto`, `.log`, `CreateGuideDto`, `BannerService`, `AnalyticsService`, `CreateFaqDto`, `CreateStatDto`, `CreateTestimonialDto`, `CreatePortfolioItemDto`, `CreateProcessStepDto`, `AppointmentController`, `.remove`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `AdminUser` to `CreateServiceDto`, `CreateArticleDto`, `CreatePromiseDto`, `.log`, `CreateGuideDto`, `BannerService`, `CreateFaqDto`, `CreateStatDto`, `CreateTestimonialDto`, `CreatePortfolioItemDto`, `CreateProcessStepDto`, `AppointmentController`, `AdminUsersService`, `.remove`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _150 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `AdminUser` be split into smaller, more focused modules?**
  _Cohesion score 0.09313358302122347 - nodes in this community are weakly interconnected._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._