import 'reflect-metadata'
import { config } from 'dotenv'
import { resolve } from 'path'
import {
  Column,
  CreateDateColumn,
  DataSource,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type EntityTarget,
  type ObjectLiteral,
} from 'typeorm'
import { AdminUser } from '../src/auth/entities/admin-user.entity'
import { AuditLog } from '../src/auth/entities/audit-log.entity'
import { Banner } from '../src/banner/entities/banner.entity'
import { Service } from '../src/service/entities/service.entity'
import { Article, type ArticleSection } from '../src/article/entities/article.entity'
import { TeamMember } from '../src/team/entities/team-member.entity'
import { Inquiry } from '../src/inquiry/entities/inquiry.entity'
import { PageView } from '../src/analytics/entities/page-view.entity'

config({ path: resolve(__dirname, '../.env') })

@Entity('articles')
class SqliteArticle {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 220 })
  title!: string

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 240 })
  slug!: string

  @Column({ type: 'text' })
  excerpt!: string

  @Column({ type: 'varchar', length: 80 })
  category!: string

  @Column({ type: 'varchar', length: 120 })
  author!: string

  @Column({ type: 'varchar', length: 500 })
  coverImage!: string

  @Column({ type: 'simple-json', nullable: true })
  sections!: ArticleSection[] | null

  @Column({ type: 'varchar', length: 220, nullable: true })
  seoTitle!: string | null

  @Column({ type: 'text', nullable: true })
  seoDescription!: string | null

  @Column({ type: 'varchar', length: 500, nullable: true })
  seoKeywords!: string | null

  @Column({ type: 'varchar', length: 500, nullable: true })
  ogImage!: string | null

  @Column({ type: 'int', default: 6 })
  readingMinutes!: number

  @Column({ type: 'datetime', nullable: true })
  publishedAt!: Date | null

  @Column({ type: 'boolean', default: false })
  featured!: boolean

  @Column({ type: 'int', default: 0 })
  sort!: number

  @Column({ type: 'boolean', default: true })
  isActive!: boolean

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}

const sqliteEntities = [
  AdminUser,
  Banner,
  Service,
  SqliteArticle,
  TeamMember,
  Inquiry,
  AuditLog,
  PageView,
]

const postgresEntities = [
  AdminUser,
  Banner,
  Service,
  Article,
  TeamMember,
  Inquiry,
  AuditLog,
  PageView,
]

const copies: Array<{ from: Function; to: Function }> = sqliteEntities.map(
  (from, index) => ({ from, to: postgresEntities[index]! }),
)

function sqliteFile() {
  return resolve(__dirname, '../dadsar.sqlite')
}

function makeSqlite() {
  return new DataSource({
    type: 'better-sqlite3',
    database: sqliteFile(),
    entities: sqliteEntities,
    synchronize: false,
    logging: false,
  })
}

function makePostgres() {
  return new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USERNAME || 'dadsar',
    password: process.env.DB_PASSWORD || 'dadsar',
    database: process.env.DB_DATABASE || 'dadsar',
    entities: postgresEntities,
    synchronize: true,
    logging: false,
  })
}

function toRows<T extends ObjectLiteral>(rows: T[]): T[] {
  const dateKeys = new Set(['createdAt', 'updatedAt', 'publishedAt'])
  return rows.map((row) => {
    const copy = { ...row } as T
    for (const key of dateKeys) {
      const value = (copy as Record<string, unknown>)[key]
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
        const parsed = new Date(value)
        if (!Number.isNaN(parsed.getTime())) {
          ;(copy as Record<string, unknown>)[key] = parsed
        }
      }
    }
    return copy
  })
}

async function copyTable(
  sqlite: DataSource,
  postgres: DataSource,
  from: EntityTarget<ObjectLiteral>,
  to: EntityTarget<ObjectLiteral>,
) {
  const table = postgres.getMetadata(to).tableName
  const rows = toRows(await sqlite.getRepository(from).find())
  const repo = postgres.getRepository(to)
  await postgres.query(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE`)
  if (rows.length) {
    await repo.insert(rows)
  }
  console.log(`  ${table}: ${rows.length}`)
}

async function main() {
  const sqlite = makeSqlite()
  const postgres = makePostgres()

  await sqlite.initialize()
  await postgres.initialize()

  console.log('Migrating SQLite → PostgreSQL via TypeORM')
  try {
    try {
      await postgres.query('SET session_replication_role = replica')
    } catch {
      console.log('  (skipping replica role; inserting without FK defer)')
    }
    for (const item of copies) {
      await copyTable(
        sqlite,
        postgres,
        item.from as EntityTarget<ObjectLiteral>,
        item.to as EntityTarget<ObjectLiteral>,
      )
    }
    try {
      await postgres.query('SET session_replication_role = DEFAULT')
    } catch {
      /* non-superuser on local Postgres */
    }
  } finally {
    await sqlite.destroy()
    await postgres.destroy()
  }
  console.log('Done.')
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
