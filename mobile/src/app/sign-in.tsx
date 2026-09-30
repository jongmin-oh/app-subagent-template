import { View, Text, StyleSheet } from "react-native";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { useAuth } from "@/api/auth";
import { colors, spacing, typography } from "@/theme";

export default function SignIn() {
  const { signIn } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Text style={styles.title}>{"다시 만나서\n반가워요"}</Text>
        <Text style={styles.sub}>계정에 로그인하세요</Text>
      </View>
      <GoogleSigninButton accessibilityLabel="Google로 로그인" onPress={signIn} style={styles.google} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing["3xl"],
    backgroundColor: colors.background,
  },
  head: { gap: spacing.xs },
  title: { ...typography.title1, color: colors.text },
  sub: { ...typography.body1, color: colors.textSecondary },
  google: { alignSelf: "stretch" },
});
