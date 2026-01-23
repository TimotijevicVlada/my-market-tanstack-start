import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { db } from '@/db'
import { sendEmail } from '@/lib/email.servise'

// Better Auth instance - SERVER ONLY
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL!,
  secret: process.env.BETTER_AUTH_SECRET!,
  trustedOrigins: [process.env.BETTER_AUTH_URL!],


  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "facebook", "credentials"],
      allowDifferentEmails: false,
    },
  },

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
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          subject: "Potvrdite brisanje naloga",
          html: `
            <div style="font-family:system-ui;line-height:1.6">
              <h2>Potvrda brisanja naloga</h2>
              <p>Zatražili ste brisanje naloga na My Marketplace.</p>
              <p>Kliknite na dugme ispod da potvrdite:</p>
              <p>
                <a href="${url}" style="display:inline-block;padding:10px 14px;border-radius:8px;background:#ef4444;color:white;text-decoration:none">
                  Potvrdi brisanje naloga
                </a>
              </p>
              <p>Ako niste vi, ignorišite ovaj email.</p>
            </div>
          `,
          text: `Zatražili ste brisanje naloga. Potvrdite ovde: ${url}`,
        })
      },
      // opcionalno:
      // beforeDelete: async (user) => { ...cleanup... },
      // afterDelete: async (user) => { ... },
    },
  },

  plugins: [
    tanstackStartCookies(), // Must be last plugin
  ],
})

export type Session = typeof auth.$Infer.Session