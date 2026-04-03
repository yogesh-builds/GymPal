import { Workout } from "../store/workoutStore";
import db from "./database";

// ─── Save a completed workout ───────────────────────────────────────────────
export async function saveWorkout(workout: Workout): Promise<number> {
  const result = await db.runAsync(
    "INSERT INTO workouts (name, date, notes) VALUES (?, ?, ?)",
    [workout.name, workout.date, ""],
  );
  const workoutId = result.lastInsertRowId;

  for (const exercise of workout.exercises) {
    const exResult = await db.runAsync(
      "INSERT INTO exercises (workout_id, name, muscle_group, order_index) VALUES (?, ?, ?, ?)",
      [
        workoutId,
        exercise.name,
        exercise.muscleGroup,
        workout.exercises.indexOf(exercise),
      ],
    );
    const exerciseId = exResult.lastInsertRowId;

    for (const set of exercise.sets) {
      await db.runAsync(
        "INSERT INTO sets (exercise_id, set_number, weight, reps, is_done, notes) VALUES (?, ?, ?, ?, ?, ?)",
        [
          exerciseId,
          set.setNumber,
          set.weight,
          set.reps,
          set.isDone ? 1 : 0,
          set.notes || "",
        ],
      );
    }
  }

  return workoutId;
}

// ─── Get all past workouts (summary list) ───────────────────────────────────
export async function getAllWorkouts(): Promise<any[]> {
  const workouts = await db.getAllAsync(
    "SELECT * FROM workouts ORDER BY date DESC",
  );
  return workouts;
}

// ─── Get a single workout with all exercises and sets ───────────────────────
export async function getWorkoutById(workoutId: number): Promise<any> {
  const workout = await db.getFirstAsync(
    "SELECT * FROM workouts WHERE id = ?",
    [workoutId],
  );
  if (!workout) return null;

  const exercises = await db.getAllAsync(
    "SELECT * FROM exercises WHERE workout_id = ? ORDER BY order_index",
    [workoutId],
  );

  for (const exercise of exercises as any[]) {
    exercise.sets = await db.getAllAsync(
      "SELECT * FROM sets WHERE exercise_id = ? ORDER BY set_number",
      [exercise.id],
    );
  }

  return { ...workout, exercises };
}

// ─── Get personal record for an exercise ────────────────────────────────────
export async function getPersonalRecord(exerciseName: string): Promise<any> {
  const pr = await db.getFirstAsync(
    `SELECT s.weight, s.reps, w.date
     FROM sets s
     JOIN exercises e ON s.exercise_id = e.id
     JOIN workouts w ON e.workout_id = w.id
     WHERE e.name = ? AND s.is_done = 1
     ORDER BY s.weight DESC, s.reps DESC
     LIMIT 1`,
    [exerciseName],
  );
  return pr;
}

// ─── Get all PRs across all exercises ───────────────────────────────────────
export async function getAllPersonalRecords(): Promise<any[]> {
  const prs = await db.getAllAsync(
    `SELECT e.name, MAX(s.weight) as maxWeight, w.date
     FROM sets s
     JOIN exercises e ON s.exercise_id = e.id
     JOIN workouts w ON e.workout_id = w.id
     WHERE s.is_done = 1
     GROUP BY e.name
     ORDER BY maxWeight DESC`,
  );
  return prs;
}

// ─── Get last session data for an exercise (for progressive overload) ────────
export async function getLastSession(exerciseName: string): Promise<any[]> {
  const lastWorkout = await db.getFirstAsync(
    `SELECT w.id FROM workouts w
     JOIN exercises e ON e.workout_id = w.id
     WHERE e.name = ?
     ORDER BY w.date DESC
     LIMIT 1`,
    [exerciseName],
  );
  if (!lastWorkout) return [];

  const sets = await db.getAllAsync(
    `SELECT s.* FROM sets s
     JOIN exercises e ON s.exercise_id = e.id
     WHERE e.name = ? AND e.workout_id = ?
     ORDER BY s.set_number`,
    [exerciseName, (lastWorkout as any).id],
  );
  return sets;
}

// ─── Get weekly volume (last 7 days) ─────────────────────────────────────────
export async function getWeeklyVolume(): Promise<any[]> {
  const volume = await db.getAllAsync(
    `SELECT 
       DATE(w.date) as day,
       SUM(s.weight * s.reps) as totalVolume
     FROM sets s
     JOIN exercises e ON s.exercise_id = e.id
     JOIN workouts w ON e.workout_id = w.id
     WHERE s.is_done = 1
       AND w.date >= DATE('now', '-7 days')
     GROUP BY DATE(w.date)
     ORDER BY day ASC`,
  );
  return volume;
}

// ─── Get volume per muscle group this week ───────────────────────────────────
export async function getMuscleGroupVolume(): Promise<any[]> {
  const volume = await db.getAllAsync(
    `SELECT 
       e.muscle_group,
       SUM(s.weight * s.reps) as totalVolume
     FROM sets s
     JOIN exercises e ON s.exercise_id = e.id
     JOIN workouts w ON e.workout_id = w.id
     WHERE s.is_done = 1
       AND w.date >= DATE('now', '-7 days')
     GROUP BY e.muscle_group
     ORDER BY totalVolume DESC`,
  );
  return volume;
}

// ─── Body stats ──────────────────────────────────────────────────────────────
export async function saveBodyStat(
  weight: number,
  notes: string = "",
): Promise<void> {
  await db.runAsync(
    "INSERT INTO body_stats (date, weight, notes) VALUES (?, ?, ?)",
    [new Date().toISOString(), weight, notes],
  );
}

export async function getBodyStats(): Promise<any[]> {
  const stats = await db.getAllAsync(
    "SELECT * FROM body_stats ORDER BY date DESC LIMIT 30",
  );
  return stats;
}

// ─── Measurements ────────────────────────────────────────────────────────────
export async function saveMeasurement(data: {
  chest?: number;
  waist?: number;
  hips?: number;
  left_arm?: number;
  right_arm?: number;
  left_thigh?: number;
  right_thigh?: number;
}): Promise<void> {
  await db.runAsync(
    `INSERT INTO measurements 
     (date, chest, waist, hips, left_arm, right_arm, left_thigh, right_thigh) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      new Date().toISOString(),
      data.chest || 0,
      data.waist || 0,
      data.hips || 0,
      data.left_arm || 0,
      data.right_arm || 0,
      data.left_thigh || 0,
      data.right_thigh || 0,
    ],
  );
}

export async function getMeasurements(): Promise<any[]> {
  const measurements = await db.getAllAsync(
    "SELECT * FROM measurements ORDER BY date DESC LIMIT 10",
  );
  return measurements;
}
