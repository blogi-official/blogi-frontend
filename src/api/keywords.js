// src/api/keywords.js
import { api } from "./client";

/** 유저 공개용 키워드 목록
 * params: { q?, page=1, page_size=20, sort="latest" }
 * 다양한 스키마 방어적으로 파싱
 */
export const getPublicKeywords = async (params = {}) => {
  const query = {
    sort: "latest",
    page: 1,
    page_size: 20,
    ...params,
  };
  const res = await api.get("/keywords/", { params: query });
  return res.data;
};

export const parseKeywordList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  for (const v of Object.values(payload || {})) if (Array.isArray(v)) return v;
  return [];
};
