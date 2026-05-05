"use client"

import Link from "next/link"
import { Settings, LogOut } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { logout } from "@/app/admin/auth-actions"

export const Navbar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const isAdminPage = pathname.startsWith("/admin")
  const isLoginPage = pathname === "/admin/login"

  const handleLogout = async () => {
    await logout()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 mb-10 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-end px-4">
        <div className="flex items-center gap-6">
          {!isLoginPage && (
            <>
              {isAdminPage ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-bold tracking-widest text-red-500 uppercase transition-colors hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              ) : (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 text-sm font-bold tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground"
                >
                  <Settings className="h-4 w-4" />
                  Admin
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
