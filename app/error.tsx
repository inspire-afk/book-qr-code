"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, RotateCcw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.05),transparent),radial-gradient(circle_at_bottom_left,rgba(239,68,68,0.05),transparent)] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card max-w-lg space-y-8 border-red-100 p-12 text-center shadow-red-500/5"
      >
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-red-600/10 text-red-600 shadow-xl shadow-red-500/10">
          <AlertTriangle className="h-10 w-10" />
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-black md:text-5xl">
            Something Went Wrong
          </h1>
          <p className="text-center text-lg text-muted-foreground">
            An unexpected error occurred while processing your request. Our team
            has been notified.
          </p>
          {error.digest && (
            <p className="font-mono text-[10px] tracking-widest text-muted-foreground/40 uppercase">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 font-bold text-white shadow-xl shadow-indigo-500/20 transition-all hover:scale-105 hover:bg-indigo-500"
          >
            <RotateCcw className="h-5 w-5" />
            Try Again
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-2xl border border-indigo-100 bg-white px-8 py-4 font-bold text-indigo-600 shadow-sm transition-all hover:bg-indigo-50"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </motion.div>

      {/* Decorative elements */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-red-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl" />
      </div>
    </div>
  )
}
