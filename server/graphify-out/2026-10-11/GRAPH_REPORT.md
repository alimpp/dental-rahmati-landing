# Graph Report - server  (2026-10-11)

## Corpus Check
- 85 files · ~74,978 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 797 nodes · 1597 edges · 52 communities (27 shown, 25 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `493d8580`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dependencies
- AdminUser
- scripts
- app.module.ts
- CreateArticleDto
- AdminUsersService
- exclude
- devDependencies
- CreateCatalogItemDto
- CreateTeamMemberDto
- BannerService
- AnalyticsController
- Service
- @eslint/js
- globals
- jest
- @nestjs/cli
- @nestjs/schematics
- AnalyticsService
- prettier
- source-map-support
- supertest
- ts-jest
- ts-node
- Inquiry
- @types/express
- @types/jest
- @types/pg
- @types/supertest
- typescript
- typescript-eslint
- CreateServiceDto
- eslint-plugin-prettier
- compilerOptions
- @types/node
- eslint-config-prettier
- HistoryQueryDto
- analytics.module.ts
- README.md
- include
- migrate-sqlite-to-postgres.ts
- TeamMember
- SqliteArticle
- Article
- nest-cli.json
- init-db.sh
- start-local-postgres.sh
- @eslint/eslintrc
- ts-loader
- @types/bcryptjs
- @types/multer

## God Nodes (most connected - your core abstractions)
1. `AdminUser` - 50 edges
2. `CurrentUser` - 34 edges
3. `RequirePermission()` - 33 edges
4. `AdminUsersService` - 24 edges
5. `AuditService` - 24 edges
6. `compilerOptions` - 22 edges
7. `scripts` - 18 edges
8. `CreateArticleDto` - 18 edges
9. `CreateCatalogItemDto` - 18 edges
10. `CreateTeamMemberDto` - 18 edges

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

## Communities (52 total, 25 thin omitted)

### Community 0 - "dependencies"
Cohesion: 0.06
Nodes (33): bcryptjs, better-sqlite3, class-transformer, class-validator, dotenv, @nestjs/common, @nestjs/config, @nestjs/core (+25 more)

### Community 1 - "AdminUser"
Cohesion: 0.10
Nodes (45): IsObject, PublicAdmin, AuditService, Injectable, InjectRepository, CurrentUser, RequirePermission(), CreateAdminDto (+37 more)

### Community 2 - "scripts"
Cohesion: 0.05
Nodes (37): author, description, jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment (+29 more)

### Community 3 - "app.module.ts"
Cohesion: 0.06
Nodes (29): Global, AnalyticsModule, Module, AppController, Controller, Get, AppModule, Module (+21 more)

### Community 4 - "CreateArticleDto"
Cohesion: 0.07
Nodes (33): IsDateString, ArticleController, Body, Controller, Delete, Get, Param, Patch (+25 more)

### Community 5 - "AdminUsersService"
Cohesion: 0.06
Nodes (26): AdminUsersController, Body, Controller, Delete, Get, Param, Patch, Post (+18 more)

### Community 6 - "exclude"
Cohesion: 0.22
Nodes (8): dist, node_modules, scripts, **/*spec.ts, test, exclude, extends, ./tsconfig.json

### Community 7 - "devDependencies"
Cohesion: 0.29
Nodes (7): eslint, @nestjs/testing, devDependencies, eslint, @nestjs/testing, tsconfig-paths, tsconfig-paths

### Community 8 - "CreateCatalogItemDto"
Cohesion: 0.06
Nodes (39): CatalogController, Body, Controller, Delete, Get, Param, Patch, Post (+31 more)

### Community 9 - "CreateTeamMemberDto"
Cohesion: 0.08
Nodes (29): IsEmail, CreateTeamMemberDto, TeamListQueryDto, ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsIn (+21 more)

### Community 10 - "BannerService"
Cohesion: 0.07
Nodes (31): BannerController, Body, Controller, Delete, Get, Param, Patch, Post (+23 more)

### Community 11 - "AnalyticsController"
Cohesion: 0.15
Nodes (10): AnalyticsController, Body, Controller, Get, Post, Query, UseGuards, ReportsQueryDto (+2 more)

### Community 12 - "Service"
Cohesion: 0.22
Nodes (8): InjectRepository, Service, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn

### Community 24 - "Inquiry"
Cohesion: 0.07
Nodes (25): Inquiry, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, InquiryController, Body, Controller (+17 more)

### Community 32 - "CreateServiceDto"
Cohesion: 0.07
Nodes (30): CreateServiceDto, ServiceSectionDto, ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsIn, IsInt (+22 more)

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
Nodes (15): scripts/migrate-sqlite-to-postgres.ts, scripts/sync-article-seed.ts, scripts/sync-service-seed.ts, src/article/article.seed.ts, src/article/dto/article.dto.ts, src/**/*.entity.ts, src/service/dto/service.dto.ts, src/service/service.seed.ts (+7 more)

### Community 41 - "migrate-sqlite-to-postgres.ts"
Cohesion: 0.31
Nodes (9): copies, copyTable(), main(), makePostgres(), makeSqlite(), postgresEntities, sqliteEntities, sqliteFile() (+1 more)

### Community 42 - "TeamMember"
Cohesion: 0.20
Nodes (8): TeamMember, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn, InjectRepository

### Community 43 - "SqliteArticle"
Cohesion: 0.29
Nodes (7): SqliteArticle, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn

### Community 46 - "Article"
Cohesion: 0.14
Nodes (12): ArticleModule, Module, InjectRepository, Article, ArticleSection, ArticleSectionType, Column, CreateDateColumn (+4 more)

### Community 48 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 49 - "init-db.sh"
Cohesion: 0.83
Nodes (3): run_as_password(), run_as_peer(), init-db.sh script

## Knowledge Gaps
- **142 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `name` (+137 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AdminUser` connect `AdminUser` to `CreateServiceDto`, `CreateArticleDto`, `AdminUsersService`, `CreateCatalogItemDto`, `migrate-sqlite-to-postgres.ts`, `BannerService`, `CreateTeamMemberDto`, `Inquiry`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Why does `RequirePermission()` connect `AdminUser` to `CreateServiceDto`, `CreateArticleDto`, `HistoryQueryDto`, `AdminUsersService`, `CreateCatalogItemDto`, `CreateTeamMemberDto`, `BannerService`, `AnalyticsController`, `Inquiry`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Why does `CurrentUser` connect `AdminUser` to `CreateServiceDto`, `CreateArticleDto`, `AdminUsersService`, `CreateCatalogItemDto`, `CreateTeamMemberDto`, `BannerService`, `Inquiry`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _142 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `AdminUser` be split into smaller, more focused modules?**
  _Cohesion score 0.09765765765765766 - nodes in this community are weakly interconnected._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.05263157894736842 - nodes in this community are weakly interconnected._