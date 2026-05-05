import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProgressStore {
  completedChapters: string[]; // Array of chapter IDs
  quizScores: Record<string, number>; // chapterId -> score
  completeChapter: (chapterId: string) => void;
  setQuizScore: (chapterId: string, score: number) => void;
  isChapterCompleted: (chapterId: string) => boolean;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      completedChapters: [],
      quizScores: {},
      completeChapter: (chapterId: string) => {
        set((state) => ({
          completedChapters: state.completedChapters.includes(chapterId)
            ? state.completedChapters
            : [...state.completedChapters, chapterId],
        }));
      },
      setQuizScore: (chapterId: string, score: number) => {
        set((state) => ({
          quizScores: { ...state.quizScores, [chapterId]: score },
        }));
      },
      isChapterCompleted: (chapterId: string) => {
        return get().completedChapters.includes(chapterId);
      },
    }),
    {
      name: "edtech-progress",
    }
  )
);
