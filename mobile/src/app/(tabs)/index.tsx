import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/api/auth";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { Screen } from "@/components/Screen";
import { useToast } from "@/components/Toast";
import { colors, radius, spacing, touchTarget, typography } from "@/theme";

const tags = {
  업무: [colors.brandTint, colors.violet[200]],
  건강: [colors.successTint, colors.success],
  개인: [colors.warningTint, colors.warning],
} as const;
type Tag = keyof typeof tags;

// ponytail: 로컬 mock. 할 일 API 생기면 교체
const initialTasks: { id: number; title: string; meta: string; tag: Tag; done: boolean }[] = [
  { id: 1, title: "디자인 리뷰 준비", meta: "오전 10:00", tag: "업무", done: true },
  { id: 2, title: "주간 회고 작성", meta: "오후 2:00", tag: "업무", done: false },
  { id: 3, title: "러닝 5km", meta: "오후 7:30", tag: "건강", done: false },
  { id: 4, title: "읽던 책 마무리", meta: "자기 전", tag: "개인", done: false },
];

export default function Home() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState(initialTasks);
  const [sheet, setSheet] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [newTag, setNewTag] = useState<Tag>("업무");
  const [toast, showToast] = useToast();

  const done = tasks.filter((t) => t.done).length;
  const progress = Math.round((done / Math.max(1, tasks.length)) * 100);
  const today = new Date().toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" });

  function addTask() {
    setTasks([...tasks, { id: Date.now(), title: newTask.trim(), meta: "오늘", tag: newTag, done: false }]);
    setNewTask("");
    setSheet(false);
    showToast("할 일이 추가됐어요");
  }

  return (
    <View style={styles.flex}>
      <Screen>
        <View>
          <Text style={styles.caption}>{today}</Text>
          <Text style={styles.title}>안녕하세요, {user?.name}님</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.cardTitle}>이번 주 목표</Text>
          </View>
          <Text style={styles.progress}>{progress}%</Text>
          <View style={styles.track}>
            <View style={[styles.bar, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.caption}>{done}개 완료 · 오늘 할 일을 체크해보세요</Text>
        </View>

        <View style={styles.list}>
          <View style={styles.row}>
            <Text style={styles.cardTitle}>오늘 할 일</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="할 일 추가" onPress={() => setSheet(true)} style={styles.plus}>
              <Feather name="plus" size={20} color={colors.textBrand} />
            </Pressable>
          </View>
          {tasks.map((t) => (
            <Pressable
              key={t.id}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: t.done }}
              onPress={() => setTasks(tasks.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))}
              style={styles.task}
            >
              <View style={[styles.box, t.done && styles.boxOn]}>
                {t.done && <Feather name="check" size={14} color={colors.white} />}
              </View>
              <View style={styles.flex}>
                <Text style={[styles.taskTitle, t.done && styles.taskDone]}>{t.title}</Text>
                <Text style={styles.caption}>{t.meta}</Text>
              </View>
              <Text style={[styles.tag, { backgroundColor: tags[t.tag][0], color: tags[t.tag][1] }]}>{t.tag}</Text>
            </Pressable>
          ))}
        </View>
      </Screen>

      <Modal visible={sheet} transparent animationType="slide" onRequestClose={() => setSheet(false)}>
        <Pressable style={styles.dim} onPress={() => setSheet(false)} />
        <View style={styles.sheet}>
          <Text style={styles.cardTitle}>할 일 추가</Text>
          <TextInput
            value={newTask}
            onChangeText={setNewTask}
            placeholder="무엇을 할까요?"
            placeholderTextColor={colors.textTertiary}
            style={styles.input}
            autoFocus
          />
          <View style={styles.chips}>
            {(Object.keys(tags) as Tag[]) /* Object.keys는 string[]을 반환하므로 키 타입으로 좁힘 */
              .map((tag) => (
                <Chip key={tag} label={tag} selected={newTag === tag} onPress={() => setNewTag(tag)} />
              ))}
          </View>
          <View style={styles.row}>
            <Button title="추가하기" onPress={addTask} disabled={!newTask.trim()} />
          </View>
        </View>
      </Modal>

      {toast}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  caption: { ...typography.caption, color: colors.textTertiary },
  title: { ...typography.title1, color: colors.text },
  card: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.raised,
    borderWidth: 1,
    borderColor: colors.glowLine,
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 24,
  },
  cardTitle: { ...typography.title3, color: colors.text },
  progress: { ...typography.display, color: colors.text },
  track: { height: spacing.xs, borderRadius: radius.full, backgroundColor: colors.line, overflow: "hidden" },
  bar: { height: "100%", backgroundColor: colors.primary },
  list: { gap: spacing.xs },
  plus: { width: touchTarget, height: touchTarget, alignItems: "center", justifyContent: "center" },
  task: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: radius.xs,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  boxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  taskTitle: { ...typography.body1, color: colors.text },
  taskDone: { color: colors.textTertiary, textDecorationLine: "line-through" },
  tag: {
    ...typography.caption,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing["2xs"],
    borderRadius: radius.xs,
    overflow: "hidden",
  },
  dim: { flex: 1, backgroundColor: colors.dim },
  sheet: {
    gap: spacing.md,
    padding: spacing.xl,
    paddingBottom: spacing["3xl"],
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    backgroundColor: colors.overlay,
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  input: {
    ...typography.body1,
    color: colors.text,
    minHeight: 52,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  chips: { flexDirection: "row", gap: spacing.xs },
});
