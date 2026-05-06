"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  PlayCircle,
  FileText,
  CheckCircle2,
  Lock,
  Trophy,
  ArrowRight,
  RotateCcw,
} from "lucide-react"
import { MediaViewer } from "@/components/MediaViewer"
import { QuizComponent } from "@/components/QuizComponent"
import { useProgressStore } from "@/lib/store"

interface ChapterContentProps {
  chapter: any
}

export const ChapterContent = ({ chapter }: ChapterContentProps) => {
  const [activeStep, setActiveStep] = useState<"content" | "quiz" | "result">(
    "content"
  )
  const [contentCompleted, setContentCompleted] = useState(false)
  const { completeChapter, isChapterCompleted, setQuizScore, quizScores } =
    useProgressStore()

  const isAlreadyDone = isChapterCompleted(chapter.id)
  const score = quizScores[chapter.id]

  useEffect(() => {
    if (isAlreadyDone) {
      setContentCompleted(true)
    } else {
      // Simulate content consumption
      const timer = setTimeout(() => {
        setContentCompleted(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isAlreadyDone, chapter.id])

  const handleQuizComplete = (finalScore: number) => {
    setQuizScore(chapter.id, finalScore)
    completeChapter(chapter.id)
    setActiveStep("result")
  }

  return (
    <div className="container mx-auto max-w-6xl px-3 py-4 md:px-4 md:py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        {/* <div className="space-y-2">
          <Link
            href={`/grade/${chapter.grade.grade}`}
            className="flex items-center gap-1 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
          >
            ← Grade {chapter.grade.grade}
          </Link>
          <h1 className="gradient-text text-3xl font-bold md:text-5xl">
            {chapter.chapterNo}. {chapter.title}
          </h1>
        </div> */}

        {/* Progress Tracker */}
        <div className="no-scrollbar flex items-center gap-1 overflow-x-auto rounded-2xl border border-indigo-100 bg-indigo-50/50 p-1 backdrop-blur-md md:gap-2 md:p-1.5">
          <button
            onClick={() => setActiveStep("content")}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 whitespace-nowrap transition-all md:px-5 md:py-2.5 ${activeStep === "content" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-muted-foreground hover:bg-white/50 hover:text-indigo-600"}`}
          >
            <PlayCircle className="h-4 w-4" />
            <span className="text-xs font-medium md:text-sm">Content</span>
          </button>
          <button
            disabled={!contentCompleted}
            onClick={() => setActiveStep("quiz")}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 whitespace-nowrap transition-all md:px-5 md:py-2.5 ${activeStep === "quiz" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : contentCompleted ? "text-muted-foreground hover:bg-white/50 hover:text-indigo-600" : "cursor-not-allowed text-muted-foreground/20"}`}
          >
            {contentCompleted ? (
              <FileText className="h-4 w-4" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            <span className="text-xs font-medium md:text-sm">Quiz</span>
          </button>
          <button
            disabled={!isAlreadyDone && activeStep !== "result"}
            onClick={() => isAlreadyDone && setActiveStep("result")}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 whitespace-nowrap transition-all md:px-5 md:py-2.5 ${activeStep === "result" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : isAlreadyDone ? "text-muted-foreground hover:bg-white/50 hover:text-indigo-600" : "cursor-not-allowed text-muted-foreground/20"}`}
          >
            <Trophy className="h-4 w-4" />
            <span className="text-xs font-medium md:text-sm">Result</span>
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <AnimatePresence mode="wait">
          {activeStep === "content" && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <MediaViewer
                videoUrl={chapter.videoUrl}
                pdfUrl={chapter.pdfUrl}
              />
              <div className="glass-card group relative h-auto w-full overflow-hidden shadow-2xl"></div>

              <div className="glass-card flex flex-col items-center justify-between gap-6 border-indigo-500/10 bg-indigo-600/5 p-6 md:flex-row md:gap-0 md:p-8">
                <div className="space-y-1 text-center md:text-left">
                  <h3 className="text-lg font-bold md:text-xl">
                    Ready to test your knowledge?
                  </h3>
                  <p className="text-sm text-muted-foreground md:text-base">
                    {contentCompleted
                      ? "The quiz is now unlocked! Good luck."
                      : "Please go through the learning material to unlock the quiz."}
                  </p>
                </div>
                <button
                  disabled={!contentCompleted}
                  onClick={() => setActiveStep("quiz")}
                  className={`flex w-full items-center justify-center gap-2 rounded-2xl px-8 py-3 font-bold transition-all md:w-auto md:px-10 md:py-4 ${
                    contentCompleted
                      ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/30 hover:bg-indigo-500"
                      : "cursor-not-allowed bg-secondary text-muted-foreground/30"
                  }`}
                >
                  Unlock Quiz
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          )}

          {activeStep === "quiz" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <QuizComponent
                quiz={chapter.quiz}
                onComplete={handleQuizComplete}
                onCancel={() => setActiveStep("content")}
              />
            </motion.div>
          )}

          {activeStep === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card space-y-6 p-8 text-center md:space-y-10 md:p-16"
            >
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10 md:h-32 md:w-32">
                <Trophy className="h-12 w-12 text-green-400 md:h-16 md:w-16" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute -top-1 -right-1 rounded-full bg-green-500 p-1 text-black md:-top-2 md:-right-2"
                >
                  <CheckCircle2 className="h-4 w-4 md:h-6 md:w-6" />
                </motion.div>
              </div>

              <div className="space-y-2 md:space-y-3">
                <h2 className="text-3xl font-bold md:text-5xl">
                  Awesome Work!
                </h2>
                <p className="text-lg text-muted-foreground md:text-xl">
                  You've mastered Chapter {chapter.chapterNo}: {chapter.title}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:gap-16">
                <div className="space-y-1">
                  <div className="text-4xl font-bold text-indigo-400 md:text-5xl">
                    {score ?? 0}%
                  </div>
                  <div className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase md:text-sm">
                    Your Score
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-4xl font-bold text-foreground md:text-5xl">
                    {chapter.quiz.totalQuestions}
                  </div>
                  <div className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase md:text-sm">
                    Total Questions
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-4 pt-4 md:flex-row md:gap-6 md:pt-6">
                <button
                  onClick={() => setActiveStep("content")}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-indigo-100 bg-indigo-50 px-8 py-4 font-bold transition-all hover:bg-indigo-100"
                >
                  <RotateCcw className="h-5 w-5" />
                  Review Lesson
                </button>
                <button
                  onClick={() => setActiveStep("quiz")}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isAlreadyDone && activeStep !== "result" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card flex items-center justify-center gap-3 border-green-500/10 bg-green-500/5 p-4"
          >
            <CheckCircle2 className="h-5 w-5 text-green-400" />
            <span className="text-sm font-medium text-green-400/80">
              You already completed this chapter with {score}% score.
            </span>
            <button
              onClick={() => setActiveStep("result")}
              className="text-sm font-bold text-green-400 underline underline-offset-4"
            >
              View Result
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
