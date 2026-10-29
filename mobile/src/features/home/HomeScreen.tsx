import { Screen } from "@/components/Screen";
import { useAuth } from "@/features/auth";

export function HomeScreen() {
  const { user } = useAuth();
  return (
    <Screen title="홈">
      <article className="border-b border-line bg-canvas p-4 text-ink">
        <h2 className="text-base font-semibold">안녕하세요, {user?.name}님</h2>
        <p className="mt-2 text-sm text-muted">{user?.email}</p>
      </article>
    </Screen>
  );
}
