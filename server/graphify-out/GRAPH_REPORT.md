# Graph Report - server  (2026-10-27)

## Corpus Check
- 130 files · ~42,361 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1222 nodes · 2650 edges · 66 communities (37 shown, 29 thin omitted)
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
- app.module.ts
- CreateArticleDto
- CreatePromiseDto
- exclude
- devDependencies
- ThemeService
- CreateGuideDto
- BannerService
- analytics.module.ts
- CreateFaqDto
- inquiry.schema.ts
- globals
- jest
- CreateProcessStepDto
- AppointmentService
- AuditLog
- prettier
- source-map-support
- supertest
- SqliteArticle
- ts-node
- .remove
- @types/express
- CreateInquiryInput
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
- zod
- README.md
- include
- migrate-sqlite-to-postgres.ts
- @nestjs/cli
- ts-jest
- CreateStatDto
- CreateTestimonialDto
- CreatePortfolioItemDto
- nest-cli.json
- start-local-postgres.sh
- @eslint/eslintrc
- ts-loader
- @types/bcryptjs
- @types/multer
- .log
- init-db.sh
- jest
- package.json
- دیپلوی لیارا — کلینیک امیر رحمتی
- @nestjs/testing
- @nestjs/typeorm
- @nestjs/config
- rxjs
- @types/jest
- @nestjs/schematics
- Inquiry
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
- `CreateAdminDto` --references--> `AdminModuleKey`  [EXTRACTED]
  src/auth/dto/admin-user.dto.ts → src/auth/permissions.ts
- `CreateAdminDto` --references--> `PermissionAction`  [EXTRACTED]
  src/auth/dto/admin-user.dto.ts → src/auth/permissions.ts
- `UpdateAdminDto` --references--> `AdminModuleKey`  [EXTRACTED]
  src/auth/dto/admin-user.dto.ts → src/auth/permissions.ts
- `UpdateAdminDto` --references--> `PermissionAction`  [EXTRACTED]
  src/auth/dto/admin-user.dto.ts → src/auth/permissions.ts

## Import Cycles
- None detected.

## Communities (66 total, 29 thin omitted)

### Community 0 - "dependencies"
Cohesion: 0.09
Nodes (23): bcryptjs, better-sqlite3, class-transformer, class-validator, dotenv, @nestjs/common, @nestjs/core, @nestjs/jwt (+15 more)

### Community 1 - "AdminUser"
Cohesion: 0.11
Nodes (41): PublicAdmin, AuditService, Injectable, CurrentUser, RequirePermission(), LoginDto, IsNotEmpty, IsString (+33 more)

### Community 2 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, build, db:init, db:migrate-sqlite, db:postgres, db:sync-articles, db:sync-services, format (+10 more)

### Community 3 - "app.module.ts"
Cohesion: 0.05
Nodes (35): Global, AppController, Controller, Get, AppModule, Module, AppService, Injectable (+27 more)

### Community 4 - "CreateArticleDto"
Cohesion: 0.05
Nodes (45): IsDateString, ArticleController, Body, Controller, Delete, Get, Param, Patch (+37 more)

### Community 5 - "CreatePromiseDto"
Cohesion: 0.07
Nodes (31): CreatePromiseDto, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min (+23 more)

