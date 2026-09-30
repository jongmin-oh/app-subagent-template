import { Pressable, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, gradients, radius, spacing, typography } from "@/theme";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
};

export function Button({ title, onPress, variant = "primary", disabled }: Props) {
  const label = (
    <Text style={[styles.label, { color: disabled ? colors.textTertiary : colors.white }]}>{title}</Text>
  );
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={[styles.base, variant === "secondary" && styles.secondary, variant === "danger" && styles.danger, disabled && styles.disabled]}
    >
      {variant === "primary" && !disabled ? (
        <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fill}>
          {label}
        </LinearGradient>
      ) : (
        label
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { flex: 1, height: 52, borderRadius: radius.md, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  fill: { alignSelf: "stretch", flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.md },
  secondary: { backgroundColor: colors.overlay, borderWidth: 1, borderColor: colors.lineStrong },
  danger: { backgroundColor: colors.danger },
  disabled: { backgroundColor: colors.overlay },
  label: { ...typography.body1, fontFamily: "Pretendard-SemiBold" },
});
