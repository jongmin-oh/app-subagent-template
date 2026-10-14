import { StrictMode } from "react";
import { beforeEach, expect, test, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "@/app/App";
import { tokenStorage } from "@/api/token";
import { googleSignIn, googleSignOut } from "@/api/google";
import { useNotifications } from "@/components/Notifications";
import type { components } from "@/api/schema";

vi.mock("@/api/token", () => ({
  tokenStorage: { get: vi.fn(), set: vi.fn(), remove: vi.fn() },
}));
vi.mock("@/api/google", () => ({
  googleSignIn: vi.fn(),
  googleSignOut: vi.fn(),
}));
const user: components["schemas"]["User"] = {
  id: "u1",
  email: "a@example.com",
  name: "Alice",
};
const login: components["schemas"]["LoginResponse"] = {
  access_token: "server-token",
  user,
};
const fetchMock = vi.fn();
function respond(status: number, body: unknown) {
  fetchMock.mockResolvedValueOnce(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );
}
function renderApp(path = "/") {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  render(
    <StrictMode>
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>
      </QueryClientProvider>
    </StrictMode>,
  );
  return userEvent.setup();
}
function signedIn(path = "/") {
  vi.mocked(tokenStorage.get).mockResolvedValue("saved-token");
  respond(200, user);
  return renderApp(path);
}
beforeEach(() => {
  vi.resetAllMocks();
  vi.stubGlobal("fetch", fetchMock);
  vi.mocked(tokenStorage.get).mockResolvedValue(null);
  vi.mocked(googleSignIn).mockResolvedValue("mockIdToken");
  useNotifications.getState().reset();
});
test("protected routes show sign-in without a stored token", async () => {
  renderApp("/my");
  expect(
    await screen.findByRole("button", { name: "Google로 로그인" }),
  ).toBeVisible();
  expect(fetchMock).not.toHaveBeenCalled();
});
test("restores session with the generated /me contract", async () => {
  signedIn();
  expect(await screen.findByText("안녕하세요, Alice님")).toBeVisible();
  expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\/me$/), {
    headers: { Authorization: "Bearer saved-token" },
  });
});
test("expired token is removed", async () => {
  vi.mocked(tokenStorage.get).mockResolvedValue("expired-token");
  respond(401, { detail: "Invalid token" });
  renderApp();
  expect(
    await screen.findByRole("button", { name: "Google로 로그인" }),
  ).toBeVisible();
  expect(tokenStorage.remove).toHaveBeenCalledOnce();
});
test("Google sign-in exchanges id_token and stores the server token", async () => {
  respond(200, login);
  const ui = renderApp();
  await ui.click(
    await screen.findByRole("button", { name: "Google로 로그인" }),
  );
  expect(await screen.findByText("안녕하세요, Alice님")).toBeVisible();
  expect(fetchMock).toHaveBeenCalledWith(
    expect.stringMatching(/\/auth\/google$/),
    expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ id_token: "mockIdToken" }),
    }),
  );
  expect(tokenStorage.set).toHaveBeenCalledWith("server-token");
});
test("cancelled Google sign-in does not call the backend", async () => {
  vi.mocked(googleSignIn).mockResolvedValue(null);
  const ui = renderApp();
  await ui.click(
    await screen.findByRole("button", { name: "Google로 로그인" }),
  );
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: "Google로 로그인" }),
    ).toBeEnabled(),
  );
  expect(fetchMock).not.toHaveBeenCalled();
});
test("rejected login stays signed out", async () => {
  respond(401, { detail: "Invalid token" });
  const ui = renderApp();
  await ui.click(
    await screen.findByRole("button", { name: "Google로 로그인" }),
  );
  await waitFor(() => expect(fetchMock).toHaveBeenCalled());
  expect(screen.getByRole("button", { name: "Google로 로그인" })).toBeVisible();
  expect(tokenStorage.set).not.toHaveBeenCalled();
});
test("logout modal can be cancelled", async () => {
  const ui = signedIn("/my");
  expect(await screen.findByText("a@example.com")).toBeVisible();
  await ui.click(screen.getByRole("button", { name: "로그아웃" }));
  await ui.click(screen.getByRole("button", { name: "취소" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(googleSignOut).not.toHaveBeenCalled();
  expect(tokenStorage.remove).not.toHaveBeenCalled();
});
test("confirmed logout clears credentials and protected screens", async () => {
  const ui = signedIn("/my");
  await ui.click(await screen.findByRole("button", { name: "로그아웃" }));
  await ui.click(
    within(screen.getByRole("dialog")).getByRole("button", {
      name: "로그아웃",
    }),
  );
  expect(
    await screen.findByRole("button", { name: "Google로 로그인" }),
  ).toBeVisible();
  expect(tokenStorage.remove).toHaveBeenCalledOnce();
  expect(googleSignOut).toHaveBeenCalledOnce();
});
test("checking a task updates progress", async () => {
  const ui = signedIn();
  expect(await screen.findByText("25%")).toBeVisible();
  await ui.click(screen.getByRole("checkbox", { name: /주간 회고 작성/ }));
  expect(screen.getByText("50%")).toBeVisible();
  expect(
    screen.getByRole("checkbox", { name: /주간 회고 작성/ }),
  ).toBeChecked();
});
test("bottom sheet adds a task", async () => {
  const ui = signedIn();
  await ui.click(await screen.findByRole("button", { name: "할 일 추가" }));
  await ui.type(screen.getByPlaceholderText("무엇을 할까요?"), "장보기");
  await ui.click(screen.getByRole("button", { name: "추가하기" }));
  expect(screen.getByRole("checkbox", { name: /장보기/ })).toBeVisible();
  expect(screen.getByText("20%")).toBeVisible();
  expect(screen.getByRole("status")).toHaveTextContent("할 일이 추가됐어요");
});
test("reading notifications clears the shared tab badge", async () => {
  const ui = signedIn("/activity");
  await ui.click(await screen.findByRole("button", { name: "모두 읽음" }));
  expect(screen.getByRole("status")).toHaveTextContent("모두 읽음 처리했어요");
  expect(screen.queryByLabelText("읽지 않은 알림 2개")).not.toBeInTheDocument();
});
test("explore filters and toggles favorites", async () => {
  const ui = signedIn("/explore");
  await ui.click(await screen.findByRole("button", { name: "음악" }));
  expect(screen.queryByText("미니멀 작업실")).not.toBeInTheDocument();
  await ui.type(screen.getByRole("searchbox"), "밤");
  expect(screen.queryByText("집중 사운드")).not.toBeInTheDocument();
  const favorite = screen.getByRole("button", {
    name: "밤의 플레이리스트 즐겨찾기",
  });
  await ui.click(favorite);
  expect(favorite).toHaveAttribute("aria-pressed", "true");
});