### Community 6 - "exclude"
Cohesion: 0.22
Nodes (8): exclude, extends, dist, node_modules, scripts, **/*spec.ts, test, ./tsconfig.json

### Community 7 - "devDependencies"
Cohesion: 0.29
Nodes (7): eslint, eslint-config-prettier, devDependencies, eslint, eslint-config-prettier, tsconfig-paths, tsconfig-paths

### Community 8 - "ThemeService"
Cohesion: 0.06
Nodes (40): IsHexColor, Length, CreateThemeDto, QueryThemeDto, ThemeColorsDto, IsBoolean, IsInt, IsObject (+32 more)

### Community 9 - "CreateGuideDto"
Cohesion: 0.09
Nodes (26): CreateGuideDto, ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional (+18 more)

### Community 10 - "BannerService"
Cohesion: 0.07
Nodes (29): BannerController, Body, Controller, Delete, Get, Param, Patch, Post (+21 more)

### Community 11 - "analytics.module.ts"
Cohesion: 0.05
Nodes (35): AnalyticsController, Body, Controller, Get, Post, Query, UseGuards, AnalyticsModule (+27 more)

### Community 12 - "CreateFaqDto"
Cohesion: 0.07
Nodes (30): CreateFaqDto, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min (+22 more)

### Community 13 - "inquiry.schema.ts"
Cohesion: 0.21
Nodes (7): bookingFieldErrors, createBookingSchema, flattenPhone(), createInquirySchema, flattenPhone(), inquiryFieldErrors, toEnglishDigits()

### Community 16 - "CreateProcessStepDto"
Cohesion: 0.07
Nodes (30): CreateProcessStepDto, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min (+22 more)

### Community 17 - "AppointmentService"
Cohesion: 0.05
Nodes (50): IsUUID, JoinColumn, AppointmentController, Body, Controller, Delete, Get, Param (+42 more)

### Community 18 - "AuditLog"
Cohesion: 0.29
Nodes (6): InjectRepository, AuditLog, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn

### Community 22 - "SqliteArticle"
Cohesion: 0.29
Nodes (7): SqliteArticle, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn

### Community 24 - ".remove"
Cohesion: 0.20
Nodes (8): InquiryController, Controller, Delete, Get, Param, UseGuards, InquiryService, Injectable

### Community 26 - "CreateInquiryInput"
Cohesion: 0.50
Nodes (3): Body, Post, CreateInquiryInput

### Community 32 - "CreateServiceDto"
Cohesion: 0.05
Nodes (41): CreateServiceDto, ServiceSectionDto, ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsIn, IsInt (+33 more)

### Community 34 - "compilerOptions"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 37 - "HistoryQueryDto"
Cohesion: 0.13
Nodes (13): HistoryQueryDto, IsInt, IsOptional, IsString, Max, MaxLength, Min, Type (+5 more)

### Community 39 - "README.md"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 40 - "include"
Cohesion: 0.12
Nodes (15): compilerOptions, module, moduleResolution, noEmit, extends, include, scripts/migrate-sqlite-to-postgres.ts, scripts/sync-article-seed.ts (+7 more)

### Community 41 - "migrate-sqlite-to-postgres.ts"
Cohesion: 0.31
Nodes (9): copies, copyTable(), main(), makePostgres(), makeSqlite(), postgresEntities, sqliteEntities, sqliteFile() (+1 more)

### Community 44 - "CreateStatDto"
Cohesion: 0.08
Nodes (29): CreateStatDto, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min (+21 more)

### Community 45 - "CreateTestimonialDto"
Cohesion: 0.07
Nodes (32): CreateTestimonialDto, PublicSubmitTestimonialDto, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Max (+24 more)

### Community 47 - "CreatePortfolioItemDto"
Cohesion: 0.06
Nodes (38): CreatePortfolioItemDto, PortfolioGalleryImageDto, ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsInt, IsNotEmpty (+30 more)

### Community 48 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 56 - ".log"
Cohesion: 0.06
Nodes (30): AdminUsersController, Body, Controller, Delete, Get, Param, Patch, Post (+22 more)

### Community 57 - "init-db.sh"
Cohesion: 0.83
Nodes (3): run_as_password(), run_as_peer(), init-db.sh script

### Community 58 - "jest"
Cohesion: 0.15
Nodes (13): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+5 more)

### Community 60 - "package.json"
Cohesion: 0.22
Nodes (8): author, description, engines, node, license, name, private, version

### Community 61 - "دیپلوی لیارا — کلینیک امیر رحمتی"
Cohesion: 0.29
Nodes (6): دیپلوی لیارا — کلینیک امیر رحمتی, نکات, ۱) دیتابیس, ۲) API (`server/`), ۳) سایت (`client/`), ۴) دامنه

### Community 70 - "Inquiry"
Cohesion: 0.27
Nodes (6): Inquiry, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, InjectRepository

## Knowledge Gaps
- **150 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `name` (+145 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AdminUser` connect `AdminUser` to `CreateServiceDto`, `CreateArticleDto`, `CreatePromiseDto`, `ThemeService`, `migrate-sqlite-to-postgres.ts`, `BannerService`, `CreateGuideDto`, `CreateFaqDto`, `CreateStatDto`, `CreateTestimonialDto`, `CreatePortfolioItemDto`, `CreateProcessStepDto`, `AppointmentService`, `.log`, `.remove`?**
  _High betweenness centrality (0.150) - this node is a cross-community bridge._
- **Why does `RequirePermission()` connect `AdminUser` to `CreateServiceDto`, `CreateArticleDto`, `HistoryQueryDto`, `CreatePromiseDto`, `ThemeService`, `CreateGuideDto`, `BannerService`, `analytics.module.ts`, `CreateFaqDto`, `CreateStatDto`, `CreateTestimonialDto`, `CreatePortfolioItemDto`, `CreateProcessStepDto`, `AppointmentService`, `.log`, `.remove`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `AdminUser` to `CreateServiceDto`, `CreateArticleDto`, `CreatePromiseDto`, `ThemeService`, `CreateGuideDto`, `BannerService`, `CreateFaqDto`, `CreateStatDto`, `CreateTestimonialDto`, `CreatePortfolioItemDto`, `CreateProcessStepDto`, `AppointmentService`, `.log`, `.remove`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _150 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `AdminUser` be split into smaller, more focused modules?**
  _Cohesion score 0.10752393980848153 - nodes in this community are weakly interconnected._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._