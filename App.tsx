import { useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

type Task = {
  id: string;
  text: string;
  done: boolean;
};

const INITIAL_TASKS: Task[] = [
  { id: '1', text: 'Buy groceries', done: false },
  { id: '2', text: 'Walk the dog', done: true },
  { id: '3', text: 'Read 20 pages', done: false },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [input, setInput] = useState('');

  const addTask = () => {
    const text = input.trim();
    if (!text) return;
    setTasks((prev) => [
      { id: Date.now().toString(), text, done: false },
      ...prev,
    ]);
    setInput('');
    Keyboard.dismiss();
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const remaining = tasks.filter((t) => !t.done).length;

  const renderItem = ({ item }: { item: Task }) => (
    <Pressable
      onPress={() => toggleTask(item.id)}
      onLongPress={() => deleteTask(item.id)}
      delayLongPress={500}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: item.done }}
      accessibilityLabel={`${item.text}, ${item.done ? 'done' : 'not done'}. Tap to toggle, long-press to delete.`}
      style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
    >
      <View style={[styles.checkbox, item.done && styles.checkboxDone]}>
        {item.done && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text
        style={[styles.itemText, item.done && styles.itemTextDone]}
        numberOfLines={2}
      >
        {item.text}
      </Text>
      <Pressable
        onPress={() => deleteTask(item.id)}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel={`Delete ${item.text}`}
        style={({ pressed }) => [
          styles.deleteButton,
          pressed && styles.deleteButtonPressed,
        ]}
      >
        <Text style={styles.deleteText}>×</Text>
      </Pressable>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.title}>My Tasks</Text>
          <Text style={styles.subtitle}>
            {tasks.length === 0
              ? 'No tasks yet'
              : remaining === 0
                ? 'All done 🎉'
                : `${remaining} of ${tasks.length} remaining`}
          </Text>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={addTask}
            placeholder="Add a task..."
            placeholderTextColor="#9CA3AF"
            returnKeyType="done"
            blurOnSubmit={false}
            accessibilityLabel="New task input"
          />
          <Pressable
            onPress={addTask}
            disabled={!input.trim()}
            accessibilityRole="button"
            accessibilityLabel="Add task"
            style={({ pressed }) => [
              styles.addButton,
              !input.trim() && styles.addButtonDisabled,
              pressed && input.trim() && styles.addButtonPressed,
            ]}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
        </View>

        <FlatList
          data={tasks}
          keyExtractor={(t) => t.id}
          renderItem={renderItem}
          contentContainerStyle={
            tasks.length === 0 ? styles.emptyList : styles.list
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Nothing here yet</Text>
              <Text style={styles.emptySubtitle}>
                Add your first task above to get started.
              </Text>
            </View>
          }
        />

        {tasks.length > 0 && (
          <Text style={styles.hint}>
            Tap a task to mark it done · Long-press to delete
          </Text>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#DC2626',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 0,
    backgroundColor: '#F9FAFB',
  },
  header: {
    marginHorizontal: -20,
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: '#DC2626',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addButton: {
    height: 48,
    minWidth: 72,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
    borderRadius: 12,
  },
  addButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  addButtonPressed: {
    opacity: 0.85,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    paddingBottom: 24,
    gap: 10,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#F0F1F4',
    minHeight: 56,
  },
  itemPressed: {
    backgroundColor: '#F3F4F6',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxDone: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  itemTextDone: {
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  deleteButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -8,
  },
  deleteButtonPressed: {
    opacity: 0.5,
  },
  deleteText: {
    fontSize: 24,
    color: '#D1D5DB',
    lineHeight: 24,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  hint: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    paddingVertical: 12,
  },
});
