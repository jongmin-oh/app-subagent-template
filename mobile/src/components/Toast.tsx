import { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius, spacing, typography } from "@/theme";

// 반환: [화면에 렌더할 토스트, 표시 함수]
export function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  function show(m: string) {
    clearTimeout(timer.current);
    setMsg(m);
    timer.current = setTimeout(() => setMsg(null), 2200);
  }

  const toast = msg ? (
    <SafeAreaView edges={["top"]} style={styles.wrap} pointerEvents="none">
      <View style={styles.toast}>
        <Text style={styles.text}>{msg}</Text>
      </View>
    </SafeAreaView>
  ) : null;

  return [toast, show] as const;
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", top: 0, left: spacing.lg, right: spacing.lg },
  toast: {
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.overlay,
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  text: { ...typography.body2, color: colors.text },
});
