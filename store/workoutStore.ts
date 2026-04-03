import { create } from "zustand";

export type Set = {
  id: string;
  setNumber: number;
  weight: number;
  reps: number;
  isDone: boolean;
  notes?: string;
};

export type Exercise = {
  id: string;
  exerciseId: string;
  name: string;
  muscleGroup: string;
  sets: Set[];
};

export type Workout = {
  id: string;
  name: string;
  date: string;
  exercises: Exercise[];
  isActive: boolean;
  startTime?: number;
};

type WorkoutStore = {
  // Active workout state
  activeWorkout: Workout | null;
  isWorkoutActive: boolean;

  // Rest timer state
  restTimerSeconds: number;
  isTimerRunning: boolean;

  // Actions — workout
  startWorkout: (name: string) => void;
  finishWorkout: () => Workout | null;
  cancelWorkout: () => void;

  // Actions — exercises
  addExercise: (exerciseId: string, name: string, muscleGroup: string) => void;
  removeExercise: (exerciseId: string) => void;

  // Actions — sets
  addSet: (exerciseId: string) => void;
  updateSet: (
    exerciseId: string,
    setId: string,
    field: "weight" | "reps" | "notes",
    value: number | string,
  ) => void;
  toggleSetDone: (exerciseId: string, setId: string) => void;
  removeSet: (exerciseId: string, setId: string) => void;

  // Actions — timer
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tickTimer: () => void;
};

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  activeWorkout: null,
  isWorkoutActive: false,
  restTimerSeconds: 0,
  isTimerRunning: false,

  // — Workout actions
  startWorkout: (name) => {
    const workout: Workout = {
      id: generateId(),
      name,
      date: new Date().toISOString(),
      exercises: [],
      isActive: true,
      startTime: Date.now(),
    };
    set({ activeWorkout: workout, isWorkoutActive: true });
  },

  finishWorkout: () => {
    const { activeWorkout } = get();
    if (!activeWorkout) return null;
    const finished = { ...activeWorkout, isActive: false };
    set({
      activeWorkout: null,
      isWorkoutActive: false,
      restTimerSeconds: 0,
      isTimerRunning: false,
    });
    return finished;
  },

  cancelWorkout: () => {
    set({
      activeWorkout: null,
      isWorkoutActive: false,
      restTimerSeconds: 0,
      isTimerRunning: false,
    });
  },

  // — Exercise actions
  addExercise: (exerciseId, name, muscleGroup) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const newExercise: Exercise = {
      id: generateId(),
      exerciseId,
      name,
      muscleGroup,
      sets: [
        { id: generateId(), setNumber: 1, weight: 0, reps: 0, isDone: false },
        { id: generateId(), setNumber: 2, weight: 0, reps: 0, isDone: false },
        { id: generateId(), setNumber: 3, weight: 0, reps: 0, isDone: false },
      ],
    };

    set({
      activeWorkout: {
        ...activeWorkout,
        exercises: [...activeWorkout.exercises, newExercise],
      },
    });
  },

  removeExercise: (exerciseId) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;
    set({
      activeWorkout: {
        ...activeWorkout,
        exercises: activeWorkout.exercises.filter((e) => e.id !== exerciseId),
      },
    });
  },

  // — Set actions
  addSet: (exerciseId) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    set({
      activeWorkout: {
        ...activeWorkout,
        exercises: activeWorkout.exercises.map((ex) => {
          if (ex.id !== exerciseId) return ex;
          const lastSet = ex.sets[ex.sets.length - 1];
          return {
            ...ex,
            sets: [
              ...ex.sets,
              {
                id: generateId(),
                setNumber: ex.sets.length + 1,
                weight: lastSet?.weight || 0,
                reps: lastSet?.reps || 0,
                isDone: false,
              },
            ],
          };
        }),
      },
    });
  },

  updateSet: (exerciseId, setId, field, value) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    set({
      activeWorkout: {
        ...activeWorkout,
        exercises: activeWorkout.exercises.map((ex) => {
          if (ex.id !== exerciseId) return ex;
          return {
            ...ex,
            sets: ex.sets.map((s) => {
              if (s.id !== setId) return s;
              return { ...s, [field]: value };
            }),
          };
        }),
      },
    });
  },

  toggleSetDone: (exerciseId, setId) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    set({
      activeWorkout: {
        ...activeWorkout,
        exercises: activeWorkout.exercises.map((ex) => {
          if (ex.id !== exerciseId) return ex;
          return {
            ...ex,
            sets: ex.sets.map((s) => {
              if (s.id !== setId) return s;
              return { ...s, isDone: !s.isDone };
            }),
          };
        }),
      },
    });

    // Auto start rest timer when a set is marked done
    const { resetTimer, startTimer } = get();
    resetTimer();
    startTimer();
  },

  removeSet: (exerciseId, setId) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    set({
      activeWorkout: {
        ...activeWorkout,
        exercises: activeWorkout.exercises.map((ex) => {
          if (ex.id !== exerciseId) return ex;
          return {
            ...ex,
            sets: ex.sets
              .filter((s) => s.id !== setId)
              .map((s, i) => ({ ...s, setNumber: i + 1 })),
          };
        }),
      },
    });
  },

  // — Timer actions
  startTimer: () => set({ isTimerRunning: true }),
  pauseTimer: () => set({ isTimerRunning: false }),
  resetTimer: () => set({ restTimerSeconds: 0, isTimerRunning: false }),
  tickTimer: () =>
    set((state) => ({ restTimerSeconds: state.restTimerSeconds + 1 })),
}));
