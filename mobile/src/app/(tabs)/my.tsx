import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/api/auth";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { colors, gradients, radius, spacing, touchTarget, typography } from "@/theme";

const settings = [
  { key: "push", label: "푸시 알림", icon: "bell" },
  { key: "sound", label: "효과음", icon: "volume-2" },
  { key: "face", label: "생체 인증 잠금", icon: "lock" },
] as const;

export default function My() {
  const { user, signOut } = useAuth();
  // ponytail: 로컬 state만. 설정 저장 API 생기면 연동
  const [set, setSet] = useState({ push: true, sound: false, face: true });
  const [modal, setModal] = useState(false);

  return (
    <View style={styles.flex}>
      <Screen>
        <Text style={styles.title}>MY</Text>
        <View style={styles.profile}>
          <LinearGradient colors={gradients.brand} style={styles.avatar}>
            <Text style={styles.initial}>{user?.name.slice(0, 1)}</Text>
          </LinearGradient>
          <View>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.caption}>{user?.email}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.overline}>알림 및 환경</Text>
          {settings.map((s) => {
            const on = set[s.key];
            return (
              <Pressable
                key={s.key}
                accessibilityRole="switch"
                accessibilityState={{ checked: on }}
                onPress={() => setSet({ ...set, [s.key]: !on })}
                style={styles.setting}
              >
                <Feather name={s.icon} size={20} color={colors.textSecondary} />
                <Text style={[styles.body, styles.flex]}>{s.label}</Text>
                <LinearGradient
                  colors={on ? gradients.brand : [colors.lineStrong, colors.lineStrong]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.track, on && styles.trackOn]}
                >
                  <View style={styles.thumb} />
                </LinearGradient>
              </Pressable>
            );
          })}
        </View>

        <Pressable accessibilityRole="button" onPress={() => setModal(true)} style={styles.logout}>
          <Text style={styles.danger}>로그아웃</Text>
        </Pressable>
      </Screen>

      <Modal visible={modal} transparent animationType="fade" onRequestClose={() => setModal(false)}>
        <View style={styles.dim}>
          <View style={styles.modal}>
            <Text style={styles.name}>로그아웃할까요?</Text>
            <Text style={styles.sub}>다시 로그인하면 모든 데이터를 그대로 이어서 쓸 수 있어요.</Text>
            <View style={styles.buttons}>
              <Button title="취소" variant="secondary" onPress={() => setModal(false)} />
              <Button title="로그아웃" variant="danger" onPress={signOut} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  title: { ...typography.title1, color: colors.text },
  profile: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  avatar: { width: 56, height: 56, borderRadius: radius.full, alignItems: "center", justifyContent: "center" },
  initial: { ...typography.title2, color: colors.white },
  name: { ...typography.title3, color: colors.text },
  caption: { ...typography.caption, color: colors.textTertiary },
  card: {
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.raised,
    borderWidth: 1,
    borderColor: colors.line,
  },
  overline: { ...typography.overline, color: colors.textTertiary, marginBottom: spacing.xs },
  setting: { flexDirection: "row", alignItems: "center", gap: spacing.sm, minHeight: touchTarget },
  body: { ...typography.body1, color: colors.text },
  track: { width: 48, height: 28, borderRadius: radius.full, padding: spacing["2xs"] },
  trackOn: { alignItems: "flex-end" },
  thumb: { width: 20, height: 20, borderRadius: radius.full, backgroundColor: colors.white },
  logout: { minHeight: touchTarget, alignItems: "center", justifyContent: "center" },
  danger: { ...typography.body1, color: colors.danger },
  dim: { flex: 1, justifyContent: "center", padding: spacing.xl, backgroundColor: colors.dim },
  modal: {
    gap: spacing.sm,
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.modal,
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  sub: { ...typography.body2, color: colors.textSecondary },
  buttons: { flexDirection: "row", gap: spacing.xs, marginTop: spacing.sm },
});
