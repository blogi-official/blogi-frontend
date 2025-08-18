// src/api/keywords.js
import { api, USER_TOKEN_KEY } from "./client";

/** 유저 공개용 키워드 목록
 * params: { q?, page=1, page_size=20, sort? }
 * 로그인 상태면 sort=latest 시 관심사 기반 우선 정렬됨
 */
export const getPublicKeywords = async (params = {}) => {
  // 토큰 체크 (로그인 상태 확인)
  const token = localStorage.getItem(USER_TOKEN_KEY);

  const query = {
    sort: params.sort || "latest", // 기본값 latest
    page: params.page || 1,
    page_size: params.page_size || 20,
    ...params,
  };

  // 헤더 세팅
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await api.get("/keywords/", { params: query, headers });
  return res.data;
};

export const parseKeywordList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  for (const v of Object.values(payload || {})) if (Array.isArray(v)) return v;
  return [];
};
