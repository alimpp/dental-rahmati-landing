# Graph Report - server  (2026-09-30)

## Corpus Check
- 15 files · ~1,464 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 176 nodes · 182 edges · 32 communities (11 shown, 21 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- dependencies
- compilerOptions
- package.json
- AppController
- scripts
- README.md
- exclude
- devDependencies
- nest-cli.json
- init-db.sh
- eslint
- eslint-config-prettier
- @eslint/eslintrc
- @eslint/js
- globals
- jest
- @nestjs/cli
- @nestjs/schematics
- @nestjs/testing
- prettier
- source-map-support
- supertest
- ts-jest
- ts-node
- tsconfig-paths
- @types/express
- @types/jest
- @types/pg
- @types/supertest
- typescript
- typescript-eslint

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 22 edges
2. `scripts` - 14 edges
3. `jest` - 8 edges
4. `AppController` - 7 edges
5. `AppService` - 7 edges
6. `exclude` - 5 edges
7. `moduleFileExtensions` - 4 edges
8. `AppModule` - 4 edges
9. `init-db.sh script` - 3 edges
10. `compilerOptions` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (32 total, 21 thin omitted)

### Community 0 - "dependencies"
Cohesion: 0.09
Nodes (23): class-transformer, class-validator, @nestjs/common, @nestjs/config, @nestjs/core, @nestjs/platform-express, @nestjs/typeorm, dependencies (+15 more)

### Community 1 - "compilerOptions"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 2 - "package.json"
Cohesion: 0.10
Nodes (19): author, description, jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment (+11 more)

### Community 3 - "AppController"
Cohesion: 0.19
Nodes (7): Controller, Get, Injectable, Module, AppController, AppModule, AppService

### Community 4 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:init, format, lint, start, start:debug, start:dev (+6 more)

### Community 5 - "README.md"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 6 - "exclude"
Cohesion: 0.25
Nodes (7): dist, node_modules, **/*spec.ts, test, ./tsconfig.json, exclude, extends

### Community 7 - "devDependencies"
Cohesion: 0.29
Nodes (7): eslint-plugin-prettier, devDependencies, eslint-plugin-prettier, ts-loader, @types/node, ts-loader, @types/node

### Community 8 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 9 - "init-db.sh"
Cohesion: 0.83
Nodes (3): run_as_password(), run_as_peer(), init-db.sh script

## Knowledge Gaps
- **103 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `name` (+98 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `package.json`, `eslint`, `eslint-config-prettier`, `@eslint/eslintrc`, `@eslint/js`, `globals`, `jest`, `@nestjs/cli`, `@nestjs/schematics`, `@nestjs/testing`, `prettier`, `source-map-support`, `supertest`, `ts-jest`, `ts-node`, `tsconfig-paths`, `@types/express`, `@types/jest`, `@types/pg`, `@types/supertest`, `typescript`, `typescript-eslint`?**
  _High betweenness centrality (0.252) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _103 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._