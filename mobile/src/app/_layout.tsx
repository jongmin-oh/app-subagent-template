import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { AuthProvider, useAuth } from "@/api/auth";
import { fonts } from "@/theme";

function RootStack() {
  const { user, loading } = useAuth();
  if (loading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts(fonts);
  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <RootStack />
    </AuthProvider>
  );
}
