import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import { GoogleSignin, isSuccessResponse } from "@react-native-google-signin/google-signin";
import type { components } from "./schema";
import { getMe, loginWithGoogle } from "./client";

type User = components["schemas"]["User"];

const TOKEN_KEY = "access_token";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
});

type Auth = {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<Auth | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        const me = await getMe(token);
        // invalid/expired token -> drop it, show sign-in
        if (!me) await SecureStore.deleteItemAsync(TOKEN_KEY);
        setUser(me);
      }
      setLoading(false);
    })();
  }, []);

  async function signIn() {
    await GoogleSignin.hasPlayServices();
    const res = await GoogleSignin.signIn();
    // ponytail: cancelled or no idToken -> stay on sign-in screen
    if (!isSuccessResponse(res) || !res.data.idToken) return;
    const login = await loginWithGoogle(res.data.idToken);
    if (!login) return;
    const { access_token, user } = login;
    await SecureStore.setItemAsync(TOKEN_KEY, access_token);
    setUser(user);
  }

  async function signOut() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await GoogleSignin.signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): Auth {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("useAuth must be used inside AuthProvider");
  return auth;
}
