import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useWorkoutStore } from '../store/workoutStore';
import { Set } from '../store/workoutStore';

type Props = {
  exerciseId: string;
  name: string;
  muscleGroup: string;
  sets: Set[];
  lastSession?: { weight: number; reps: number }[];
};

export default function ExerciseCard({ exerciseId, name, muscleGroup, sets, lastSession = [] }: Props) {
  const { addSet, updateSet, toggleSetDone, removeSet, removeExercise } = useWorkoutStore();
  const [expanded, setExpanded] = useState(true);

  const totalVolume = sets.reduce((acc, s) => acc + (s.isDone ? s.weight * s.reps : 0), 0);
  const doneSets = sets.filter(s => s.isDone).length;

  const handleToggleDone = (setId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleSetDone(exerciseId, setId);
  };

  return (
    <View style={styles.card}>
      {/* Card header */}
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={() => setExpanded(e => !e)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.exerciseName}>{name}</Text>
          <Text style={styles.muscleGroup}>{muscleGroup}</Text>
        </View>
        <View style={styles.headerRight}>
          {totalVolume > 0 && (
            <View style={styles.volumeBadge}>
              <Text style={styles.volumeText}>{totalVolume}kg</Text>
            </View>
          )}
          <Text style={styles.setsInfo}>{doneSets}/{sets.length} sets</Text>
          <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.setsContainer}>
          {/* Column headers */}
          <View style={styles.colHeaders}>
            <Text style={[styles.colHeader, styles.colSet]}>SET</Text>
            <Text style={[styles.colHeader, styles.colPrev]}>PREV</Text>
            <Text style={[styles.colHeader, styles.colKg]}>KG</Text>
            <Text style={[styles.colHeader, styles.colReps]}>REPS</Text>
            <Text style={[styles.colHeader, styles.colDone]}></Text>
          </View>

          {/* Set rows */}
          {sets.map((set, index) => {
            const prev = lastSession[index];
            return (
              <View
                key={set.id}
                style={[styles.setRow, set.isDone && styles.setRowDone]}
              >
                <Text style={[styles.colSet, styles.setNum]}>{set.setNumber}</Text>

                {/* Previous session data */}
                <Text style={[styles.colPrev, styles.prevText]}>
                  {prev ? `${prev.weight}×${prev.reps}` : '—'}
                </Text>

                {/* Weight input */}
                <TextInput
                  style={[styles.colKg, styles.input, set.isDone && styles.inputDone]}
                  keyboardType="numeric"
                  value={set.weight > 0 ? String(set.weight) : ''}
                  placeholder="0"
                  placeholderTextColor="#ccc"
                  onChangeText={val => updateSet(exerciseId, set.id, 'weight', parseFloat(val) || 0)}
                  editable={!set.isDone}
                />

                {/* Reps input */}
                <TextInput
                  style={[styles.colReps, styles.input, set.isDone && styles.inputDone]}
                  keyboardType="numeric"
                  value={set.reps > 0 ? String(set.reps) : ''}
                  placeholder="0"
                  placeholderTextColor="#ccc"
                  onChangeText={val => updateSet(exerciseId, set.id, 'reps', parseInt(val) || 0)}
                  editable={!set.isDone}
                />

                {/* Done button */}
                <TouchableOpacity
                  style={[styles.colDone, styles.doneBtn, set.isDone && styles.doneBtnActive]}
                  onPress={() => handleToggleDone(set.id)}
                >
                  <Text style={[styles.doneBtnText, set.isDone && styles.doneBtnTextActive]}>✓</Text>
                </TouchableOpacity>
              </View>
            );
          })}

          {/* Add set + Remove exercise */}
          <View style={styles.cardFooter}>
            <TouchableOpacity style={styles.addSetBtn} onPress={() => addSet(exerciseId)}>
              <Text style={styles.addSetText}>+ Add Set</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.removeBtn} onPress={() => removeExercise(exerciseId)}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff', borderRadius: 16,
    marginBottom: 12, borderWidth: 0.5, borderColor: '#eee',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16,
  },
  headerLeft: { flex: 1 },
  exerciseName: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
  muscleGroup: { fontSize: 12, color: '#888', marginTop: 2, textTransform: 'capitalize' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  volumeBadge: { backgroundColor: '#fff3ee', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  volumeText: { fontSize: 12, color: '#E55A2B', fontWeight: '600' },
  setsInfo: { fontSize: 12, color: '#888' },
  chevron: { fontSize: 10, color: '#bbb' },

  // Sets
  setsContainer: { borderTopWidth: 0.5, borderTopColor: '#f0f0f0' },
  colHeaders: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 8,
    backgroundColor: '#fafafa',
  },
  colHeader: { fontSize: 10, fontWeight: '600', color: '#bbb', letterSpacing: 0.5 },
  setRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10,
    borderTopWidth: 0.5, borderTopColor: '#f5f5f5',
  },
  setRowDone: { backgroundColor: '#f9fdf9' },

  // Column widths
  colSet: { width: 32 },
  colPrev: { flex: 1 },
  colKg: { width: 64 },
  colReps: { width: 64 },
  colDone: { width: 36 },

  setNum: { fontSize: 13, fontWeight: '600', color: '#bbb' },
  prevText: { fontSize: 12, color: '#bbb' },

  input: {
    backgroundColor: '#f5f5f5', borderRadius: 8, padding: 8,
    fontSize: 15, fontWeight: '600', color: '#1a1a1a',
    textAlign: 'center', borderWidth: 0.5, borderColor: '#eee',
  },
  inputDone: { backgroundColor: '#f0faf0', color: '#10B981', borderColor: '#d1fae5' },

  doneBtn: {
    width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#f0f0f0', borderWidth: 0.5, borderColor: '#eee',
  },
  doneBtnActive: { backgroundColor: '#10B981', borderColor: '#10B981' },
  doneBtnText: { fontSize: 14, color: '#bbb', fontWeight: '700' },
  doneBtnTextActive: { color: '#fff' },

  // Footer
  cardFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 12, borderTopWidth: 0.5, borderTopColor: '#f0f0f0',
  },
  addSetBtn: { paddingVertical: 6, paddingHorizontal: 12 },
  addSetText: { fontSize: 14, color: '#E55A2B', fontWeight: '600' },
  removeBtn: { paddingVertical: 6, paddingHorizontal: 12 },
  removeText: { fontSize: 13, color: '#bbb' },
});