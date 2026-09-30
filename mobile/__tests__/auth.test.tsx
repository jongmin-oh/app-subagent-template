/// <reference types="jest" />
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { renderRouter } from "expo-router/testing-library";
import * as SecureStore from "expo-secure-store";
import { GoogleSignin, GoogleSigninButton } from "@react-native-google-signin/google-signin";
import type { components } from "@/api/schema";

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const user: components["schemas"]["User"] = { id: "u1", email: "a@example.com", name: "Alice" };
const login: components["schemas"]["LoginResponse"] = { access_token: "server-token", user };

const store = jest.mocked(SecureStore);
const fetchMock = jest.fn();
globalThis.fetch = fetchMock;

function respond(status: number, body?: unknown) {
  fetchMock.mockResolvedValueOnce({ ok: status < 400, status, json: async () => body });
}

function renderApp(initialUrl = "/") {
  renderRouter("src/app", { initialUrl });
}

function signedIn(initialUrl = "/") {
  store.getItemAsync.mockResolvedValue("saved-token");
  respond(200, user);
  renderApp(initialUrl);
}

const signInButton = () => screen.UNSAFE_queryByType(GoogleSigninButton);

beforeEach(() => {
  jest.clearAllMocks();
  store.getItemAsync.mockResolvedValue(null);
});

test("shows sign-in when no token is stored", async () => {
  renderApp();
  await waitFor(() => expect(signInButton()).not.toBeNull());
  expect(fetchMock).not.toHaveBeenCalled();
});

test("shows home with /me result when a token is stored", async () => {
  store.getItemAsync.mockResolvedValue("saved-token");
  respond(200, user);
  renderApp();
  expect(await screen.findByText("안녕하세요, Alice님")).toBeTruthy();
  const [url, init] = fetchMock.mock.calls[0];
  expect(url).toMatch(/\/me$/);
  expect(init.headers.Authorization).toBe("Bearer saved-token");
});

test("deletes token and shows sign-in when /me returns 401", async () => {
  store.getItemAsync.mockResolvedValue("expired-token");
  respond(401, { detail: "Invalid token" });
  renderApp();
  await waitFor(() => expect(signInButton()).not.toBeNull());
  expect(store.deleteItemAsync).toHaveBeenCalledWith("access_token");
});

test("sign-in posts id_token, stores token, and goes home", async () => {
  respond(200, login);
  renderApp();
  await waitFor(() => expect(signInButton()).not.toBeNull());
  fireEvent.press(signInButton()!);
  expect(await screen.findByText("안녕하세요, Alice님")).toBeTruthy();
  const [url, init] = fetchMock.mock.calls[0];
  expect(url).toMatch(/\/auth\/google$/);
  expect(init.method).toBe("POST");
  expect(JSON.parse(init.body)).toEqual({ id_token: "mockIdToken" });
  expect(store.setItemAsync).toHaveBeenCalledWith("access_token", "server-token");
});

test("stays on sign-in when the backend rejects login", async () => {
  respond(401, { detail: "Invalid token" });
  renderApp();
  await waitFor(() => expect(signInButton()).not.toBeNull());
  fireEvent.press(signInButton()!);
  await waitFor(() => expect(fetchMock).toHaveBeenCalled());
  expect(signInButton()).not.toBeNull();
  expect(store.setItemAsync).not.toHaveBeenCalled();
});

test("MY shows profile and cancel closes the logout modal", async () => {
  const signOut = jest.spyOn(GoogleSignin, "signOut");
  signedIn("/my");
  expect(await screen.findByText("a@example.com")).toBeTruthy();
  fireEvent.press(screen.getByRole("button", { name: "로그아웃" }));
  expect(screen.getByText("로그아웃할까요?")).toBeTruthy();
  fireEvent.press(screen.getByRole("button", { name: "취소" }));
  expect(screen.queryByText("로그아웃할까요?")).toBeNull();
  expect(signOut).not.toHaveBeenCalled();
  expect(store.deleteItemAsync).not.toHaveBeenCalled();
});

test("sign-out confirmed in modal deletes token, calls signOut, and shows sign-in", async () => {
  const signOut = jest.spyOn(GoogleSignin, "signOut");
  signedIn("/my");
  fireEvent.press(await screen.findByRole("button", { name: "로그아웃" }));
  const buttons = screen.getAllByRole("button", { name: "로그아웃" });
  fireEvent.press(buttons[buttons.length - 1]);
  await waitFor(() => expect(signInButton()).not.toBeNull());
  expect(store.deleteItemAsync).toHaveBeenCalledWith("access_token");
  expect(signOut).toHaveBeenCalled();
});

test("checking a task updates home progress", async () => {
  signedIn();
  expect(await screen.findByText("25%")).toBeTruthy();
  fireEvent.press(screen.getByRole("checkbox", { name: /주간 회고 작성/ }));
  expect(screen.getByText("50%")).toBeTruthy();
  expect(screen.getByRole("checkbox", { name: /주간 회고 작성/ })).toBeChecked();
});

test("bottom sheet adds a task", async () => {
  signedIn();
  fireEvent.press(await screen.findByRole("button", { name: "할 일 추가" }));
  fireEvent.changeText(screen.getByPlaceholderText("무엇을 할까요?"), "장보기");
  fireEvent.press(screen.getByRole("button", { name: "추가하기" }));
  expect(screen.getByRole("checkbox", { name: /장보기/ })).toBeTruthy();
  expect(screen.getByText("20%")).toBeTruthy();
  expect(screen.getByText("할 일이 추가됐어요")).toBeTruthy();
});

test("activity mark all as read", async () => {
  signedIn("/activity");
  fireEvent.press(await screen.findByRole("button", { name: "모두 읽음" }));
  expect(screen.getByText("모두 읽음 처리했어요")).toBeTruthy();
});
