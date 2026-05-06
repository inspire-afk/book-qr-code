"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  HelpCircle,
  ChevronRight,
  CheckCircle2,
  Lightbulb,
  Info,
} from "lucide-react"

interface Option {
  label: string
  text: string
  isCorrect: boolean
  rationale: string
}

interface Question {
  id: string
  question: string
  options: Option[]
  correctAnswer: string
  hint?: string | null
}

interface Quiz {
  title: string
  totalQuestions: number
  questions: Question[]
}

interface QuizComponentProps {
  quiz: Quiz
  onComplete: (score: number) => void
  onCancel: () => void
}

export const QuizComponent = ({
  quiz,
  onComplete,
  onCancel,
}: QuizComponentProps) => {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null) // label (e.g., "A")
  const [answers, setAnswers] = useState<string[]>([])
  const [showHint, setShowHint] = useState(false)
  const [showRationale, setShowRationale] = useState(false)

  const currentQuestion = quiz.questions[currentIdx]
  const options = currentQuestion.options || []

  const handleSelect = (label: string) => {
    if (showRationale) return
    setSelectedOption(label)
  }

  const handleNext = () => {
    if (!selectedOption) return

    if (!showRationale) {
      setShowRationale(true)
      return
    }

    const newAnswers = [...answers, selectedOption]
    setAnswers(newAnswers)
    setSelectedOption(null)
    setShowHint(false)
    setShowRationale(false)

    if (currentIdx < quiz.questions.length - 1) {
      setCurrentIdx(currentIdx + 1)
    } else {
      // Calculate score
      const correctCount = quiz.questions.reduce((acc, q, idx) => {
        // Find the correct label
        const correctLabel =
          q.correctAnswer || q.options.find((o) => o.isCorrect)?.label
        return acc + (newAnswers[idx] === correctLabel ? 1 : 0)
      }, 0)
      const scorePercentage = Math.round(
        (correctCount / quiz.questions.length) * 100
      )
      onComplete(scorePercentage)
    }
  }

  const selectedOptionData = options.find((o) => o.label === selectedOption)
  const isCorrect =
    selectedOptionData?.label === currentQuestion.correctAnswer ||
    selectedOptionData?.isCorrect

  return (
    <div className="glass-card flex min-h-[400px] flex-col shadow-2xl shadow-indigo-500/10 md:min-h-[400px]">
      {/* Quiz Header */}
      <div className="flex items-center justify-between border-b border-indigo-100 bg-indigo-50/50 p-4 md:p-5">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-600/20 p-2 md:p-3">
            <HelpCircle className="h-5 w-5 text-indigo-400 md:h-6 md:w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold md:text-xl">{quiz.title}</h3>
            <div className="mt-0.5 flex items-center gap-2 md:mt-1">
              <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase md:text-xs">
                Step {currentIdx + 1}
              </span>
              <span className="h-1 w-1 rounded-full bg-indigo-200" />
              <span className="text-xs text-muted-foreground md:text-sm">
                of {quiz.totalQuestions} questions
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="rounded-xl px-3 py-1.5 text-xs font-bold text-muted-foreground/60 transition-colors hover:bg-indigo-50 hover:text-indigo-600 md:px-4 md:py-2 md:text-sm"
        >
          Quit
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full overflow-hidden bg-indigo-50">
        <motion.div
          className="h-full bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.8)]"
          initial={{ width: 0 }}
          animate={{
            width: `${((currentIdx + 1) / quiz.totalQuestions) * 100}%`,
          }}
        />
      </div>

      {/* Question Content */}
      <div className="flex-1 space-y-8 p-4 md:space-y-10 md:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 md:space-y-8"
          >
            <h2 className="text-2xl leading-tight font-bold md:text-3xl">
              {currentQuestion.question}
            </h2>

            <div className="grid gap-3 sm:grid-cols-2 md:gap-4">
              {options.map((option, idx) => (
                <button
                  key={idx}
                  disabled={showRationale}
                  onClick={() => handleSelect(option.label)}
                  className={`group relative rounded-2xl border p-2 text-left transition-all md:p-4 ${
                    selectedOption === option.label
                      ? showRationale
                        ? option.isCorrect ||
                          option.label === currentQuestion.correctAnswer
                          ? "border-green-500/50 bg-green-500/20 shadow-lg shadow-green-500/10"
                          : "border-red-500/50 bg-red-500/20 shadow-lg shadow-red-500/10"
                        : "scale-[1.02] border-indigo-400 bg-indigo-600 text-white shadow-xl shadow-indigo-500/20"
                      : showRationale &&
                          (option.isCorrect ||
                            option.label === currentQuestion.correctAnswer)
                        ? "border-green-500/30 bg-green-500/10"
                        : "border-border bg-secondary/50 hover:border-indigo-200 hover:bg-indigo-50/50"
                  }`}
                >
                  <div className="flex items-center gap-3 md:gap-5">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-base font-bold transition-all md:h-10 md:w-10 md:rounded-xl md:text-lg ${
                        selectedOption === option.label
                          ? "bg-white text-indigo-600 shadow-lg"
                          : "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200"
                      }`}
                    >
                      {option.label}
                    </div>
                    <span className="text-base font-semibold md:text-lg">
                      {option.text}
                    </span>
                  </div>

                  {showRationale &&
                    (option.isCorrect ||
                      option.label === currentQuestion.correctAnswer) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 rounded-full bg-green-500 p-1 text-black md:-top-2 md:-right-2"
                      >
                        <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5" />
                      </motion.div>
                    )}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Rationale Display */}
        <AnimatePresence>
          {showRationale && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3 rounded-2xl border p-4 md:gap-4 md:p-6 ${
                isCorrect
                  ? "border-green-500/20 bg-green-500/5"
                  : "border-red-500/20 bg-red-500/5"
              }`}
            >
              <div
                className={`rounded-xl p-2 ${isCorrect ? "bg-green-500/20" : "bg-red-500/20"}`}
              >
                <Info
                  className={`h-4 w-4 md:h-5 md:w-5 ${isCorrect ? "text-green-400" : "text-red-400"}`}
                />
              </div>
              <div className="space-y-1">
                <div
                  className={`text-[10px] font-bold tracking-widest uppercase md:text-xs ${isCorrect ? "text-green-400" : "text-red-400"}`}
                >
                  {isCorrect ? "Correct Explanation" : "Wait, Why?"}
                </div>
                <p className="text-sm leading-relaxed text-foreground/80 italic md:text-base">
                  {selectedOptionData?.rationale ||
                    options.find(
                      (o) =>
                        o.isCorrect || o.label === currentQuestion.correctAnswer
                    )?.rationale}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center justify-between gap-6 border-t border-indigo-100 bg-indigo-50/50 p-8 sm:flex-row">
        <div>
          {currentQuestion.hint && !showRationale && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 rounded-xl bg-indigo-500/10 px-3 py-1.5 text-xs font-bold text-indigo-400 transition-colors hover:text-indigo-300 md:px-4 md:py-2 md:text-sm"
            >
              <Lightbulb className="h-3.5 w-3.5 md:h-4 md:w-4" />
              {showHint ? "Hide Hint" : "Need a Hint?"}
            </button>
          )}
          <AnimatePresence>
            {showHint && !showRationale && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 max-w-md border-l-2 border-indigo-500/50 pl-4 text-sm text-muted-foreground italic"
              >
                {currentQuestion.hint}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <button
          disabled={!selectedOption}
          onClick={handleNext}
          className={`group flex w-full items-center justify-center gap-2 rounded-2xl px-8 py-3 font-bold transition-all sm:w-auto md:px-12 md:py-4 ${
            selectedOption
              ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/30 hover:bg-indigo-500"
              : "cursor-not-allowed bg-secondary text-muted-foreground/30"
          }`}
        >
          <span className="text-sm md:text-base">
            {!showRationale
              ? "Check Answer"
              : currentIdx === quiz.questions.length - 1
                ? "Finish Quiz"
                : "Next Question"}
          </span>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1 md:h-5 md:w-5" />
        </button>
      </div>
    </div>
  )
}
