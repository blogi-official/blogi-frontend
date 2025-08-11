// src/pages/admin/index.js  (라우트 엔트리)
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import useAdminAuth from "../../hooks/useAdminAuth";
import AdminLayout from "./AdminLayout";
import AdminLogin from "./AdminLogin";
import Dashboard from "./Dashboard";
import Keywords from "./Keywords";
import Generated from "./Generated";
import Users from "./Users";

export default function AdminRoutes() {
  const { isAuthed, ready } = useAdminAuth();
  if (!ready) return null;

  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin/>} />
      <Route path="/admin" element={<AdminLayout/>}>
        <Route index element={isAuthed ? <Dashboard/> : <Navigate to="/admin/login" replace/>} />
        <Route path="keywords" element={isAuthed ? <Keywords/> : <Navigate to="/admin/login" replace/>} />
        <Route path="generated" element={isAuthed ? <Generated/> : <Navigate to="/admin/login" replace/>} />
        <Route path="users" element={isAuthed ? <Users/> : <Navigate to="/admin/login" replace/>} />
      </Route>
    </Routes>
  );
}
