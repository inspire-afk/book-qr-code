"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Home, ArrowLeft, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.05),transparent),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.05),transparent)] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card max-w-lg space-y-8 p-12 text-center"
      >
        <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-600/10 text-indigo-600 shadow-xl shadow-indigo-500/10">
          <Search className="h-10 w-10" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-bold text-white shadow-lg"
          >
            404
          </motion.div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-black md:text-5xl">Page Not Found</h1>
          <p className="text-center text-lg text-muted-foreground">
            The page you&apos;re looking for has moved to another biosphere or
            never existed in this dimension.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 font-bold text-white shadow-xl shadow-indigo-500/20 transition-all hover:scale-105 hover:bg-indigo-500"
          >
            <Home className="h-5 w-5" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 rounded-2xl border border-indigo-100 bg-white px-8 py-4 font-bold text-indigo-600 shadow-sm transition-all hover:bg-indigo-50"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </button>
        </div>
      </motion.div>

      {/* Decorative elements */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl" />
      </div>
    </div>
  )
}
