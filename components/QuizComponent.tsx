"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronRight, CheckCircle2, Lightbulb, Info } from "lucide-react";

interface Option {
  label: string;
  text: string;
  isCorrect: boolean;
  rationale: string;
}

interface Question {
  id: string;
  question: string;
  options: Option[]; 
  correctAnswer: string;
  hint?: string | null;
}

interface Quiz {
  title: string;
  totalQuestions: number;
  questions: Question[];
}

interface QuizComponentProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
  onCancel: () => void;
}

export const QuizComponent = ({ quiz, onComplete, onCancel }: QuizComponentProps) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // label (e.g., "A")
  const [answers, setAnswers] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [showRationale, setShowRationale] = useState(false);

  const currentQuestion = quiz.questions[currentIdx];
  const options = currentQuestion.options || [];

  const handleSelect = (label: string) => {
    if (showRationale) return;
    setSelectedOption(label);
  };

  const handleNext = () => {
    if (!selectedOption) return;

    if (!showRationale) {
      setShowRationale(true);
      return;
    }

    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    setSelectedOption(null);
    setShowHint(false);
    setShowRationale(false);

    if (currentIdx < quiz.questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Calculate score
      const correctCount = quiz.questions.reduce((acc, q, idx) => {
        // Find the correct label
        const correctLabel = q.correctAnswer || q.options.find(o => o.isCorrect)?.label;
        return acc + (newAnswers[idx] === correctLabel ? 1 : 0);
      }, 0);
      const scorePercentage = Math.round((correctCount / quiz.questions.length) * 100);
      onComplete(scorePercentage);
    }
  };

  const selectedOptionData = options.find(o => o.label === selectedOption);
  const isCorrect = selectedOptionData?.label === currentQuestion.correctAnswer || selectedOptionData?.isCorrect;

  return (
    <div className="glass-card flex flex-col min-h-[600px] shadow-2xl shadow-indigo-500/10">
      {/* Quiz Header */}
      <div className="p-8 border-b border-indigo-100 flex items-center justify-between bg-indigo-50/50">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600/20 p-3 rounded-2xl border border-indigo-500/30">
            <HelpCircle className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-bold text-xl">{quiz.title}</h3>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-xs uppercase tracking-widest font-bold text-indigo-400">Step {currentIdx + 1}</span>
               <span className="h-1 w-1 rounded-full bg-indigo-200" />
               <span className="text-sm text-muted-foreground">of {quiz.totalQuestions} questions</span>
            </div>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="text-sm font-bold text-muted-foreground/60 hover:text-indigo-600 transition-colors px-4 py-2 rounded-xl hover:bg-indigo-50"
        >
          Quit Quiz
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-indigo-50 overflow-hidden">
        <motion.div
          className="h-full bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.8)]"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIdx + 1) / quiz.totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Content */}
      <div className="flex-1 p-8 md:p-16 space-y-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              {currentQuestion.question}
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {options.map((option, idx) => (
                <button
                  key={idx}
                  disabled={showRationale}
                  onClick={() => handleSelect(option.label)}
                  className={`relative p-6 rounded-2xl text-left transition-all border group ${
                    selectedOption === option.label
                      ? showRationale 
                        ? (option.isCorrect || option.label === currentQuestion.correctAnswer)
                          ? "bg-green-500/20 border-green-500/50 shadow-lg shadow-green-500/10"
                          : "bg-red-500/20 border-red-500/50 shadow-lg shadow-red-500/10"
                        : "bg-indigo-600 border-indigo-400 text-white shadow-xl shadow-indigo-500/20 scale-[1.02]"
                      : showRationale && (option.isCorrect || option.label === currentQuestion.correctAnswer)
                        ? "bg-green-500/10 border-green-500/30"
                        : "bg-secondary/50 border-border hover:border-indigo-200 hover:bg-indigo-50/50"
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-all ${
                      selectedOption === option.label 
                        ? "bg-white text-indigo-600 shadow-lg" 
                        : "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200"
                    }`}>
                      {option.label}
                    </div>
                    <span className="font-semibold text-lg">{option.text}</span>
                  </div>
                  
                  {showRationale && (option.isCorrect || option.label === currentQuestion.correctAnswer) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -right-2 -top-2 bg-green-500 text-black p-1 rounded-full"
                    >
                      <CheckCircle2 className="h-5 w-5" />
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
              className={`p-6 rounded-2xl border flex items-start gap-4 ${
                isCorrect ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"
              }`}
            >
              <div className={`p-2 rounded-xl ${isCorrect ? "bg-green-500/20" : "bg-red-500/20"}`}>
                <Info className={`h-5 w-5 ${isCorrect ? "text-green-400" : "text-red-400"}`} />
              </div>
              <div className="space-y-1">
                <div className={`font-bold uppercase tracking-widest text-xs ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                  {isCorrect ? "Correct Explanation" : "Wait, Why?"}
                </div>
                <p className="text-foreground/80 leading-relaxed italic">
                  {selectedOptionData?.rationale || (options.find(o => o.isCorrect || o.label === currentQuestion.correctAnswer)?.rationale)}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-8 border-t border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-6 bg-indigo-50/50">
        <div>
          {currentQuestion.hint && !showRationale && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 px-4 py-2 rounded-xl"
            >
              <Lightbulb className="h-4 w-4" />
              {showHint ? "Hide Hint" : "Need a Hint?"}
            </button>
          )}
          <AnimatePresence>
            {showHint && !showRationale && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-muted-foreground mt-3 italic max-w-md pl-4 border-l-2 border-indigo-500/50"
              >
                {currentQuestion.hint}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <button
          disabled={!selectedOption}
          onClick={handleNext}
          className={`flex items-center gap-2 px-12 py-4 rounded-2xl font-bold transition-all w-full sm:w-auto justify-center group ${
            selectedOption
              ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-500/30"
              : "bg-secondary text-muted-foreground/30 cursor-not-allowed"
          }`}
        >
          {!showRationale ? "Check Answer" : (currentIdx === quiz.questions.length - 1 ? "Finish Quiz" : "Next Question")}
          <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
