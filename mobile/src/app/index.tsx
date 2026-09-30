import { Button, Text, View, StyleSheet } from "react-native";
import { useAuth } from "@/api/auth";
import { colors, spacing } from "@/theme";

export default function Home() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{user?.name}</Text>
      <Text style={styles.text}>{user?.email}</Text>
      <Button title="로그아웃" color={colors.primary} onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  text: {
    color: colors.text,
  },
});
