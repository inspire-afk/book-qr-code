"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  PlayCircle,
  FileText,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Play,
  Code,
  X,
} from "lucide-react"
import { MediaViewer } from "@/components/MediaViewer"
import { QuizComponent } from "@/components/QuizComponent"
import { useProgressStore } from "@/lib/store"

interface ChapterContentProps {
  chapter: any
}

export const ChapterContent = ({ chapter }: ChapterContentProps) => {
  const hasModules = chapter.modules && chapter.modules.length > 0
  const hasStem = !!chapter.stemVideoUrl

  const [currentModuleIndex, setCurrentModuleIndex] = useState(0)
  const firstModule = hasModules ? chapter.modules[0] : null
  const [activeStep, setActiveStep] = useState<
    "video" | "quiz" | "stem" | "result" | "none" | "html"
  >(
    hasModules 
      ? (firstModule?.videoUrl ? "video" : (firstModule?.quizData ? "quiz" : (firstModule?.htmlContent ? "html" : "none"))) 
      : hasStem ? "stem" : "none"
  )
  const [isHtmlActive, setIsHtmlActive] = useState(false)
  const [videoCompleted, setVideoCompleted] = useState(false)

  const { completeChapter, isChapterCompleted, setQuizScore } =
    useProgressStore()

  const isAlreadyDone = isChapterCompleted(chapter.id)
  const currentModule = hasModules ? chapter.modules[currentModuleIndex] : null
  const isLastModule = hasModules ? currentModuleIndex === chapter.modules.length - 1 : true

  useEffect(() => {
    // Reset video completion when moving to a new module or step
    setVideoCompleted(false)
    setIsHtmlActive(false)

    if (isAlreadyDone) {
      setVideoCompleted(true)
    } else if (activeStep === "video" || activeStep === "stem") {
      const timer = setTimeout(() => {
        setVideoCompleted(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [currentModuleIndex, activeStep, isAlreadyDone])

  const handleQuizComplete = useCallback((finalScore: number) => {
    if (isLastModule) {
      if (chapter.stemVideoUrl) {
        setActiveStep("stem")
      } else {
        setQuizScore(chapter.id, finalScore)
        completeChapter(chapter.id)
        setActiveStep("result")
      }
    } else {
      const nextIndex = currentModuleIndex + 1
      const nextModule = chapter.modules[nextIndex]
      setCurrentModuleIndex(nextIndex)
      
      if (nextModule.videoUrl) {
        setActiveStep("video")
      } else if (nextModule.quizData) {
        setActiveStep("quiz")
      } else if (nextModule.htmlContent) {
        setActiveStep("html")
      } else {
        // This case shouldn't happen with our validation, but just in case
        handleQuizComplete(finalScore)
      }
    }
  }, [isLastModule, chapter, currentModuleIndex, setQuizScore, completeChapter])

  // Auto-progress if no quiz or html is present
  useEffect(() => {
    if (videoCompleted && activeStep === "video" && !currentModule?.quizData && !currentModule?.htmlContent && !isAlreadyDone) {
      handleQuizComplete(100)
    }
  }, [videoCompleted, activeStep, currentModule, isAlreadyDone, handleQuizComplete])

  const handleStemComplete = () => {
    completeChapter(chapter.id)
    setActiveStep("result")
  }

  return (
    <div className="container mx-auto max-w-6xl px-3 py-4 md:px-4 md:py-8">
      {/* Progress Header */}
      <div className="mb-12 flex flex-col items-center justify-between gap-8 md:flex-row">
        <div className="space-y-3 text-center md:text-left">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl">{chapter.title}</h1>
        </div>

        {(hasModules || hasStem) && (
          <div className="flex flex-wrap justify-center gap-3 rounded-[2rem] border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/50">
            {chapter.modules.map((m: any, i: number) => (
              <div key={m.id} className="flex items-center gap-2">
                <button
                  disabled={i > currentModuleIndex && !isAlreadyDone}
                  onClick={() => {
                    setCurrentModuleIndex(i)
                    const mod = chapter.modules[i]
                    setActiveStep(mod.videoUrl ? "video" : (mod.quizData ? "quiz" : "html"))
                  }}
                  className={`relative flex h-12 w-12 items-center justify-center rounded-full font-bold transition-all md:h-14 md:w-14 ${
                    i === currentModuleIndex
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/40"
                      : i < currentModuleIndex || isAlreadyDone
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                        : "bg-slate-50 text-slate-300"
                  }`}
                >
                  {i < currentModuleIndex || isAlreadyDone ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <span className="text-lg">{i + 1}</span>
                  )}
                  {i === currentModuleIndex && (
                    <motion.div
                      layoutId="nav-glow"
                      className="absolute inset-0 rounded-full bg-indigo-400/20 blur-md"
                    />
                  )}
                </button>
              </div>
            ))}
            {chapter.stemVideoUrl && (
              <button
                disabled={
                  !isAlreadyDone &&
                  (currentModuleIndex < chapter.modules.length - 1 ||
                    activeStep !== "stem")
                }
                onClick={() => setActiveStep("stem")}
                className={`flex h-12 w-12 items-center justify-center rounded-full font-bold transition-all md:h-14 md:w-14 ${
                  activeStep === "stem"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/40"
                    : isAlreadyDone
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      : "bg-slate-50 text-slate-300"
                }`}
              >
                <Play className="h-6 w-6" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {(activeStep === "video" || activeStep === "stem") && (
            <motion.div
              key={
                activeStep === "video" ? `video-${currentModuleIndex}` : "stem"
              }
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <MediaViewer
                videoUrl={
                  activeStep === "video"
                    ? currentModule?.videoUrl
                    : chapter.stemVideoUrl
                }
                title={
                  activeStep === "video"
                    ? (currentModule.videoTitle || currentModule.title)
                    : chapter.stemTitle
                }
                description={
                  activeStep === "video"
                    ? currentModule.videoDescription
                    : chapter.stemDescription
                }
              />

              {(activeStep === "stem" || currentModule.quizData || currentModule.htmlContent) && (
                <div className="relative overflow-hidden rounded-[2.5rem] border border-indigo-100 bg-white p-8 shadow-[0_20px_50_rgba(79,70,229,0.05)] md:p-10">
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-indigo-50 opacity-[0.3]" />
                  <div className="relative flex flex-col items-center justify-between gap-8 md:flex-row">
                    <div className="space-y-2 text-center md:text-left">
                      <h3 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                        {activeStep === "video"
                          ? (currentModule.quizData ? "Ready for the module quiz?" : (currentModule.htmlContent ? "Ready for the interactive class?" : "Module complete!"))
                          : "Finished the STEM project?"}
                      </h3>
                      <p className="text-base text-slate-500 md:text-lg">
                        {videoCompleted
                          ? "Great! You can now move to the next step."
                          : "Watch the resource above to unlock the next step."}
                      </p>
                    </div>
                    <button
                      disabled={!videoCompleted}
                      onClick={() => {
                        if (activeStep === "video") {
                          if (currentModule.quizData) {
                            setActiveStep("quiz")
                          } else if (currentModule.htmlContent) {
                            setActiveStep("html")
                          } else {
                            handleQuizComplete(100)
                          }
                        } else {
                          handleStemComplete()
                        }
                      }}
                      className={`group/btn flex w-full items-center justify-center gap-3 rounded-[1.5rem] px-10 py-5 text-lg font-bold transition-all md:w-auto ${
                        videoCompleted
                          ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/30 hover:bg-indigo-500 hover:scale-105 active:scale-95"
                          : "cursor-not-allowed bg-slate-100 text-slate-400"
                      }`}
                    >
                      <span>
                        {activeStep === "video"
                          ? (currentModule.quizData ? "Take Module Quiz" : (currentModule.htmlContent ? "Enter in class" : (isLastModule && !chapter.stemVideoUrl ? "Finish Chapter" : "Next Module")))
                          : "Finish Chapter"}
                      </span>
                      <ArrowRight className={`h-6 w-6 transition-transform ${videoCompleted ? "group-hover/btn:translate-x-1" : ""}`} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeStep === "quiz" && (
            <motion.div
              key={`quiz-${currentModuleIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    {currentModule.quizTitle || `Module ${currentModuleIndex + 1} Quiz`}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {currentModule.quizDescription || currentModule.quizData?.title}
                  </p>
                </div>
              </div>
              <QuizComponent
                quiz={currentModule.quizData}
                onComplete={(score) => {
                  if (currentModule.htmlContent) {
                    setActiveStep("html")
                  } else {
                    handleQuizComplete(score)
                  }
                }}
                onCancel={() => setActiveStep("video")}
              />
            </motion.div>
          )}

          {activeStep === "html" && (
            <motion.div
              key={`html-${currentModuleIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {!isHtmlActive ? (
                <div className="glass-card relative overflow-hidden p-8 md:p-12">
                  <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-amber-50/50" />
                  <div className="relative space-y-8 text-center md:text-left">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                      <Code className="h-8 w-8" />
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-3xl font-black text-slate-900 md:text-4xl">
                        {currentModule.htmlTitle || "Interactive Learning Content"}
                      </h2>
                      <p className="max-w-2xl text-lg text-slate-600">
                        {currentModule.htmlDescription || "Explore this interactive lesson to deepen your understanding."}
                      </p>
                    </div>
                    <div className="flex flex-col gap-4 md:flex-row">
                      <button
                        onClick={() => setIsHtmlActive(true)}
                        className="flex items-center justify-center gap-3 rounded-2xl bg-amber-500 px-10 py-5 text-lg font-bold text-white shadow-xl shadow-amber-500/30 transition-all hover:bg-amber-600 hover:scale-105 active:scale-95"
                      >
                        <span>Enter in class</span>
                        <Play className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="fixed inset-0 z-[200] flex flex-col bg-white overflow-hidden animate-in fade-in zoom-in duration-300">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                        <Code className="h-5 w-5" />
                      </div>
                      <h3 className="font-bold text-slate-900">{currentModule.htmlTitle || "Interactive Content"}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsHtmlActive(false)}
                        className="flex bg-red-400 text-white cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all hover:bg-red-500"
                      >
                        <X className="h-4 w-4" />
                        <span className="hidden md:block">Close</span>
                      </button>
                      {/* <button
                        onClick={() => handleQuizComplete(100)}
                        className="rounded-xl bg-indigo-600 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:scale-105 active:scale-95"
                      >
                        Complete Module
                      </button> */}
                    </div>
                  </div>
                  <div className="flex-1 w-full bg-slate-50 p-2 md:p-4">
                    <div className="h-full w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                      <iframe
                        srcDoc={currentModule.htmlContent}
                        className="h-full w-full"
                        title="Interactive Content"
                        sandbox="allow-scripts allow-same-origin allow-forms"
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
          {activeStep === "none" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-64 flex-col items-center justify-center space-y-4 rounded-3xl border-2 border-dashed border-indigo-100 bg-indigo-50/20 text-indigo-400"
            >
              <FileText className="h-12 w-12 opacity-20" />
              <p className="font-medium">No content available for this chapter yet.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
