import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  // Middleware disabled - no app store redirect
  return NextResponse.next()
}

export const config = {
  matcher: "/app",
}
