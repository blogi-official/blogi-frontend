// src/api/admin.js
import { admin } from "./client";

// ===== AUTH =====
export const adminLogin = (email, password) =>
  admin.post("/admin/auth/admin-login/", { email, password }).then((r) => r.data);
// ※ 백엔드가 /admin/login/ 인 경우 경로만 교체하세요. (지금 로그인 되는 상태면 OK)

// ===== DASHBOARD =====
export const getDailyStats = () =>
  admin.get("/admin/dashboard/daily-stats/").then((r) => r.data); // [ { date, collected_keywords, generated_posts } ]

export const getTopKeywords = () =>
  admin.get("/admin/dashboard/top-keywords/").then((r) => r.data); // [ { keyword_id, title, click_count } ]

export const getClovaStats = () =>
  admin.get("/admin/dashboard/clova-stats/").then((r) => r.data); // { total, success, fail, fail_rate }

/** ---------- KEYWORDS (Admin) ---------- */
export const getKeywordDetail = (id) =>
  admin.get(`/admin/titles/${id}/`).then((r) => r.data);

export const updateKeywordTitle = (id, { title }) =>
  admin.patch(`/admin/titles/${id}/title/`, { title }).then((r) => r.data);

export const toggleKeywordActive = async (id) => {
  const res = await admin.patch(`/admin/titles/${id}/toggle/`);
  // 백엔드가 { message, data: {...} }를 준다면 data?.data, 아니라면 res.data 그대로
  return res.data?.data ?? res.data; // => { id, title, is_active }
};

// 항상 순수 미리보기 객체만 반환
export const getKeywordPreview = async (id) => {
  const res = await admin.get(`/admin/titles/${id}/preview/`);
  if (res.status === 204) return null;          // 미리보기 없음
  return res.data?.data ?? res.data;            // { title, content, ... }
};

export const requestRegenerate = (id) =>
  admin.post(`/admin/titles/${id}/regenerate/`, {}).then((r) => r.data);
// ===== GENERATED POSTS =====
export const listGenerated = (params = {}) =>
  admin.get("/admin/generated/", { params }).then((r) => r.data);

export const getGeneratedDetail = (id) =>
  admin.get(`/admin/generated/${id}/`).then((r) => r.data);

// 주의: 서버 스펙상 is_active는 false만 허용
export const manageGenerated = (id, payload) =>
  admin.patch(`/admin/generated/${id}/manage/`, payload).then((r) => r.data);

// ✅ 204 대비: boolean 반환
export const deleteGenerated = async (id) => {
  const res = await admin.delete(`/admin/generated/${id}/manage/`);
  return res.status >= 200 && res.status < 300;
};

// ===== USERS =====
export const listUsers = (params = {}) =>
  admin.get("/admin/users/", { params }).then((r) => r.data);

export const listUserGenerated = (userId, params = {}) =>
  admin.get(`/admin/users/${userId}/generated/`, { params }).then((r) => r.data);

