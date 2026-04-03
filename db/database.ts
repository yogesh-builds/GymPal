import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("gympal.db");

export async function initDatabase() {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      date TEXT NOT NULL,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workout_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      muscle_group TEXT,
      order_index INTEGER,
      FOREIGN KEY (workout_id) REFERENCES workouts(id)
    );

    CREATE TABLE IF NOT EXISTS sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise_id INTEGER NOT NULL,
      set_number INTEGER,
      weight REAL,
      reps INTEGER,
      is_done INTEGER DEFAULT 0,
      rpe REAL,
      notes TEXT,
      FOREIGN KEY (exercise_id) REFERENCES exercises(id)
    );

    CREATE TABLE IF NOT EXISTS body_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      weight REAL,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS measurements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      chest REAL, waist REAL, hips REAL,
      left_arm REAL, right_arm REAL,
      left_thigh REAL, right_thigh REAL
    );
  `);
}

export default db;
