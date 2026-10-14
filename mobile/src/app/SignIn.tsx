import { useAuth } from "@/api/auth";
import { Button } from "@/components/Button";
export default function SignIn() {
  const { signIn, signingIn } = useAuth();
  return (
    <main className="sign-in stack">
      <header>
        <h1>
          다시 만나서
          <br />
          반가워요
        </h1>
        <p>계정에 로그인하세요</p>
      </header>
      <Button
        title="Google로 로그인"
        disabled={signingIn}
        onClick={() => void signIn()}
      />
    </main>
  );
}
