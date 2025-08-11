import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import blogRoutes from "./blogRoutes";
import authRoutes from "./authRoutes";
import aiRoutes from "./aiRoutes";
import adminRoutes from "./adminRoutes";
import useAdminAuth from "../hooks/useAdminAuth";

function RequireAdmin({ children }) {
  const { ready, isAuthed } = useAdminAuth();
  if (!ready) return null; // 초기화 동안 깜빡임 방지
  if (!isAuthed) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      {[...blogRoutes, ...authRoutes, ...aiRoutes].map((r) => (
        <Route key={r.path} path={r.path} element={r.element} />
      ))}

      {/* 로그인 라우트: 무가드 */}
      {adminRoutes
        .filter((r) => r.path === "/admin/login")
        .map((r) => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}

      {/* 레이아웃 + 보호 + 중첩 */}
      {adminRoutes
        .filter((r) => r.path === "/admin")
        .map((r) => (
          <Route
            key={r.path}
            path={r.path}
            element={<RequireAdmin>{r.element}</RequireAdmin>}
          >
            {r.children?.map((c, i) =>
              c.index ? (
                <Route key={`idx-${i}`} index element={c.element} />
              ) : (
                <Route key={c.path} path={c.path} element={c.element} />
              )
            )}
          </Route>
        ))}
    </Routes>
  );
}