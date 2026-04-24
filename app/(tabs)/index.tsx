import { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, Alert, Dimensions
} from 'react-native';
import { useWorkoutStore } from '../../store/workoutStore';
import { saveWorkout } from '../../db/queries';
import ExerciseCard from '../../components/ExerciseCard';
import ExercisePicker from '../../components/ExercisePicker';

const { width } = Dimensions.get('window');

const WORKOUT_TEMPLATES = [
  { name: 'Push Day', emoji: '💪', color: '#E55A2B', light: '#fff3ee', muscles: 'Chest · Shoulders · Triceps' },
  { name: 'Pull Day', emoji: '🔄', color: '#3B82F6', light: '#eff6ff', muscles: 'Back · Biceps · Forearms' },
  { name: 'Leg Day', emoji: '🦵', color: '#8B5CF6', light: '#f5f3ff', muscles: 'Quads · Hamstrings · Glutes' },
  { name: 'Upper Body', emoji: '⬆️', color: '#F59E0B', light: '#fffbeb', muscles: 'Chest · Back · Arms' },
  { name: 'Full Body', emoji: '🏋️', color: '#10B981', light: '#ecfdf5', muscles: 'All Muscle Groups' },
  { name: 'Custom', emoji: '✏️', color: '#6B7280', light: '#f9fafb', muscles: 'Your Own Plan' },
];

