// src/api/client.js
import axios from "axios";

const localHosts = ["localhost", "127.0.0.1", "::1"];
const isLocal = localHosts.includes(window.location.hostname);

const API_BASE = isLocal
  ? "http://127.0.0.1:8000/api"       // 로컬 Django
  : "/api";                           // 배포 환경에서는 상대경로

const INTERNAL_BASE = isLocal
  ? "http://127.0.0.1:8001/api/v1/internal" // 로컬 FastAPI
  : "/api/v1/internal";                      // 배포 환경

const TOKEN_KEY = "accessToken";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const internal = axios.create({
  baseURL: INTERNAL_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// 토큰 자동 첨부
const attachAuth = (config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token && token.trim() !== "") {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // 토큰 없으면 Authorization 헤더 삭제
    delete config.headers.Authorization;
  }
  return config;
};

api.interceptors.request.use(attachAuth);
internal.interceptors.request.use(attachAuth);

// 401 공통 처리
const onError = (error) => {
  const status = error?.response?.status;
  if (status === 401) {
    // 토큰 만료 처리
    // window.location.href = "/login";
  }
  return Promise.reject(error);
};

api.interceptors.response.use((r) => r, onError);
internal.interceptors.response.use((r) => r, onError);

// 프록시 이미지 URL 생성
export const proxyImage = (originUrl) =>
  `${INTERNAL_BASE}/proxy-image?url=${encodeURIComponent(originUrl)}`;

export const AUTH = { TOKEN_KEY };
export { API_BASE };

