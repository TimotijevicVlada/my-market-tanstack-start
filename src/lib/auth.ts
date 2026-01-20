import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { db } from '@/db'

// Better Auth instance - SERVER ONLY
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'buyer',
        input: false, // users can't set this on signup
      },
      isActive: {
        type: 'boolean',
        required: false,
        defaultValue: true,
        input: false, // users can't set this on signup
      },
    },
  },
  plugins: [
    tanstackStartCookies(), // Must be last plugin
  ],
})


// TODO: use this type where needed
export type Session = typeof auth.$Infer.Session