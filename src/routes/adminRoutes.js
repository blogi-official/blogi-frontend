import React from "react";
import { Navigate } from "react-router-dom";

import AdminLogin from "../pages/admin/AdminLogin";
import AdminLayout from "../pages/admin/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Keywords from "../pages/admin/Keywords";
import Generated from "../pages/admin/Generated";
import Users from "../pages/admin/Users";

const adminRoutes = [
  // 로그인은 레이아웃 없이 단독
  { path: "/admin/login", element: <AdminLogin />, protected: false },

  // 레이아웃 + 보호 + 중첩
  {
    path: "/admin",
    element: <AdminLayout />,
    protected: true,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "keywords",  element: <Keywords /> },
      { path: "generated", element: <Generated /> },
      { path: "users",     element: <Users /> },
    ],
  },
];

export default adminRoutes;

