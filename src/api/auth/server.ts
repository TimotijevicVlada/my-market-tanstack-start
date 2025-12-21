import { createServerFn } from '@tanstack/react-start'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { authMiddleware } from '../middleware'
import type { SignOptions } from 'jsonwebtoken'
import type { LoginPayload, RegisterPayload } from './types'
import { db } from '@/db'
import { users } from '@/db/schema'

const JWT_SECRET = process.env.JWT_SECRET!

// Helper function to sign JWT token (server-only)
function signJWTToken(
  userId: string,
  expiresIn: SignOptions['expiresIn'] = '7d',
) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn })
}

export const login = createServerFn({
  method: 'POST',
})
  .inputValidator((data: LoginPayload) => data)
  .handler(async ({ data }) => {
    // Find user by email
    const user = await db.query.users.findFirst({
      where: (userTable, { eq }) => eq(userTable.email, data.email),
    })

    if (!user) {
      throw new Error('Neispravna email adresa')
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(
      data.password,
      user.passwordHash,
    )

    if (!isValidPassword) {
      throw new Error('Neispravna lozinka')
    }

    // Generate JWT token
    const token = signJWTToken(user.id)

    // Return token and user (without password hash)
    const { passwordHash: _, ...userWithoutPassword } = user
    return {
      token,
      user: userWithoutPassword,
    }
  })

export const register = createServerFn({
  method: 'POST',
})
  .inputValidator((data: RegisterPayload) => data)
  .handler(async ({ data }) => {
    // Check if email already exists
    const existingUserByEmail = await db.query.users.findFirst({
      where: (userTable, { eq }) => eq(userTable.email, data.email),
    })

    if (existingUserByEmail) {
      throw new Error('Email je već zauzet')
    }

    // Check if username already exists
    const existingUserByUsername = await db.query.users.findFirst({
      where: (userTable, { eq }) => eq(userTable.username, data.username),
    })

    if (existingUserByUsername) {
      throw new Error('Korisničko ime je već zauzeto')
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10)

    // Create user
    const [user] = await db
      .insert(users)
      .values({
        username: data.username,
        email: data.email,
        passwordHash,
        role: data.role || 'buyer',
      })
      .returning()

    // Generate JWT token
    const token = signJWTToken(user.id)

    // Return token and user (without password hash)

    const { passwordHash: _, ...userWithoutPassword } = user
    return {
      token,
      user: userWithoutPassword,
    }
  })

export const getLoggedInUser = createServerFn({
  method: 'GET',
})
  .middleware([authMiddleware])
  .handler(({ context }) => {
    return context.user
  })
