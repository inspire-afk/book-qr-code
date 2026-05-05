import Link from "next/link"
import { BookOpen, Smartphone, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-4">
      <div className="w-full max-w-4xl space-y-12 py-20 text-center">
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="inline-flex animate-in items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 duration-1000 fade-in slide-in-from-bottom-4">
            <Zap className="h-4 w-4" />
            The Future of EdTech is here
          </div>
          <h1 className="gradient-text animate-in text-5xl font-extrabold tracking-tight duration-1000 fade-in slide-in-from-bottom-8 md:text-7xl">
            QR-Powered Learning <br /> For Everyone
          </h1>
          <p className="mx-auto max-w-2xl animate-in text-xl text-muted-foreground duration-1000 fade-in slide-in-from-bottom-12">
            Bridge the gap between physical books and digital content. Scan,
            watch, learn, and test your knowledge in seconds.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid animate-in gap-6 text-left delay-300 duration-1000 fade-in zoom-in md:grid-cols-2">
          <Link
            href="/grade/8"
            className="glass-card group p-8 transition-transform hover:scale-[1.02]"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 transition-transform group-hover:rotate-12">
              <BookOpen className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="mb-2 text-2xl font-bold">Explore Grade 8</h3>
            <p className="text-muted-foreground">
              Access science, technology, and more. Complete chapters and earn
              badges.
            </p>
            <div className="mt-6 flex items-center gap-2 font-medium text-indigo-600">
              Start Learning{" "}
              <span className="transition-transform group-hover:translate-x-2">
                →
              </span>
            </div>
          </Link>

          <div className="glass-card group border-indigo-100 bg-linear-to-br from-indigo-50 to-transparent p-8">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50">
              <Smartphone className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="mb-2 text-2xl font-bold">Scan QR Code</h3>
            <p className="text-muted-foreground">
              Found a code in your textbook? Just point your camera and land
              directly on the chapter.
            </p>
            <div className="mt-6 flex items-center gap-2 text-muted-foreground italic">
              Ready to learn anytime, anywhere.
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid animate-in grid-cols-2 gap-8 border-t border-border pt-12 delay-500 duration-1000 fade-in slide-in-from-bottom-8 md:grid-cols-4">
          <div className="space-y-2 text-center">
            <div className="text-3xl font-bold">100+</div>
            <div className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Interactive Chapters
            </div>
          </div>
          <div className="space-y-2 text-center">
            <div className="text-3xl font-bold">Dynamic</div>
            <div className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              QR Generation
            </div>
          </div>
          <div className="space-y-2 text-center">
            <div className="text-3xl font-bold">Smart</div>
            <div className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Learning Flow
            </div>
          </div>
          <div className="space-y-2 text-center">
            <div className="text-3xl font-bold">Instant</div>
            <div className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Quiz Feedback
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
