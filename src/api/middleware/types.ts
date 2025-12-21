// Shared types - safe for both client and server
export type User = {
  id: string
  username: string
  email: string
  role: 'producer' | 'buyer' | 'admin'
  createdAt: Date
}
