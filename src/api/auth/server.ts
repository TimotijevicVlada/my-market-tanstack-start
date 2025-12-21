import { createServerFn } from '@tanstack/react-start'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { User } from '@/api/middleware/types'
import { db } from '@/db'
import { users } from '@/db/schema'

const JWT_SECRET = process.env.JWT_SECRET!

// Helper function to sign JWT token (server-only)
function signJWTToken(userId: string, expiresIn: string = '7d'): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn } as jwt.SignOptions)
}

interface LoginPayload {
  email: string
  password: string
}

interface LoginResponse {
  token: string
  user: User
}

interface RegisterPayload {
  username: string
  email: string
  password: string
  role?: 'producer' | 'buyer' | 'admin'
}

interface RegisterResponse {
  token: string
  user: User
}

export const login = createServerFn({
  method: 'POST',
})
  .inputValidator((data: LoginPayload) => data)
  .handler(async ({ data }): Promise<LoginResponse> => {
    // Find user by email
    const user = await db.query.users.findFirst({
      where: (userTable, { eq }) => eq(userTable.email, data.email),
    })

    if (!user) {
      throw new Error('Invalid email or password')
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(
      data.password,
      user.passwordHash,
    )

    if (!isValidPassword) {
      throw new Error('Invalid email or password')
    }

    // Generate JWT token
    const token = signJWTToken(user.id)

    // Return token and user (without password hash)
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt ?? new Date(),
      },
    }
  })

export const register = createServerFn({
  method: 'POST',
})
  .inputValidator((data: RegisterPayload) => data)
  .handler(async ({ data }): Promise<RegisterResponse> => {
    // Default role to 'buyer' if not provided
    const role = data.role || 'buyer'

    // Check if email already exists
    const existingUserByEmail = await db.query.users.findFirst({
      where: (userTable, { eq }) => eq(userTable.email, data.email),
    })

    if (existingUserByEmail) {
      throw new Error('Email already registered')
    }

    // Check if username already exists
    const existingUserByUsername = await db.query.users.findFirst({
      where: (userTable, { eq }) => eq(userTable.username, data.username),
    })

    if (existingUserByUsername) {
      throw new Error('Username already taken')
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
        role,
      })
      .returning()

    // Generate JWT token
    const token = signJWTToken(user.id)

    // Return token and user (without password hash)
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt ?? new Date(),
      },
    }
  })
