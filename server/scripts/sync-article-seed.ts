import 'reflect-metadata'
import { config } from 'dotenv'
import { resolve } from 'path'
import { DataSource } from 'typeorm'
import { Article } from '../src/article/entities/article.entity'
import { ARTICLE_SEED } from '../src/article/article.seed'

config({ path: resolve(__dirname, '../.env') })

async function main() {
  const ds = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 5433),
    username: process.env.DB_USERNAME || 'dental_rahmati',
    password: process.env.DB_PASSWORD || 'dental_rahmati',
    database: process.env.DB_DATABASE || 'dental_rahmati',
    entities: [Article],
    synchronize: false,
    logging: false,
  })

  await ds.initialize()
  const repo = ds.getRepository(Article)

  for (const item of ARTICLE_SEED) {
    const existing = await repo.findOne({ where: { slug: item.slug } })
    const payload = {
      title: item.title,
      excerpt: item.excerpt,
      category: item.category,
      author: item.author,
      coverImage: item.coverImage,
      sections: item.sections ?? null,
      seoTitle: item.seoTitle ?? null,
      seoDescription: item.seoDescription ?? null,
      seoKeywords: item.seoKeywords ?? null,
      ogImage: item.ogImage ?? null,
      readingMinutes: item.readingMinutes ?? 6,
      publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
      featured: item.featured ?? false,
      sort: item.sort ?? 0,
      isActive: item.isActive ?? true,
    }

    if (!existing) {
      await repo.save(repo.create({ slug: item.slug, ...payload }))
      console.log(`  + ${item.slug}`)
      continue
    }

    Object.assign(existing, payload)
    await repo.save(existing)
    console.log(`  ~ ${item.slug}`)
  }

  await ds.destroy()
  console.log(`Done. ${ARTICLE_SEED.length} articles synced.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