export default function TodayScreen() {
  const {
    activeWorkout, isWorkoutActive,
    restTimerSeconds, isTimerRunning,
    startWorkout, finishWorkout, cancelWorkout, tickTimer, addExercise,
  } = useWorkoutStore();

  const [workoutDuration, setWorkoutDuration] = useState(0);
  const durationRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isWorkoutActive) {
      durationRef.current = setInterval(() => setWorkoutDuration(d => d + 1), 1000);
    } else {
      if (durationRef.current) clearInterval(durationRef.current);
      setWorkoutDuration(0);
    }
    return () => { if (durationRef.current) clearInterval(durationRef.current); };
  }, [isWorkoutActive]);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => tickTimer(), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const [showPicker, setShowPicker] = useState(false);

  const handleFinishWorkout = async () => {
    Alert.alert(
      'Finish Workout? 💪',
      `You trained for ${formatTime(workoutDuration)}. Great work!`,
      [
        { text: 'Keep Going', style: 'cancel' },
        {
          text: 'Finish', onPress: async () => {
            const finished = finishWorkout();
            if (finished) await saveWorkout(finished);
          }
        }
      ]
    );
  };

  const handleCancelWorkout = () => {
    Alert.alert(
      'Cancel Workout?',
      'All progress will be lost.',
      [
        { text: 'Keep Going', style: 'cancel' },
        { text: 'Cancel', style: 'destructive', onPress: cancelWorkout }
      ]
    );
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning 🌅';
    if (h < 17) return 'Good afternoon ☀️';
    return 'Good evening 🌙';
  };

  // ── No active workout
  if (!isWorkoutActive) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Hero header */}
          <View style={styles.hero}>
            <View style={styles.heroTop}>
              <View>
                <Text style={styles.greeting}>{greeting()}</Text>
                <Text style={styles.heroTitle}>Ready to{'\n'}train today?</Text>
              </View>
              <View style={styles.streakBadge}>
                <Text style={styles.streakFire}>🔥</Text>
                <Text style={styles.streakNum}>6</Text>
                <Text style={styles.streakLabel}>day streak</Text>
              </View>
            </View>
          </View>

          {/* Quick stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statVal}>4</Text>
              <Text style={styles.statLabel}>This week</Text>
            </View>
            <View style={[styles.statCard, styles.statCardMid]}>
              <Text style={styles.statVal}>12,400</Text>
              <Text style={styles.statLabel}>kg lifted</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statVal}>3</Text>
              <Text style={styles.statLabel}>PRs this month</Text>
            </View>
          </View>

          {/* Templates */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Start a Workout</Text>
            <Text style={styles.sectionSub}>Pick a template to begin</Text>

            {WORKOUT_TEMPLATES.map(t => (
              <TouchableOpacity
                key={t.name}
                style={styles.templateRow}
                onPress={() => startWorkout(t.name)}
                activeOpacity={0.7}
              >
                <View style={[styles.templateIcon, { backgroundColor: t.light }]}>
                  <Text style={styles.templateEmoji}>{t.emoji}</Text>
                </View>
                <View style={styles.templateInfo}>
                  <Text style={styles.templateName}>{t.name}</Text>
                  <Text style={styles.templateMuscles}>{t.muscles}</Text>
                </View>
                <View style={[styles.templateArrow, { backgroundColor: t.light }]}>
                  <Text style={[styles.templateArrowText, { color: t.color }]}>›</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Active workout
  return (
    <SafeAreaView style={styles.container}>
      {/* Active header */}
      <View style={styles.activeHeader}>
        <View style={styles.activeHeaderLeft}>
          <View style={styles.activeDot} />
          <View>
            <Text style={styles.activeWorkoutName}>{activeWorkout?.name}</Text>
            <Text style={styles.activeDuration}>⏱ {formatTime(workoutDuration)}</Text>
          </View>
        </View>
        <View style={styles.activeHeaderRight}>
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelWorkout}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.finishBtn} onPress={handleFinishWorkout}>
            <Text style={styles.finishBtnText}>Finish 💪</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Rest timer */}
      {isTimerRunning && (
        <View style={styles.restTimerBar}>
          <View>
            <Text style={styles.restLabel}>Rest Timer</Text>
            <Text style={styles.restValue}>{formatTime(restTimerSeconds)}</Text>
          </View>
          <View style={styles.restRight}>
            <Text style={styles.restHint}>Next set in...</Text>
            <View style={styles.restDots}>
              {[60, 90, 120].map(s => (
                <TouchableOpacity key={s} style={styles.restQuick}>
                  <Text style={styles.restQuickText}>{s}s</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Exercise list */}
      {/* Exercise list */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 16 }}>
          {activeWorkout?.exercises.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🏋️</Text>
              <Text style={styles.emptyTitle}>No exercises yet</Text>
              <Text style={styles.emptySub}>Add your first exercise below</Text>
            </View>
          )}
          {activeWorkout?.exercises.map(ex => (
            <ExerciseCard
              key={ex.id}
              exerciseId={ex.id}
              name={ex.name}
              muscleGroup={ex.muscleGroup}
              sets={ex.sets}
            />
          ))}
        </View>
      </ScrollView>

      {/* Exercise picker modal */}
      <ExercisePicker
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={(exerciseId, name, muscleGroup) => {
          addExercise(exerciseId, name, muscleGroup);
        }}
      />

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowPicker(true)}>
          <Text style={styles.addBtnText}>+ Add Exercise</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  // Hero
  hero: {
    backgroundColor: '#1a1a1a', paddingHorizontal: 20,
    paddingTop: 24, paddingBottom: 28,
  },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { fontSize: 14, color: '#888', marginBottom: 6 },
  heroTitle: { fontSize: 32, fontWeight: '800', color: '#fff', lineHeight: 38 },
  streakBadge: {
    backgroundColor: '#2a2a2a', borderRadius: 16,
    padding: 14, alignItems: 'center', minWidth: 80,
  },
  streakFire: { fontSize: 22 },
  streakNum: { fontSize: 24, fontWeight: '800', color: '#F59E0B', marginTop: 2 },
  streakLabel: { fontSize: 10, color: '#888', marginTop: 2 },

  // Stats
  statsRow: {
    flexDirection: 'row', backgroundColor: '#fff',
    marginHorizontal: 0, borderBottomWidth: 0.5, borderBottomColor: '#eee',
  },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statCardMid: { borderLeftWidth: 0.5, borderRightWidth: 0.5, borderColor: '#eee' },
  statVal: { fontSize: 20, fontWeight: '700', color: '#1a1a1a' },
  statLabel: { fontSize: 11, color: '#888', marginTop: 2, textAlign: 'center' },

  // Templates
  section: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  sectionSub: { fontSize: 13, color: '#888', marginBottom: 16 },
  templateRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 14, padding: 14, marginBottom: 10,
    borderWidth: 0.5, borderColor: '#eee',
  },
  templateIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  templateEmoji: { fontSize: 22 },
  templateInfo: { flex: 1, marginLeft: 14 },
  templateName: { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  templateMuscles: { fontSize: 12, color: '#888', marginTop: 2 },
  templateArrow: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  templateArrowText: { fontSize: 22, fontWeight: '300', marginTop: -2 },

  // Active header
  activeHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#1a1a1a', paddingHorizontal: 16, paddingVertical: 14,
  },
  activeHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  activeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },
  activeWorkoutName: { fontSize: 16, fontWeight: '700', color: '#fff' },
  activeDuration: { fontSize: 12, color: '#888', marginTop: 2 },
  activeHeaderRight: { flexDirection: 'row', gap: 8 },
  cancelBtn: {
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 8, borderWidth: 0.5, borderColor: '#444',
  },
  cancelBtnText: { fontSize: 13, color: '#888', fontWeight: '500' },
  finishBtn: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 8, backgroundColor: '#E55A2B',
  },
  finishBtnText: { fontSize: 13, color: '#fff', fontWeight: '700' },

  // Rest timer
  restTimerBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#fff3ee', paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 0.5, borderBottomColor: '#ffd5c2',
  },
  restLabel: { fontSize: 11, color: '#E55A2B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  restValue: { fontSize: 28, fontWeight: '800', color: '#E55A2B', fontVariant: ['tabular-nums'] },
  restRight: { alignItems: 'flex-end' },
  restHint: { fontSize: 11, color: '#888', marginBottom: 6 },
  restDots: { flexDirection: 'row', gap: 6 },
  restQuick: {
    backgroundColor: '#fff', borderRadius: 6, paddingHorizontal: 10,
    paddingVertical: 4, borderWidth: 0.5, borderColor: '#ffd5c2',
  },
  restQuickText: { fontSize: 12, color: '#E55A2B', fontWeight: '600' },

  // Empty state
  scrollView: { flex: 1 },
  emptyState: { alignItems: 'center', paddingVertical: 80 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#ccc', marginBottom: 6 },
  emptySub: { fontSize: 14, color: '#bbb' },

  // Bottom
  bottomBar: {
    padding: 16, backgroundColor: '#fff',
    borderTopWidth: 0.5, borderTopColor: '#eee',
  },
  addBtn: {
    backgroundColor: '#1a1a1a', borderRadius: 14,
    padding: 16, alignItems: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
});