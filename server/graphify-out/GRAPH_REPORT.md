# Graph Report - server  (2026-10-17)

## Corpus Check
- 122 files · ~36,702 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1141 nodes · 2464 edges · 62 communities (37 shown, 25 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `91fb4b5b`
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
- CreateCatalogItemDto
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
- Guide
- nest-cli.json
- AppointmentController
- start-local-postgres.sh
- @eslint/eslintrc
- ts-loader
- @types/bcryptjs
- @types/multer
- .log
- AuditLog
- init-db.sh
- CatalogItem
- eslint
- tsconfig-paths
- @nestjs/testing

## God Nodes (most connected - your core abstractions)
1. `AdminUser` - 81 edges
2. `CurrentUser` - 65 edges
3. `RequirePermission()` - 61 edges
4. `AuditService` - 36 edges
5. `AdminUsersService` - 24 edges
6. `assertCanListAll()` - 23 edges
7. `JwtAuthGuard` - 22 edges
8. `wantsAll()` - 22 edges
9. `compilerOptions` - 22 edges
10. `PermissionsGuard` - 20 edges

## Surprising Connections (you probably didn't know these)
- `SqliteArticle` --references--> `ArticleSection`  [EXTRACTED]
  scripts/migrate-sqlite-to-postgres.ts → src/article/entities/article.entity.ts
- `flattenPhone()` --calls--> `toEnglishDigits()`  [EXTRACTED]
  src/appointment/appointment.schema.ts → src/inquiry/inquiry.schema.ts
- `AppointmentBooking` --references--> `AppointmentSlot`  [EXTRACTED]
  src/appointment/entities/appointment-booking.entity.ts → src/appointment/entities/appointment-slot.entity.ts
- `CreateAdminDto` --references--> `AdminModuleKey`  [EXTRACTED]
  src/auth/dto/admin-user.dto.ts → src/auth/permissions.ts
- `CreateAdminDto` --references--> `PermissionAction`  [EXTRACTED]
  src/auth/dto/admin-user.dto.ts → src/auth/permissions.ts

## Import Cycles
- None detected.

## Communities (62 total, 25 thin omitted)

### Community 0 - "dependencies"
Cohesion: 0.06
Nodes (33): bcryptjs, better-sqlite3, class-transformer, class-validator, dotenv, dependencies, bcryptjs, better-sqlite3 (+25 more)

### Community 1 - "AdminUser"
Cohesion: 0.06
Nodes (67): IsObject, AdminUsersController, Body, Controller, Delete, Get, Param, Patch (+59 more)

### Community 2 - "scripts"
Cohesion: 0.05
Nodes (37): author, description, jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment (+29 more)

### Community 3 - "app.module.ts"
Cohesion: 0.07
Nodes (25): Global, AnalyticsModule, Module, AppController, Controller, Get, AppModule, Module (+17 more)

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
Nodes (7): eslint-config-prettier, devDependencies, eslint-config-prettier, @nestjs/schematics, @types/jest, @nestjs/schematics, @types/jest

### Community 8 - "CreateCatalogItemDto"
Cohesion: 0.08
Nodes (31): CatalogController, Body, Controller, Delete, Get, Param, Patch, Post (+23 more)

### Community 9 - "CreateGuideDto"
Cohesion: 0.08
Nodes (26): CreateGuideDto, ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional (+18 more)

### Community 10 - "BannerService"
Cohesion: 0.07
Nodes (31): BannerController, Body, Controller, Delete, Get, Param, Patch, Post (+23 more)

### Community 11 - "AnalyticsController"
Cohesion: 0.15
Nodes (10): AnalyticsController, Body, Controller, Get, Post, Query, UseGuards, ReportsQueryDto (+2 more)

### Community 12 - "CreateFaqDto"
Cohesion: 0.07
Nodes (31): CreateFaqDto, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min (+23 more)

### Community 13 - "Article"
Cohesion: 0.22
Nodes (8): InjectRepository, Article, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn

### Community 16 - "CreateProcessStepDto"
Cohesion: 0.07
Nodes (31): CreateProcessStepDto, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min (+23 more)

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
Cohesion: 0.07
Nodes (32): CreateTestimonialDto, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength (+24 more)

### Community 46 - "AppointmentService"
Cohesion: 0.18
Nodes (6): CreateBookingInput, AppointmentService, assertValidRange(), timeToMinutes(), todayIso(), Injectable

### Community 47 - "Guide"
Cohesion: 0.22
Nodes (8): Guide, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, GuideModule, Module

### Community 48 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 49 - "AppointmentController"
Cohesion: 0.43
Nodes (4): AppointmentController, Controller, Get, Query

### Community 55 - ".log"
Cohesion: 0.24
Nodes (6): Body, Delete, Param, Patch, Post, UseGuards

### Community 56 - "AuditLog"
Cohesion: 0.29
Nodes (6): InjectRepository, AuditLog, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn

### Community 57 - "init-db.sh"
Cohesion: 0.83
Nodes (3): run_as_password(), run_as_peer(), init-db.sh script

### Community 58 - "CatalogItem"
Cohesion: 0.18
Nodes (9): InjectRepository, InjectRepository, CatalogItem, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn (+1 more)

## Knowledge Gaps
- **145 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `name` (+140 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AdminUser` connect `AdminUser` to `CreateServiceDto`, `CreateArticleDto`, `CreatePromiseDto`, `CreateCatalogItemDto`, `migrate-sqlite-to-postgres.ts`, `BannerService`, `CreateGuideDto`, `CreateFaqDto`, `CreateStatDto`, `CreateTestimonialDto`, `CreateProcessStepDto`, `.log`, `Inquiry`?**
  _High betweenness centrality (0.155) - this node is a cross-community bridge._
- **Why does `RequirePermission()` connect `AdminUser` to `CreateServiceDto`, `CreateArticleDto`, `HistoryQueryDto`, `CreatePromiseDto`, `CreateCatalogItemDto`, `CreateGuideDto`, `BannerService`, `AnalyticsController`, `CreateFaqDto`, `CreateStatDto`, `CreateTestimonialDto`, `CreateProcessStepDto`, `AppointmentController`, `.log`, `Inquiry`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `AdminUser` to `CreateServiceDto`, `CreateArticleDto`, `CreatePromiseDto`, `CreateCatalogItemDto`, `CreateGuideDto`, `BannerService`, `CreateFaqDto`, `CreateStatDto`, `CreateTestimonialDto`, `CreateProcessStepDto`, `.log`, `Inquiry`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _145 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `AdminUser` be split into smaller, more focused modules?**
  _Cohesion score 0.05690492713393477 - nodes in this community are weakly interconnected._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.05263157894736842 - nodes in this community are weakly interconnected._