// src/api/posts.js
import { api } from "./client";

export const getPostDetail = (postId) =>
  api.get(`/posts/${postId}/`).then(r => r.data);

export const copyPost = (postId) =>
  api.post(`/posts/${postId}/copy/`).then(r => r.data);

export const getPdfUrl = (postId) => `/api/posts/${postId}/pdf/`;

// 콘텐츠 생성 상태 변경
export const updatePostStatus = (postId) =>
  api.patch(`/posts/${postId}/status/`).then(r => r.data);
  
   