import { useAuth } from "@/api/auth";
import { Screen } from "@/components/Screen";

export default function Home() {
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
