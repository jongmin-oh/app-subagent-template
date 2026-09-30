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

function renderApp() {
  renderRouter("src/app", { initialUrl: "/" });
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
  expect(await screen.findByText("Alice")).toBeTruthy();
  expect(screen.getByText("a@example.com")).toBeTruthy();
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
  expect(await screen.findByText("Alice")).toBeTruthy();
  const [url, init] = fetchMock.mock.calls[0];
  expect(url).toMatch(/\/auth\/google$/);
  expect(init.method).toBe("POST");
  expect(JSON.parse(init.body)).toEqual({ id_token: "mockIdToken" });
  expect(store.setItemAsync).toHaveBeenCalledWith("access_token", "server-token");
});

test("sign-out deletes token, calls signOut, and shows sign-in", async () => {
  store.getItemAsync.mockResolvedValue("saved-token");
  respond(200, user);
  const signOut = jest.spyOn(GoogleSignin, "signOut");
  renderApp();
  fireEvent.press(await screen.findByRole("button", { name: "로그아웃" }));
  await waitFor(() => expect(signInButton()).not.toBeNull());
  expect(store.deleteItemAsync).toHaveBeenCalledWith("access_token");
  expect(signOut).toHaveBeenCalled();
  expect(screen.queryByText("Alice")).toBeNull();
});
