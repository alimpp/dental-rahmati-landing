# Graph Report - server  (2026-10-26)

## Corpus Check
- 128 files · ~37,609 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1207 nodes · 2621 edges · 70 communities (39 shown, 31 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fc3fae42`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dependencies
- AdminUser
- scripts
- app.module.ts
- CreateArticleDto
- CreatePromiseDto
- exclude
- devDependencies
- ThemeService
- CreateGuideDto
- BannerService
- AnalyticsController
- CreateFaqDto
- Article
- globals
- jest
- CreateProcessStepDto
- appointment.service.ts
- AnalyticsService
- prettier
- source-map-support
- supertest
- SqliteArticle
- ts-node
- Inquiry
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
- AppointmentController
- start-local-postgres.sh
- @eslint/eslintrc
- ts-loader
- @types/bcryptjs
- @types/multer
- .log
- AdminUsersService
- init-db.sh
- jest
- Banner
- tsconfig-paths
- package.json
- @nestjs/testing
- @nestjs/common
- @nestjs/config
- @nestjs/typeorm
- pg
- rxjs
- zod
- @nestjs/schematics

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

## Communities (70 total, 31 thin omitted)

### Community 0 - "dependencies"
Cohesion: 0.10
Nodes (21): bcryptjs, better-sqlite3, class-transformer, class-validator, dotenv, dependencies, bcryptjs, better-sqlite3 (+13 more)

### Community 1 - "AdminUser"
Cohesion: 0.09
Nodes (44): AdminUsersController, Body, Controller, Delete, Get, Param, Patch, Post (+36 more)

### Community 2 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, build, db:init, db:migrate-sqlite, db:postgres, db:sync-articles, db:sync-services, format (+10 more)

### Community 3 - "app.module.ts"
Cohesion: 0.05
Nodes (33): Global, AnalyticsModule, Module, AppController, Controller, Get, AppModule, Module (+25 more)

### Community 4 - "CreateArticleDto"
Cohesion: 0.06
Nodes (34): IsDateString, ArticleController, Body, Controller, Delete, Get, Param, Patch (+26 more)

### Community 5 - "CreatePromiseDto"
Cohesion: 0.07
Nodes (30): CreatePromiseDto, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min (+22 more)

### Community 6 - "exclude"
Cohesion: 0.22
Nodes (8): exclude, extends, dist, node_modules, scripts, **/*spec.ts, test, ./tsconfig.json

### Community 7 - "devDependencies"
Cohesion: 0.29
Nodes (7): eslint, eslint-config-prettier, devDependencies, eslint, eslint-config-prettier, @types/jest, @types/jest

### Community 8 - "ThemeService"
Cohesion: 0.06
Nodes (40): IsHexColor, Length, CreateThemeDto, QueryThemeDto, ThemeColorsDto, IsBoolean, IsInt, IsObject (+32 more)

### Community 9 - "CreateGuideDto"
Cohesion: 0.08
Nodes (28): CreateGuideDto, ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional (+20 more)

### Community 10 - "BannerService"
Cohesion: 0.09
Nodes (22): BannerController, Body, Controller, Delete, Get, Param, Patch, Post (+14 more)

### Community 11 - "AnalyticsController"
Cohesion: 0.15
Nodes (10): AnalyticsController, Body, Controller, Get, Post, Query, UseGuards, ReportsQueryDto (+2 more)

### Community 12 - "CreateFaqDto"
Cohesion: 0.07
Nodes (30): CreateFaqDto, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min (+22 more)

### Community 13 - "Article"
Cohesion: 0.22
Nodes (8): InjectRepository, Article, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn

### Community 16 - "CreateProcessStepDto"
Cohesion: 0.08
Nodes (29): CreateProcessStepDto, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min (+21 more)

### Community 17 - "appointment.service.ts"
Cohesion: 0.13
Nodes (18): JoinColumn, AppointmentModule, Module, InjectRepository, AppointmentBooking, Column, CreateDateColumn, Entity (+10 more)

### Community 22 - "SqliteArticle"
Cohesion: 0.29
Nodes (7): SqliteArticle, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn

### Community 24 - "Inquiry"
Cohesion: 0.07
Nodes (26): bookingFieldErrors, createBookingSchema, flattenPhone(), Inquiry, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn (+18 more)

### Community 26 - "BulkCreateSlotsDto"
Cohesion: 0.16
Nodes (18): IsUUID, BulkCreateSlotsDto, CreateBookingDto, CreateSlotDto, SlotRangeDto, ArrayMaxSize, ArrayMinSize, IsArray (+10 more)

### Community 32 - "CreateServiceDto"
Cohesion: 0.05
Nodes (42): CreateServiceDto, ServiceSectionDto, ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsIn, IsInt (+34 more)

### Community 34 - "compilerOptions"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 37 - "HistoryQueryDto"
Cohesion: 0.13
Nodes (13): HistoryQueryDto, IsInt, IsOptional, IsString, Max, MaxLength, Min, Type (+5 more)

### Community 38 - "analytics.module.ts"
Cohesion: 0.12
Nodes (17): PAGE_LABELS, TrackViewDto, IsNotEmpty, IsString, MaxLength, PageView, Column, Entity (+9 more)

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
Cohesion: 0.08
Nodes (28): CreateStatDto, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min (+20 more)

### Community 45 - "CreateTestimonialDto"
Cohesion: 0.07
Nodes (32): CreateTestimonialDto, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength (+24 more)

### Community 46 - "AppointmentService"
Cohesion: 0.18
Nodes (6): CreateBookingInput, AppointmentService, assertValidRange(), timeToMinutes(), todayIso(), Injectable

### Community 47 - "CreatePortfolioItemDto"
Cohesion: 0.06
Nodes (39): CreatePortfolioItemDto, PortfolioGalleryImageDto, ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsInt, IsNotEmpty (+31 more)

### Community 48 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 49 - "AppointmentController"
Cohesion: 0.43
Nodes (4): AppointmentController, Controller, Get, Query

### Community 55 - ".log"
Cohesion: 0.24
Nodes (6): Body, Delete, Param, Patch, Post, UseGuards

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
Cohesion: 0.22
Nodes (8): BannerModule, Module, Banner, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn

### Community 61 - "package.json"
Cohesion: 0.29
Nodes (6): author, description, license, name, private, version

## Knowledge Gaps
- **144 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `name` (+139 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AdminUser` connect `AdminUser` to `CreateServiceDto`, `CreateArticleDto`, `CreatePromiseDto`, `ThemeService`, `migrate-sqlite-to-postgres.ts`, `BannerService`, `CreateGuideDto`, `CreateFaqDto`, `CreateStatDto`, `CreateTestimonialDto`, `CreatePortfolioItemDto`, `CreateProcessStepDto`, `.log`, `AdminUsersService`, `Inquiry`?**
  _High betweenness centrality (0.157) - this node is a cross-community bridge._
- **Why does `RequirePermission()` connect `AdminUser` to `CreateServiceDto`, `CreateArticleDto`, `HistoryQueryDto`, `CreatePromiseDto`, `ThemeService`, `CreateGuideDto`, `BannerService`, `AnalyticsController`, `CreateFaqDto`, `CreateStatDto`, `CreateTestimonialDto`, `CreatePortfolioItemDto`, `CreateProcessStepDto`, `AppointmentController`, `.log`, `Inquiry`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `AdminUser` to `CreateServiceDto`, `CreateArticleDto`, `CreatePromiseDto`, `ThemeService`, `CreateGuideDto`, `BannerService`, `CreateFaqDto`, `CreateStatDto`, `CreateTestimonialDto`, `CreatePortfolioItemDto`, `CreateProcessStepDto`, `.log`, `AdminUsersService`, `Inquiry`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _144 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `AdminUser` be split into smaller, more focused modules?**
  _Cohesion score 0.08882655446470314 - nodes in this community are weakly interconnected._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._