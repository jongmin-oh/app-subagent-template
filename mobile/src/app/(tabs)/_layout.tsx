import type { ColorValue } from "react-native";
import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { NotificationsProvider, useNotifications } from "@/components/Notifications";
import { colors, typography } from "@/theme";

type Icon = keyof typeof Feather.glyphMap;

function tab(title: string, icon: Icon) {
  return {
    title,
    tabBarIcon: ({ color, size }: { color: ColorValue; size: number }) => <Feather name={icon} color={color} size={size} />,
  };
}

function TabsInner() {
  const [notis] = useNotifications();
  const unread = notis.filter((n) => n.unread).length;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.textBrand,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.line },
        tabBarLabelStyle: typography.caption,
        tabBarBadgeStyle: { backgroundColor: colors.danger, ...typography.caption },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="index" options={tab("홈", "home")} />
      <Tabs.Screen name="explore" options={tab("탐색", "compass")} />
      <Tabs.Screen name="activity" options={{ ...tab("활동", "bell"), tabBarBadge: unread || undefined }} />
      <Tabs.Screen name="my" options={tab("MY", "user")} />
    </Tabs>
  );
}

export default function TabsLayout() {
  return (
    <NotificationsProvider>
      <TabsInner />
    </NotificationsProvider>
  );
}
