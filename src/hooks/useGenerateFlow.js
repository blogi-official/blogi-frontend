import { useState, useCallback, useRef, useEffect } from "react";
import { generatePost } from "../api/generate";
import { getPostDetail, copyPost } from "../api/posts";
import { api } from "../api/client";
import { buildCopyHtml, copyHtmlRich } from "../utils/htmlPipeline";

export default function useGenerateFlow() {
  const [generatingId, setGeneratingId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [fromCache, setFromCache] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);
  const safeSet = useCallback((setter, value) => {
    if (mountedRef.current) setter(value);
  }, []);

  const close = useCallback(() => {
    safeSet(setOpen, false);
    safeSet(setDetail, null);
    safeSet(setFromCache, false);
    safeSet(setError, "");
  }, [safeSet]);

  const generateByKeyword = useCallback(
    async (keyword) => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        safeSet(setError, "🔒 로그인 후 이용해주세요.");
        setTimeout(() => window.location.replace("/login"), 1000);
        return null;
      }
      if (!keyword || !keyword.id) {
        safeSet(setError, "유효하지 않은 키워드입니다.");
        return null;
      }
      if (generatingId) return null;
      safeSet(setGeneratingId, keyword.id);
      safeSet(setError, "");

      try {
        api.post(`/keywords/${keyword.id}/click/`).catch(function(){});
        const gen = await generatePost(keyword.id);
        if (gen.status !== "success" || !gen.post_id) {
          throw new Error(gen.error_message || "생성에 실패했습니다.");
        }
        safeSet(setFromCache, !!gen.from_cache);

        safeSet(setLoadingDetail, true);
        const post = await getPostDetail(gen.post_id);
        safeSet(setDetail, post);
        safeSet(setOpen, true);
        return gen.post_id;
      } catch (e) {
        console.error(e);
        safeSet(setError, "생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        return null;
      } finally {
        safeSet(setLoadingDetail, false);
        safeSet(setGeneratingId, null);
      }
    },
    [generatingId, safeSet]
  );

  /** 복사: (줄바꿈 규칙 적용된) + (원본 URL) HTML을 리치 포맷으로 복사 */
  const copyCurrent = useCallback(async () => {
    if (!detail) return;

    // true면 DB image_1~3_url 순서 매핑까지 수행 (원하시면 false로)
    const html = buildCopyHtml(detail, true);

    const ok = await copyHtmlRich(html);
    if (!ok) {
      alert("복사에 실패했습니다. 브라우저 권한을 확인해주세요.");
      return;
    }
    await copyPost(detail.id);
    // 필요한 경우 토스트로 변경
    // alert("복사되었습니다! (화면 간격/원본 이미지 URL 반영)");
  }, [detail]);

  const downloadPdf = useCallback(async () => {
    if (!detail || !detail.id) return;
    safeSet(setError, "");
    safeSet(setDownloadingPdf, true);
    try {
      const res = await api.get(`/posts/${detail.id}/pdf/`, { responseType: "blob" });
      const blob = res.data;

      let filename = "";
      const cd = res.headers && (res.headers["content-disposition"] || res.headers["Content-Disposition"]);
      if (cd) {
        const utf8Match = cd.match(/filename\*=(?:UTF-8'')?([^;]+)/i);
        const plainMatch = cd.match(/filename="?([^\";]+)"?/i);
        if (utf8Match && utf8Match[1]) {
          try { filename = decodeURIComponent(utf8Match[1].trim()); } catch { filename = utf8Match[1].trim(); }
        } else if (plainMatch && plainMatch[1]) {
          filename = plainMatch[1].trim();
        }
      }
      if (!filename) {
        const safeTitle = (detail.title || ("post-" + detail.id)).replace(/[\\/:*?"<>|]+/g, "_");
        filename = safeTitle + ".pdf";
      }
      if (filename.toLowerCase().slice(-4) !== ".pdf") {
        filename += ".pdf";
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
    } catch (err) {
      console.error("PDF 다운로드 실패:", err);
      safeSet(setError, "PDF 다운로드 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      safeSet(setDownloadingPdf, false);
    }
  }, [detail, safeSet]);

  return {
    generatingId,
    detail,
    fromCache,
    loadingDetail,
    downloadingPdf,
    open,
    error,
    generateByKeyword,
    copyCurrent,
    downloadPdf,
    close,
  };
}

