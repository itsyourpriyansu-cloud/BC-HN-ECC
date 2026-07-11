import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import configPromise from '@payload-config'
import type { Product } from '@/payload-types'
import { getPayload } from 'payload'

type Listing = {
  asin: string
  sku: string
  slug: string
  rank: number
  category: { main: string; sub: string }
  variantGroup: { groupKey: string }
  productTitle: string
  seo: { metaTitle: string; metaDescription: string; focusKeyword: string; secondaryKeywords: string[] }
  longDescription: string
  bulletPoints: string[]
  attributes: Record<string, string | number | null>
  pricing: { referencePrice: number; note: string }
  faq: Array<{ question: string; answer: string }>
  salesInsight: {
    sessions90d: number
    unitsOrdered: number
    revenueINR: number
    conversionRatePct: number
    sourceNote: string
  }
}

type Catalogue = { products: Listing[] }

const sourcePath = process.argv[2]
if (!sourcePath) throw new Error('Provide the catalogue JSON path: npm run import:listings -- <path-to-json>')

if (process.env.NODE_ENV === 'production' && process.env.ALLOW_CATALOGUE_IMPORT !== 'true') {
  throw new Error('Catalogue import is disabled in production. Set ALLOW_CATALOGUE_IMPORT=true for an approved import.')
}

const lexicalDescription = (value: string): Product['description'] => ({
  root: {
    children: value
      .split(/\n\s*\n/)
      .filter(Boolean)
      .map((paragraph) => ({
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: paragraph.trim(),
            type: 'text',
            version: 1,
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      })),
    direction: null,
    format: '' as const,
    indent: 0,
    type: 'root' as const,
    version: 1,
  },
})

const catalogue = JSON.parse(await readFile(sourcePath, 'utf8')) as Catalogue
if (!Array.isArray(catalogue.products) || catalogue.products.length === 0) {
  throw new Error('The catalogue does not contain any products.')
}

const payload = await getPayload({ config: configPromise })
const dirname = path.dirname(fileURLToPath(import.meta.url))

try {
  const categories = new Map<string, number>()
  const getCategory = async (title: string) => {
    const key = title.toLowerCase().replace(/\s+/g, '-')
    const cached = categories.get(key)
    if (cached) return cached

    const { docs } = await payload.find({
      collection: 'categories',
      limit: 1,
      overrideAccess: true,
      where: { slug: { equals: key } },
    })
    const category =
      docs[0] ||
      (await payload.create({
        collection: 'categories',
        data: { slug: key, title },
        overrideAccess: true,
      }))

    categories.set(key, category.id)
    return category.id
  }

  const { docs: existingMedia } = await payload.find({
    collection: 'media',
    limit: 1,
    overrideAccess: true,
    where: { filename: { equals: 'catalogue-image-placeholder.png' } },
  })
  const placeholder =
    existingMedia[0] ||
    (await payload.create({
      collection: 'media',
      data: { alt: 'Catalogue placeholder image — replace with approved product photography before publishing.' },
      file: {
        data: await readFile(path.resolve(dirname, '../endpoints/seed/tshirt-white.png')),
        mimetype: 'image/png',
        name: 'catalogue-image-placeholder.png',
        size: 780560,
      },
      overrideAccess: true,
    }))

  let created = 0
  let updated = 0
  for (const listing of catalogue.products) {
    const [mainCategory, subCategory] = await Promise.all([
      getCategory(listing.category.main),
      getCategory(listing.category.sub),
    ])
    const data = {
      _status: 'draft' as const,
      asin: listing.asin,
      catalogue: {
        attributes: listing.attributes,
        pricingNote: listing.pricing.note,
        salesInsight: listing.salesInsight,
        salesRank: listing.rank,
        variantGroupKey: listing.variantGroup.groupKey,
      },
      categories: [mainCategory, subCategory],
      description: lexicalDescription(listing.longDescription),
      enableVariants: false,
      faqs: listing.faq,
      gallery: [{ image: placeholder.id }],
      highlights: listing.bulletPoints.map((text) => ({ text })),
      inventory: 0,
      meta: { description: listing.seo.metaDescription, image: placeholder.id, title: listing.seo.metaTitle },
      priceInINR: listing.pricing.referencePrice,
      seoKeywords: {
        focusKeyword: listing.seo.focusKeyword,
        secondaryKeywords: listing.seo.secondaryKeywords.map((keyword) => ({ keyword })),
      },
      sku: listing.sku,
      slug: listing.slug,
      title: listing.productTitle,
    }
    const { docs } = await payload.find({
      collection: 'products',
      limit: 1,
      overrideAccess: true,
      where: { sku: { equals: listing.sku } },
    })

    if (docs[0]) {
      await payload.update({ collection: 'products', data, id: docs[0].id, overrideAccess: true })
      updated += 1
    } else {
      await payload.create({ collection: 'products', data, overrideAccess: true })
      created += 1
    }
  }

  console.info(`Catalogue import complete: ${created} created, ${updated} updated, ${catalogue.products.length} total.`)
} finally {
  await payload.destroy()
}
