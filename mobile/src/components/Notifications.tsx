import { createContext, useContext, useState, type ReactNode } from "react";

// ponytail: 로컬 mock. 알림 API 생기면 교체
const initial = [
  { id: 1, icon: "message-circle", text: "김민서님이 회의록에 댓글을 남겼어요", time: "3분 전", unread: true },
  { id: 2, icon: "heart", text: "내 컬렉션을 12명이 좋아해요", time: "1시간 전", unread: true },
  { id: 3, icon: "calendar", text: "내일 오전 10시 일정이 있어요", time: "어제", unread: false },
  { id: 4, icon: "star", text: "새 테마가 추가됐어요. 지금 확인해보세요", time: "2일 전", unread: false },
] as const satisfies readonly { id: number; icon: string; text: string; time: string; unread: boolean }[];

type Noti = Omit<(typeof initial)[number], "unread"> & { unread: boolean };

const Ctx = createContext<[Noti[], (n: Noti[]) => void] | null>(null);

// 탭바 뱃지와 활동 탭이 같은 상태를 공유
export function NotificationsProvider({ children }: { children: ReactNode }) {
  const state = useState<Noti[]>([...initial]);
  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

export function useNotifications() {
  // 항상 (tabs)/_layout의 Provider 안에서만 호출됨
  return useContext(Ctx)!;
}
