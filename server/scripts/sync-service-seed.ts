import 'reflect-metadata'
import { config } from 'dotenv'
import { resolve } from 'path'
import { DataSource } from 'typeorm'
import { Service } from '../src/service/entities/service.entity'
import { SERVICE_SEED } from '../src/service/service.seed'

config({ path: resolve(__dirname, '../.env') })

async function main() {
  const ds = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 5433),
    username: process.env.DB_USERNAME || 'dental_rahmati',
    password: process.env.DB_PASSWORD || 'dental_rahmati',
    database: process.env.DB_DATABASE || 'dental_rahmati',
    entities: [Service],
    synchronize: false,
    logging: false,
  })

  await ds.initialize()
  const repo = ds.getRepository(Service)

  for (const item of SERVICE_SEED) {
    const existing = await repo.findOne({ where: { slug: item.slug } })
    if (!existing) {
      await repo.save(repo.create(item))
      console.log(`  + ${item.slug}`)
      continue
    }

    Object.assign(existing, {
      title: item.title,
      description: item.description,
      icon: item.icon,
      coverImage: item.coverImage ?? null,
      sort: item.sort ?? existing.sort,
      sections: item.sections ?? null,
      casePathTitle: item.casePathTitle ?? null,
      casePathDescription: item.casePathDescription ?? null,
      requiredDocuments: item.requiredDocuments ?? null,
      seoTitle: item.seoTitle ?? null,
      seoDescription: item.seoDescription ?? null,
      seoKeywords: item.seoKeywords ?? null,
      isActive: item.isActive ?? true,
    })
    await repo.save(existing)
    console.log(`  ~ ${item.slug}`)
  }

  await ds.destroy()
  console.log(`Done. ${SERVICE_SEED.length} services synced.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
