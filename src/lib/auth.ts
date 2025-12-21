// Utility functions for authentication token management

/**
 * Set authentication token in both localStorage and cookie
 */
export function setAuthToken(token: string) {
  // Store in localStorage for client-side access
  localStorage.setItem('auth-token', token)

  // Set cookie (expires in 7 days to match JWT expiration)
  const expires = new Date()
  expires.setDate(expires.getDate() + 7)
  document.cookie = `auth-token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`
}

/**
 * Get authentication token from localStorage
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('auth-token')
}

/**
 * Remove authentication token
 */
export function removeAuthToken() {
  localStorage.removeItem('auth-token')
  // Remove cookie
  document.cookie =
    'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
}
