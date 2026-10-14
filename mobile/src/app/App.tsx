import { NavLink, Navigate, Outlet, Route, Routes } from "react-router";
import { Bell, Compass, Home as HomeIcon, User } from "lucide-react";
import { AuthProvider, useAuth } from "@/api/auth";
import { useNotifications } from "@/components/Notifications";
import { NativeLifecycle } from "./NativeLifecycle";
import Home from "./Home";
import Explore from "./Explore";
import Activity from "./Activity";
import My from "./My";
import SignIn from "./SignIn";

function Layout() {
  const unread = useNotifications(
    (state) => state.items.filter((item) => item.unread).length,
  );
  return (
    <div className="app">
      <Outlet />
      <nav className="tabbar" aria-label="메인 메뉴">
        <NavLink to="/" end>
          <HomeIcon />홈
        </NavLink>
        <NavLink to="/explore">
          <Compass />
          탐색
        </NavLink>
        <NavLink to="/activity">
          <Bell />
          활동
          {unread > 0 && (
            <span className="badge" aria-label={`읽지 않은 알림 ${unread}개`}>
              {unread}
            </span>
          )}
        </NavLink>
        <NavLink to="/my">
          <User />
          MY
        </NavLink>
      </nav>
    </div>
  );
}
function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <p role="status">불러오는 중…</p>;
  return (
    <Routes>
      <Route
        path="/sign-in"
        element={user ? <Navigate to="/" replace /> : <SignIn />}
      />
      <Route element={user ? <Layout /> : <Navigate to="/sign-in" replace />}>
        <Route index element={<Home />} />
        <Route path="explore" element={<Explore />} />
        <Route path="activity" element={<Activity />} />
        <Route path="my" element={<My />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
export function App() {
  return (
    <AuthProvider>
      <NativeLifecycle />
      <AppRoutes />
    </AuthProvider>
  );
}
