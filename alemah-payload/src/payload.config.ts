import 'dotenv/config'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

import {
  BoldFeature,
  EXPERIMENTAL_TableFeature,
  IndentFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  UnderlineFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from '@/collections/Categories'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/Pages'
import { Users } from '@/collections/Users'
import { Footer } from '@/globals/Footer'
import { Header } from '@/globals/Header'
import { plugins } from './plugins'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const isProduction = process.env.NODE_ENV === 'production'
const allowDemoSeed = process.env.ALLOW_DEMO_SEED === 'true'
const databaseURL = process.env.DATABASE_URL
const usePostgres = databaseURL?.startsWith('postgres')
const payloadSecret = process.env.PAYLOAD_SECRET || (allowDemoSeed ? 'demo-seed-only-secret' : '')

if (isProduction && !payloadSecret) {
  throw new Error('PAYLOAD_SECRET must be configured in production.')
}

if (isProduction && !usePostgres) {
  throw new Error('A PostgreSQL DATABASE_URL must be configured in production.')
}

if (isProduction && !process.env.SMTP_HOST && !allowDemoSeed) {
  throw new Error('SMTP_HOST must be configured in production.')
}

const db = usePostgres
  ? postgresAdapter({
      pool: {
        connectionString: databaseURL,
        max: Number(process.env.DATABASE_POOL_MAX || 20),
      },
      // Shared and production-like databases must change only through committed migrations.
      push: false,
    })
  : sqliteAdapter({
      client: {
        url: 'file:./local.db',
      },
    })

const email = nodemailerAdapter(
  process.env.SMTP_HOST
    ? {
        defaultFromAddress: process.env.SMTP_FROM_ADDRESS || 'noreply@example.com',
        defaultFromName: process.env.SMTP_FROM_NAME || 'Alemah',
        transportOptions: {
          auth:
            process.env.SMTP_USER && process.env.SMTP_PASS
              ? { pass: process.env.SMTP_PASS, user: process.env.SMTP_USER }
              : undefined,
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: process.env.SMTP_SECURE === 'true',
        },
      }
    : undefined,
)

export default buildConfig({
  admin: {
    components: {
      beforeLogin: ['@/components/BeforeLogin#BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard#BeforeDashboard'],
    },
    user: Users.slug,
  },
  collections: [Users, Pages, Categories, Media],
  db,
  email,
  editor: lexicalEditor({
    features: () => {
      return [
        UnderlineFeature(),
        BoldFeature(),
        ItalicFeature(),
        OrderedListFeature(),
        UnorderedListFeature(),
        LinkFeature({
          enabledCollections: ['pages'],
          fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
              if ('name' in field && field.name === 'url') return false
              return true
            })

            return [
              ...defaultFieldsWithoutUrl,
              {
                name: 'url',
                type: 'text',
                admin: {
                  condition: ({ linkType }) => linkType !== 'internal',
                },
                label: ({ t }) => t('fields:enterURL'),
                required: true,
              },
            ]
          },
        }),
        IndentFeature(),
        EXPERIMENTAL_TableFeature(),
      ]
    },
  }),
  endpoints: [],
  globals: [Header, Footer],
  plugins,
  secret: payloadSecret || 'development-only-payload-secret',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
