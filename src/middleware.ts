import { NextRequest, NextResponse } from "next/server"
import authConfig from "./auth.config"
import NextAuth from "next-auth"
import { getToken } from "next-auth/jwt"

// Use only one of the two middleware options below
// 1. Use middleware directly
// export const { auth: middleware } = NextAuth(authConfig)
 
// 2. Wrapped middleware option
const { auth } = NextAuth(authConfig)
export default auth(async function middleware(req: NextRequest) {
  // Your custom middleware logic goes here
  const decoded = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  console.log("Middleware called", decoded)
  return NextResponse.next()
})