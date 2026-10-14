import { useEffect, useRef, useState } from "react";
export function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  function show(message: string) {
    clearTimeout(timer.current);
    setMessage(message);
    timer.current = setTimeout(() => setMessage(null), 2200);
  }
  return [
    message ? (
      <div role="status" className="toast">
        {message}
      </div>
    ) : null,
    show,
  ] as const;
}
