import { View, StyleSheet } from "react-native";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { useAuth } from "@/api/auth";
import { colors } from "@/theme";

export default function SignIn() {
  const { signIn } = useAuth();

  return (
    <View style={styles.container}>
      <GoogleSigninButton accessibilityLabel="Google로 로그인" onPress={signIn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});
