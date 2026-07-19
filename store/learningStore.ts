import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { UNITS } from "@/data/units";

// Mock progress: the first two lessons of every unit start out completed,
// so each language opens with a "few done, one in progress, rest locked" demo state.
const DEFAULT_COMPLETED_LESSON_IDS = UNITS.flatMap((unit) =>
  unit.lessonIds.slice(0, 2),
);

interface LearningState {
  xpToday: number;
  dailyGoal: number;
  streak: number;
  completedLessonIds: string[];
  addXP: (amount: number) => void;
  completeLesson: (lessonId: string) => void;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set) => ({
      xpToday: 15,
      dailyGoal: 20,
      streak: 12,
      completedLessonIds: DEFAULT_COMPLETED_LESSON_IDS,
      addXP: (amount) =>
        set((state) => ({
          xpToday: Math.max(0, Math.min(state.xpToday + amount, state.dailyGoal)),
        })),
      completeLesson: (lessonId) =>
        set((state) => ({
          completedLessonIds: state.completedLessonIds.includes(lessonId)
            ? state.completedLessonIds
            : [...state.completedLessonIds, lessonId],
        })),
    }),
    {
      // Bumped from "learning-storage" so the new mock-progress default
      // (see DEFAULT_COMPLETED_LESSON_IDS) takes effect on existing installs.
      name: "learning-storage-v2",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
