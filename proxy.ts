import { NextRequest, NextResponse } from "next/server"
import { decrypt } from "@/lib/auth"

export async function proxy(request: NextRequest) {
  const session = request.cookies.get("session")?.value

  // Protected routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Exclude login page from protection
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next()
    }

    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    try {
      await decrypt(session)
      return NextResponse.next()
    } catch (err) {
      // Token expired or invalid
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
