// utils/tokenUtils.ts

const TOKEN_KEY = "auth_token"

/**
 * Save token to localStorage
 * @param token string - The token to store
 */
export const setToken = (token: string): void => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(TOKEN_KEY, token)
  }
}

/**
 * Get token from sessionStorage
 * @returns string | null - The token if exists
 */
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem(TOKEN_KEY)
  }
  return null
}

/**
 * Remove token from localStorage
 */
export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(TOKEN_KEY)
  }
}
