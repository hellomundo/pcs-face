import 'dotenv/config'
import type { Config } from 'drizzle-kit'

export default {
    schema: './src/lib/db/schema.ts',
    out: './drizzle',
    driver: 'turso',
    dbCredentials: {
        url: process.env.DATABASE_URL as string,
        authToken: process.env.DATABASE_AUTH_TOKEN as string,
    },
    verbose: true,
} satisfies Config;