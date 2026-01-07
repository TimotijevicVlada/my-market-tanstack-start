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
    const user = await db.query.users.findFirst({
      where: (userTable, { eq }) => eq(userTable.email, data.email),
    })

    if (!user) {
      throw new Error('Neispravna email adresa')
    }

    const isValidPassword = await bcrypt.compare(
      data.password,
      user.passwordHash,
    )

    if (!isValidPassword) {
      throw new Error('Neispravna lozinka')
    }

    const token = signJWTToken(user.id)

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
    const existingUserByEmail = await db.query.users.findFirst({
      where: (userTable, { eq }) => eq(userTable.email, data.email),
    })

    if (existingUserByEmail) {
      throw new Error('Email je već zauzet')
    }

    const existingUserByUsername = await db.query.users.findFirst({
      where: (userTable, { eq }) => eq(userTable.username, data.username),
    })

    if (existingUserByUsername) {
      throw new Error('Korisničko ime je već zauzeto')
    }

    const passwordHash = await bcrypt.hash(data.password, 10)

    const [user] = await db
      .insert(users)
      .values({
        username: data.username,
        email: data.email,
        passwordHash,
        role: 'buyer',
      })
      .returning()

    const token = signJWTToken(user.id)

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
