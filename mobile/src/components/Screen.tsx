import type { ReactNode } from "react";
export function Screen({ children }: { children: ReactNode }) {
  return <main className="screen">{children}</main>;
}
