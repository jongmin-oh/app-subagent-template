import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen } from "@/components/Screen";
import { useNotifications } from "@/components/Notifications";
import { useToast } from "@/components/Toast";
import { colors, radius, spacing, touchTarget, typography } from "@/theme";

export default function Activity() {
  const [notis, setNotis] = useNotifications();
  const [toast, showToast] = useToast();

  function readAll() {
    setNotis(notis.map((n) => ({ ...n, unread: false })));
    showToast("모두 읽음 처리했어요");
  }

  return (
    <View style={styles.flex}>
      <Screen>
        <View style={styles.row}>
          <Text style={styles.title}>활동</Text>
          <Pressable accessibilityRole="button" onPress={readAll} style={styles.readAll}>
            <Text style={styles.link}>모두 읽음</Text>
          </Pressable>
        </View>
        <View style={styles.list}>
          {notis.map((n) => (
            <Pressable
              key={n.id}
              onPress={() => setNotis(notis.map((x) => (x.id === n.id ? { ...x, unread: false } : x)))}
              style={[styles.item, n.unread && styles.unread]}
            >
              <Feather name={n.icon} size={20} color={colors.textBrand} />
              <View style={styles.flex}>
                <Text style={[styles.text, !n.unread && styles.read]}>{n.text}</Text>
                <Text style={styles.caption}>{n.time}</Text>
              </View>
              {n.unread && <View style={styles.dot} />}
            </Pressable>
          ))}
        </View>
      </Screen>
      {toast}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { ...typography.title1, color: colors.text },
  readAll: { minHeight: touchTarget, justifyContent: "center" },
  link: { ...typography.body2, color: colors.textBrand },
  list: { gap: spacing.xs },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  unread: { backgroundColor: colors.unreadTint, borderColor: colors.unreadLine },
  text: { ...typography.body2, color: colors.text },
  read: { color: colors.textSecondary },
  caption: { ...typography.caption, color: colors.textTertiary },
  dot: { width: spacing.xs, height: spacing.xs, borderRadius: radius.full, backgroundColor: colors.primary },
});
