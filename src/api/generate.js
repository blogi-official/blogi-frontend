// src/api/generate.js
import { api } from "./client";

export const generatePost = (keywordId) =>
  api.post("/generate/", { keyword_id: keywordId }, { timeout: 60000 })
     .then(r => r.data); // { status, post_id, from_cache?, ... }