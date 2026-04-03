export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "forearms"
  | "core"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves";

export type Exercise = {
  id: string;
  name: string;
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: "barbell" | "dumbbell" | "cable" | "machine" | "bodyweight";
  icon: string;
};

export const EXERCISES: Exercise[] = [
  // CHEST
  {
    id: "bench_press",
    name: "Bench Press",
    primaryMuscle: "chest",
    secondaryMuscles: ["triceps", "shoulders"],
    equipment: "barbell",
    icon: "🏋️",
  },
  {
    id: "incline_bench",
    name: "Incline Bench Press",
    primaryMuscle: "chest",
    secondaryMuscles: ["triceps", "shoulders"],
    equipment: "barbell",
    icon: "🏋️",
  },
  {
    id: "decline_bench",
    name: "Decline Bench Press",
    primaryMuscle: "chest",
    secondaryMuscles: ["triceps"],
    equipment: "barbell",
    icon: "🏋️",
  },
  {
    id: "db_flye",
    name: "Dumbbell Flye",
    primaryMuscle: "chest",
    secondaryMuscles: [],
    equipment: "dumbbell",
    icon: "🤸",
  },
  {
    id: "cable_crossover",
    name: "Cable Crossover",
    primaryMuscle: "chest",
    secondaryMuscles: [],
    equipment: "cable",
    icon: "🔄",
  },
  {
    id: "push_up",
    name: "Push Up",
    primaryMuscle: "chest",
    secondaryMuscles: ["triceps", "shoulders"],
    equipment: "bodyweight",
    icon: "💪",
  },

  // BACK
  {
    id: "deadlift",
    name: "Deadlift",
    primaryMuscle: "back",
    secondaryMuscles: ["hamstrings", "glutes", "forearms"],
    equipment: "barbell",
    icon: "⬆️",
  },
  {
    id: "barbell_row",
    name: "Barbell Row",
    primaryMuscle: "back",
    secondaryMuscles: ["biceps", "forearms"],
    equipment: "barbell",
    icon: "🔄",
  },
  {
    id: "pull_up",
    name: "Pull Up",
    primaryMuscle: "back",
    secondaryMuscles: ["biceps"],
    equipment: "bodyweight",
    icon: "🙆",
  },
  {
    id: "lat_pulldown",
    name: "Lat Pulldown",
    primaryMuscle: "back",
    secondaryMuscles: ["biceps"],
    equipment: "cable",
    icon: "⬇️",
  },
  {
    id: "seated_row",
    name: "Seated Cable Row",
    primaryMuscle: "back",
    secondaryMuscles: ["biceps", "forearms"],
    equipment: "cable",
    icon: "🚣",
  },
  {
    id: "db_row",
    name: "Dumbbell Row",
    primaryMuscle: "back",
    secondaryMuscles: ["biceps"],
    equipment: "dumbbell",
    icon: "🔄",
  },

  // SHOULDERS
  {
    id: "ohp",
    name: "Overhead Press",
    primaryMuscle: "shoulders",
    secondaryMuscles: ["triceps"],
    equipment: "barbell",
    icon: "🔼",
  },
  {
    id: "db_shoulder_press",
    name: "Dumbbell Shoulder Press",
    primaryMuscle: "shoulders",
    secondaryMuscles: ["triceps"],
    equipment: "dumbbell",
    icon: "🔼",
  },
  {
    id: "lateral_raise",
    name: "Lateral Raise",
    primaryMuscle: "shoulders",
    secondaryMuscles: [],
    equipment: "dumbbell",
    icon: "↔️",
  },
  {
    id: "front_raise",
    name: "Front Raise",
    primaryMuscle: "shoulders",
    secondaryMuscles: [],
    equipment: "dumbbell",
    icon: "⬆️",
  },
  {
    id: "face_pull",
    name: "Face Pull",
    primaryMuscle: "shoulders",
    secondaryMuscles: ["back"],
    equipment: "cable",
    icon: "🎯",
  },

  // BICEPS
  {
    id: "barbell_curl",
    name: "Barbell Curl",
    primaryMuscle: "biceps",
    secondaryMuscles: ["forearms"],
    equipment: "barbell",
    icon: "💪",
  },
  {
    id: "db_curl",
    name: "Dumbbell Curl",
    primaryMuscle: "biceps",
    secondaryMuscles: ["forearms"],
    equipment: "dumbbell",
    icon: "💪",
  },
  {
    id: "hammer_curl",
    name: "Hammer Curl",
    primaryMuscle: "biceps",
    secondaryMuscles: ["forearms"],
    equipment: "dumbbell",
    icon: "🔨",
  },
  {
    id: "preacher_curl",
    name: "Preacher Curl",
    primaryMuscle: "biceps",
    secondaryMuscles: [],
    equipment: "machine",
    icon: "💪",
  },

  // TRICEPS
  {
    id: "tricep_pushdown",
    name: "Tricep Pushdown",
    primaryMuscle: "triceps",
    secondaryMuscles: [],
    equipment: "cable",
    icon: "⬇️",
  },
  {
    id: "skull_crusher",
    name: "Skull Crusher",
    primaryMuscle: "triceps",
    secondaryMuscles: [],
    equipment: "barbell",
    icon: "💀",
  },
  {
    id: "overhead_tricep",
    name: "Overhead Tricep Extension",
    primaryMuscle: "triceps",
    secondaryMuscles: [],
    equipment: "dumbbell",
    icon: "🔼",
  },
  {
    id: "dip",
    name: "Dip",
    primaryMuscle: "triceps",
    secondaryMuscles: ["chest", "shoulders"],
    equipment: "bodyweight",
    icon: "⬇️",
  },

  // LEGS
  {
    id: "squat",
    name: "Squat",
    primaryMuscle: "quads",
    secondaryMuscles: ["glutes", "hamstrings", "core"],
    equipment: "barbell",
    icon: "🦵",
  },
  {
    id: "leg_press",
    name: "Leg Press",
    primaryMuscle: "quads",
    secondaryMuscles: ["glutes", "hamstrings"],
    equipment: "machine",
    icon: "🦵",
  },
  {
    id: "leg_extension",
    name: "Leg Extension",
    primaryMuscle: "quads",
    secondaryMuscles: [],
    equipment: "machine",
    icon: "🦵",
  },
  {
    id: "rdl",
    name: "Romanian Deadlift",
    primaryMuscle: "hamstrings",
    secondaryMuscles: ["glutes", "back"],
    equipment: "barbell",
    icon: "⬆️",
  },
  {
    id: "leg_curl",
    name: "Leg Curl",
    primaryMuscle: "hamstrings",
    secondaryMuscles: [],
    equipment: "machine",
    icon: "🦵",
  },
  {
    id: "hip_thrust",
    name: "Hip Thrust",
    primaryMuscle: "glutes",
    secondaryMuscles: ["hamstrings"],
    equipment: "barbell",
    icon: "🍑",
  },
  {
    id: "calf_raise",
    name: "Calf Raise",
    primaryMuscle: "calves",
    secondaryMuscles: [],
    equipment: "machine",
    icon: "🦶",
  },
  {
    id: "lunges",
    name: "Lunges",
    primaryMuscle: "quads",
    secondaryMuscles: ["glutes", "hamstrings"],
    equipment: "dumbbell",
    icon: "🚶",
  },

  // CORE
  {
    id: "plank",
    name: "Plank",
    primaryMuscle: "core",
    secondaryMuscles: [],
    equipment: "bodyweight",
    icon: "🧱",
  },
  {
    id: "crunch",
    name: "Crunch",
    primaryMuscle: "core",
    secondaryMuscles: [],
    equipment: "bodyweight",
    icon: "🔄",
  },
  {
    id: "leg_raise",
    name: "Leg Raise",
    primaryMuscle: "core",
    secondaryMuscles: [],
    equipment: "bodyweight",
    icon: "⬆️",
  },
  {
    id: "cable_crunch",
    name: "Cable Crunch",
    primaryMuscle: "core",
    secondaryMuscles: [],
    equipment: "cable",
    icon: "🔄",
  },
];

// Quick lookup by muscle group
export const getExercisesByMuscle = (muscle: MuscleGroup) =>
  EXERCISES.filter((e) => e.primaryMuscle === muscle);

// Quick lookup by id
export const getExerciseById = (id: string) =>
  EXERCISES.find((e) => e.id === id);
