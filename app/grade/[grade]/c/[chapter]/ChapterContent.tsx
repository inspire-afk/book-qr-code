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
    <div className="container mx-auto max-w-6xl px-4 py-8">
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
        <div className="flex items-center gap-2 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-1.5 backdrop-blur-md">
          <button
            onClick={() => setActiveStep("content")}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 transition-all ${activeStep === "content" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-muted-foreground hover:bg-white/50 hover:text-indigo-600"}`}
          >
            <PlayCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Content</span>
          </button>
          <button
            disabled={!contentCompleted}
            onClick={() => setActiveStep("quiz")}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 transition-all ${activeStep === "quiz" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : contentCompleted ? "text-muted-foreground hover:bg-white/50 hover:text-indigo-600" : "cursor-not-allowed text-muted-foreground/20"}`}
          >
            {contentCompleted ? (
              <FileText className="h-4 w-4" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">Quiz</span>
          </button>
          <button
            disabled={!isAlreadyDone && activeStep !== "result"}
            onClick={() => isAlreadyDone && setActiveStep("result")}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 transition-all ${activeStep === "result" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : isAlreadyDone ? "text-muted-foreground hover:bg-white/50 hover:text-indigo-600" : "cursor-not-allowed text-muted-foreground/20"}`}
          >
            <Trophy className="h-4 w-4" />
            <span className="text-sm font-medium">Result</span>
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
              <div className="glass-card group relative aspect-video">
                <MediaViewer
                  videoUrl={chapter.videoUrl}
                  pdfUrl={chapter.pdfUrl}
                />
              </div>

              <div className="glass-card flex items-center justify-between border-indigo-500/10 bg-indigo-600/5 p-8">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">
                    Ready to test your knowledge?
                  </h3>
                  <p className="text-muted-foreground">
                    {contentCompleted
                      ? "The quiz is now unlocked! Good luck."
                      : "Please go through the learning material to unlock the quiz."}
                  </p>
                </div>
                <button
                  disabled={!contentCompleted}
                  onClick={() => setActiveStep("quiz")}
                  className={`flex items-center gap-2 rounded-2xl px-10 py-4 font-bold transition-all ${
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
              className="glass-card space-y-10 p-16 text-center"
            >
              <div className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10">
                <Trophy className="h-16 w-16 text-green-400" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute -top-2 -right-2 rounded-full bg-green-500 p-1 text-black"
                >
                  <CheckCircle2 className="h-6 w-6" />
                </motion.div>
              </div>

              <div className="space-y-3">
                <h2 className="text-5xl font-bold">Awesome Work!</h2>
                <p className="text-xl text-muted-foreground">
                  You've mastered Chapter {chapter.chapterNo}: {chapter.title}
                </p>
              </div>

              <div className="flex justify-center gap-16">
                <div className="space-y-1">
                  <div className="text-5xl font-bold text-indigo-400">
                    {score ?? 0}%
                  </div>
                  <div className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
                    Your Score
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-5xl font-bold text-foreground">
                    {chapter.quiz.totalQuestions}
                  </div>
                  <div className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
                    Total Questions
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-6 pt-6">
                <button
                  onClick={() => setActiveStep("content")}
                  className="flex items-center gap-2 rounded-2xl border border-indigo-100 bg-indigo-50 px-8 py-4 font-bold transition-all hover:bg-indigo-100"
                >
                  <RotateCcw className="h-5 w-5" />
                  Review Lesson
                </button>
                <button
                  onClick={() => setActiveStep("quiz")}
                  className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 font-bold shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500"
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
