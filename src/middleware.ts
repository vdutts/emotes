import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Bypass Vercel deployment protection for webhook routes
  // This allows Replicate to send webhooks without authentication
  // if (request.nextUrl.pathname.startsWith("/api/webhook/")) {
  //   response.headers.set("x-vercel-protection-bypass", "1")
  // }
  
  return response
}

export const config = {
  matcher: ["/app", "/api/webhook/:path*"],
}
