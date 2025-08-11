// src/api/client.js
import axios from "axios";

const localHosts = ["localhost", "127.0.0.1", "::1"];
const isLocal = localHosts.includes(window.location.hostname);

// ✅ 기존 코드와의 하위 호환을 위해 API_BASE도 그대로 export
const API_BASE = isLocal ? "http://127.0.0.1:8000/api" : "/api";
const ADMIN_BASE = isLocal ? "http://127.0.0.1:8000" : "/";
const INTERNAL_BASE = isLocal ? "http://127.0.0.1:8001/api/v1/internal" : "/api/v1/internal";

// ✅ 사용자/관리자 토큰 키 분리
export const USER_TOKEN_KEY = "accessToken";
export const ADMIN_TOKEN_KEY = "blogi_admin_access";

// ===== axios instances =====
export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const admin = axios.create({
  baseURL: ADMIN_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

export const internal = axios.create({
  baseURL: INTERNAL_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// ===== utils: 관리자 토큰 주입/해제 =====
export function setAdminAuthToken(token) {
  if (token) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    admin.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    delete admin.defaults.headers.common["Authorization"];
  }
}

// 앱 시작 시 저장된 관리자 토큰을 헤더에 즉시 반영 (새로고침 대응)
const savedAdmin = localStorage.getItem(ADMIN_TOKEN_KEY);
if (savedAdmin) {
  admin.defaults.headers.common["Authorization"] = `Bearer ${savedAdmin}`;
}

// ===== interceptors =====
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(USER_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  else delete config.headers.Authorization;
  return config;
});

admin.interceptors.request.use((config) => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  else delete config.headers.Authorization;
  return config;
});

internal.interceptors.request.use((config) => {
  const token = localStorage.getItem(USER_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  else delete config.headers.Authorization;
  return config;
});

const onError = (error) => {
  const status = error?.response?.status;
  const url = String(error?.config?.url || "");
  // baseURL이 붙어 절대 URL이 될 수 있으므로 includes로도 체크
  if (status === 401 && (url.startsWith("/admin/") || url.includes("/admin/"))) {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    delete admin.defaults.headers.common["Authorization"];
    if (!window.location.pathname.startsWith("/admin/login")) {
      window.location.replace("/admin/login");
    }
  }
  return Promise.reject(error);
};

api.interceptors.response.use((r) => r, onError);
admin.interceptors.response.use((r) => r, onError);
internal.interceptors.response.use((r) => r, onError);

// ===== utils =====
export const proxyImage = (originUrl) =>
  `${INTERNAL_BASE}/proxy-image?url=${encodeURIComponent(originUrl)}`;

// ✅ 하위 호환: 기존 코드가 쓰던 이름 그대로 다시 export
export const AUTH = { TOKEN_KEY: USER_TOKEN_KEY, ADMIN_TOKEN_KEY };
export { API_BASE };
