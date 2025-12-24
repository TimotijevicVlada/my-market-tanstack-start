import { createMiddleware } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import jwt from 'jsonwebtoken'
import type { User } from '../users/types'
import { db } from '@/db'

interface JWTPayload {
  userId: string
  email?: string
  role?: string
  iat?: number
  exp?: number
}

// Request middleware for logging
export const loggingMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const start = Date.now()
    const result = await next()
    const duration = Date.now() - start

    console.log(
      `[${request.method}] ${request.url} - ${duration}ms - ${new Date().toISOString()}`,
    )

    return result
  },
)

// Request middleware to extract auth token from request
export const authTokenRequestMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    // Get auth token from cookie or Authorization header
    const authHeader = request.headers.get('authorization')
    const cookies = request.headers.get('cookie')

    let authToken: string | null = null

    if (authHeader?.startsWith('Bearer ')) {
      authToken = authHeader.replace('Bearer ', '')
    } else if (cookies) {
      const tokenCookie = cookies
        .split(';')
        .map((c: string) => c.trim())
        .find((c: string) => c.startsWith('auth-token='))
      if (tokenCookie) {
        const parts = tokenCookie.split('=')
        if (parts.length > 1) {
          authToken = parts[1]
        }
      }
    }

    // Pass auth token to next middleware via context
    return next({
      context: {
        authToken,
      },
    })
  },
)

// Server function middleware to extract auth token (optional, can be used separately)
export const authTokenMiddleware = createMiddleware({
  type: 'function',
}).server(async ({ next }) => {
  const request = getRequest()

  // Get auth token from cookie or Authorization header
  const authHeader = request.headers.get('authorization')
  const cookies = request.headers.get('cookie')

  let authToken: string | null = null

  if (authHeader?.startsWith('Bearer ')) {
    authToken = authHeader.replace('Bearer ', '')
  } else if (cookies) {
    const tokenCookie = cookies
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith('auth-token='))
    if (tokenCookie) {
      authToken = tokenCookie.split('=')[1]
    }
  }

  // Pass auth token to next middleware via context
  return next({
    context: {
      authToken,
    },
  })
})

// Helper function to extract auth token (can be used directly in server functions)
export function getAuthTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.replace('Bearer ', '')
  }

  const cookies = request.headers.get('cookie')
  if (cookies) {
    const tokenCookie = cookies
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith('auth-token='))
    if (tokenCookie) {
      return tokenCookie.split('=')[1]
    }
  }

  return null
}

// Server function middleware for authentication using JWT
// This middleware verifies JWT tokens and loads user from database
export const authMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    let user: User | null = null

    try {
      const JWT_SECRET = process.env.JWT_SECRET!

      // Get request to extract auth token
      const request = getRequest()

      // Extract auth token from request
      const authToken = getAuthTokenFromRequest(request)

      if (authToken) {
        try {
          // Verify JWT token

          const decoded = jwt.verify(authToken, JWT_SECRET) as JWTPayload

          // Load user from database using the user ID from the token
          const dbUser = await db.query.users.findFirst({
            where: (userTable, { eq }) => eq(userTable.id, decoded.userId),
          })

          if (dbUser) {
            user = {
              id: dbUser.id,
              username: dbUser.username,
              email: dbUser.email,
              role: dbUser.role,
              isActive: dbUser.isActive,
              createdAt: dbUser.createdAt ?? new Date(),
              updatedAt: dbUser.updatedAt ?? new Date(),
            }
          }
        } catch (jwtError) {
          console.error('JWT verification error:', jwtError)
        }
      }
    } catch (error) {
      console.error('Auth middleware error:', error)
    }

    return next({
      context: {
        user,
      },
    })
  },
)

// Server function middleware that requires authentication
export const requireAuthMiddleware = createMiddleware({ type: 'function' })
  .middleware([authMiddleware])
  .server(async ({ next, context }) => {
    if (!context.user) {
      throw new Error('Neovlašćeni pristup: Potrebna je autentifikacija')
    }

    return next()
  })

// Server function middleware that requires specific role
export const requireRoleMiddleware = (allowedRoles: Array<User['role']>) =>
  createMiddleware({ type: 'function' })
    .middleware([requireAuthMiddleware])
    .server(async ({ next, context }) => {
      if (!context.user) {
        throw new Error('Neovlašćeni pristup: Potrebna je autentifikacija')
      }

      if (!allowedRoles.includes(context.user.role)) {
        throw new Error(
          `Zabranjeni pristup: Potrebna je uloga: ${allowedRoles.join(' ili ')}`,
        )
      }

      return next()
    })

// Convenience middlewares for common role checks
export const requireAdminMiddleware = requireRoleMiddleware(['admin'])
export const requireProducerMiddleware = requireRoleMiddleware(['producer'])
export const requireBuyerMiddleware = requireRoleMiddleware(['buyer'])
