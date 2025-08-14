import React, { useMemo, useState, useEffect, useRef } from "react";

export default function GenerateResultDrawer({
  open,
  loading,
  detail,
  onCopy,
  onClose,
  onDownloadPdf,
  downloadingPdf,
}) {
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [displayedContent, setDisplayedContent] = useState("");
  const [imageUrls, setImageUrls] = useState([]); // 이미지 인덱스 매핑
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState("");
  const [readingProgress, setReadingProgress] = useState(0);
  const [imageLoadStates, setImageLoadStates] = useState(new Map());
  const typingTimeoutRef = useRef(null);
  const contentRef = useRef(null);

  const rawHtml = (detail && detail.content) || "";

  // 화면 표시용: 줄바꿈 규칙 적용
  const processedHtml = useMemo(() => {
    if (!rawHtml) return "";
    let html = rawHtml;
    html = html.replace(/<\/h1>\s*<h3>/gi, "</h1><br><br><br><h3>");
    html = html.replace(/<\/p>\s*<h3>/gi, "</p><br><br><br><br><h3>");
    html = html.replace(/<\/p>\s*<p>/gi, "</p><br><p>");
    return html;
  }, [rawHtml]);

  // 최종 콘텐츠 조합 (타이핑 중 이미지는 제거, 완료 후 컨테이너로 교체)
  const finalContent = useMemo(() => {
    if (loading) return "";

    let content = displayedContent;

    if (!isTypingComplete) {
      // 타이핑 중: 모든 이미지 플레이스홀더 제거
      content = content.replace(/<!--IMG_PLACEHOLDER_\d+-->/g, "");
    } else {
      // 타이핑 완료: 플레이스홀더 → 실제 이미지 컨테이너
      content = content.replace(/<!--IMG_PLACEHOLDER_(\d+)-->/g, (_m, idxStr) => {
        const index = Number(idxStr);
        const imgSrc = imageUrls[index] || "";
        const isLoaded = imageLoadStates.get(imgSrc);
        return `
          <div class="image-container visible" data-image-index="${index}">
            ${!isLoaded ? `
              <div class="image-loading-placeholder">
                <div class="image-loading-spinner"></div>
                <div class="image-loading-text">이미지 로딩 중...</div>
              </div>
            ` : ""}
            <img
              src="${imgSrc}"
              class="clickable-image ${isLoaded ? "loaded" : ""}"
              onclick="window.openImageFullscreen('${imgSrc}')"
              onload="window.handleImageLoad('${imgSrc}', ${index})"
              onerror="window.handleImageError('${imgSrc}', ${index})"
              alt="콘텐츠 이미지 ${index + 1}"
            />
          </div>
        `;
      });
    }

    if (!isTypingComplete && content) {
      content += '<span class="typing-cursor"></span>';
    }

    return content || "<p>(내용 없음)</p>";
  }, [displayedContent, imageUrls, isTypingComplete, loading, imageLoadStates]);

  // CSS 주입
  const injectStyles = () => {
    const styleId = "generate-result-modal-magic-styles";
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      .generate-modal-overlay { position: fixed; inset: 0; background: linear-gradient(135deg, rgba(0,0,0,0.4), rgba(102,126,234,0.2), rgba(0,0,0,0.5)); backdrop-filter: blur(8px); z-index: 9999; display: flex; justify-content: center; align-items: center; padding: 1rem; animation: overlay-fade-in 0.4s ease-out; }
      @keyframes overlay-fade-in { 0% { opacity: 0; backdrop-filter: blur(0px); } 100% { opacity: 1; backdrop-filter: blur(8px); } }

      .generate-modal-container { width: 100%; max-width: 1200px; max-height: 95vh; background: rgba(255,255,255,0.95); backdrop-filter: blur(20px); border-radius: 24px; box-shadow: 0 32px 64px rgba(0,0,0,0.25), 0 16px 32px rgba(102,126,234,0.15), inset 0 1px 0 rgba(255,255,255,0.8); border: 1px solid rgba(255,255,255,0.3); display: flex; flex-direction: column; overflow: hidden; position: relative; animation: modal-entrance 0.5s cubic-bezier(0.4,0,0.2,1); }
      @keyframes modal-entrance { 0% { opacity: 0; transform: scale(0.9) translateY(40px); } 100% { opacity: 1; transform: scale(1) translateY(0px); } }

      .reading-progress-bar { position: absolute; top: 0; left: 0; height: 4px; background: linear-gradient(90deg, #667eea, #764ba2, #f093fb); transition: width 0.3s ease; z-index: 10; border-radius: 0 2px 2px 0; }

      .generate-modal-header { padding: 1.5rem 2rem; border-bottom: 1px solid rgba(0,0,0,0.08); display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 2; background: rgba(255,255,255,0.8); backdrop-filter: blur(10px); }
      .generate-modal-title-section { display: flex; align-items: center; gap: 1rem; }
      .generate-modal-icon { font-size: 2rem; animation: title-icon-pulse 3s ease-in-out infinite; }
      @keyframes title-icon-pulse { 0%,100% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 10px rgba(102,126,234,0.3)); } 50% { transform: scale(1.1) rotate(5deg); filter: drop-shadow(0 0 20px rgba(102,126,234,0.5)); } }
      .generate-modal-title { font-size: 1.5rem; font-weight: 800; color: #374151; margin: 0; }

      .generate-modal-close { width: 2.5rem; height: 2.5rem; border: none; background: rgba(239,68,68,0.1); color: #dc2626; border-radius: 50%; cursor: pointer; font-size: 1.2rem; font-weight: bold; display: flex; align-items: center; justify-content: center; }

      .generate-modal-toolbar { padding: 1rem 2rem; border-bottom: 1px solid rgba(0,0,0,0.08); display: flex; gap: 1rem; position: relative; z-index: 2; background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); flex-wrap: wrap; }
      .generate-toolbar-btn { padding: 0.75rem 1.5rem; border: 2px solid #e2e8f0; background: rgba(255,255,255,0.8); color: #374151; border-radius: 12px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.3s cubic-bezier(0.4,0,0.2,1); position: relative; overflow: hidden; display: flex; align-items: center; gap: 0.5rem; }
      .generate-toolbar-btn:disabled { opacity: 0.5; cursor: not-allowed; background: rgba(156,163,175,0.1); color: #9ca3af; }

      .generate-modal-content { flex: 1; padding: 2.5rem 3rem; overflow-y: auto; position: relative; z-index: 2; background: rgba(255,255,255,0.7); backdrop-filter: blur(5px); }
      .generate-modal-content::-webkit-scrollbar { width: 8px; }
      .generate-modal-content::-webkit-scrollbar-thumb { background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 4px; }

      .generate-content-article { line-height: 1.8; color: #374151; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: none; }
      .generate-content-article h1 { font-size: 2.25rem; font-weight: 800; color: #1f2937; margin-bottom: 1.5rem; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
      .generate-content-article h2 { font-size: 1.75rem; font-weight: 700; color: #374151; margin: 2rem 0 1rem 0; }
      .generate-content-article h3 { font-size: 1.5rem; font-weight: 600; color: #4b5563; margin: 1.5rem 0 1rem 0; }
      .generate-content-article p { margin-bottom: 1.25rem; color: #4b5563; font-size: 1.1rem; }

      .image-container { position: relative; margin: 2rem auto; border-radius: 16px; background: linear-gradient(135deg, #f8fafc, #e2e8f0); display: flex; align-items: center; justify-content: center; overflow: hidden; transition: all 0.8s cubic-bezier(0.4,0,0.2,1); border: 3px solid rgba(255,255,255,0.8); box-shadow: 0 8px 24px rgba(0,0,0,0.1); max-width: 100%; min-height: 200px; height: auto; opacity: 1; animation: image-dramatic-entrance 0.8s cubic-bezier(0.4,0,0.2,1); }
      @keyframes image-dramatic-entrance { 0% { height: 0; opacity: 0; transform: scaleY(0); margin: 0 auto; border: none; box-shadow: none; } 50% { height: 100px; opacity: 0.5; transform: scaleY(0.5); } 100% { height: auto; opacity: 1; transform: scaleY(1); margin: 2rem auto; border: 3px solid rgba(255,255,255,0.8); box-shadow: 0 8px 24px rgba(0,0,0,0.1); } }
      .image-loading-placeholder { display: flex; flex-direction: column; align-items: center; gap: 1rem; color: #64748b; font-size: 0.9rem; position: absolute; z-index: 1; }
      .image-loading-spinner { width: 32px; height: 32px; border: 3px solid rgba(102,126,234,0.2); border-top: 3px solid #667eea; border-radius: 50%; animation: loading-spin 1s linear infinite; }
      .image-error { padding: 2rem; text-align: center; color: #ef4444; background: rgba(239,68,68,0.1); border-radius: 12px; font-weight: 500; width: 100%; }

      .clickable-image { max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 12px 32px rgba(0,0,0,0.15); border: 3px solid rgba(255,255,255,0.8); cursor: pointer; opacity: 0; transform: scale(0.95); transition: all 0.4s cubic-bezier(0.4,0,0.2,1); z-index: 2; }
      .clickable-image.loaded { opacity: 1; transform: scale(1); }

      .fullscreen-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.95); backdrop-filter: blur(10px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 2rem; animation: fullscreen-fade-in 0.3s ease-out; }
      @keyframes fullscreen-fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
      .fullscreen-image { max-width: 90%; max-height: 90%; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); animation: fullscreen-image-entrance 0.4s cubic-bezier(0.4,0,0.2,1); }
      @keyframes fullscreen-image-entrance { 0% { opacity: 0; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
      .fullscreen-close { position: absolute; top: 2rem; right: 2rem; width: 3rem; height: 3rem; background: rgba(255,255,255,0.2); border: 2px solid rgba(255,255,255,0.3); color: white; border-radius: 50%; cursor: pointer; font-size: 1.5rem; font-weight: bold; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; }

      .typing-cursor { display: inline-block; width: 3px; height: 1.2em; background: linear-gradient(135deg, #667eea, #764ba2); margin-left: 3px; animation: cursor-blink 1s infinite; border-radius: 2px; }
      @keyframes cursor-blink { 0%,50% { opacity: 1; } 51%,100% { opacity: 0; } }

      @media (max-width: 1024px) { .generate-modal-container { max-width: 95%; } .generate-modal-content { padding: 2rem; } }
      @media (max-width: 768px) {
        .generate-modal-overlay { padding: 0.5rem; }
        .generate-modal-container { max-width: 100%; max-height: 98vh; border-radius: 16px; }
        .generate-modal-header { padding: 1rem 1.5rem; }
        .generate-modal-toolbar { padding: 0.75rem 1.5rem; flex-wrap: wrap; }
        .generate-modal-content { padding: 1.5rem; }
        .fullscreen-close { top: 1rem; right: 1rem; width: 2.5rem; height: 2.5rem; font-size: 1.2rem; }
      }

      .generate-toolbar-btn:focus, .generate-modal-close:focus, .fullscreen-close:focus { outline: 3px solid rgba(102,126,234,0.5); outline-offset: 2px; }
    `;
    document.head.appendChild(style);
  };

  // 전역 함수 등록 (풀스크린/이미지 로딩)
  const setupGlobalFunctions = () => {
    window.openImageFullscreen = (src) => {
      setFullscreenImage(src);
      setIsFullscreen(true);
    };
    window.handleImageLoad = (src, index) => {
      setImageLoadStates((prev) => new Map(prev.set(src, true)));
      setTimeout(() => {
        const container = document.querySelector(`[data-image-index="${index}"]`);
        if (container) {
          const placeholder = container.querySelector(".image-loading-placeholder");
          if (placeholder) placeholder.style.display = "none";
        }
      }, 100);
    };
    window.handleImageError = (src, index) => {
      const container = document.querySelector(`[data-image-index="${index}"]`);
      if (container) {
        container.innerHTML = '<div class="image-error">🖼️ 이미지를 불러올 수 없습니다</div>';
      }
    };
  };

  // 스크롤 진행률
  const updateReadingProgress = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setReadingProgress(Math.min(progress, 100));
    }
  };

  // CSS/전역함수
  useEffect(() => {
    if (open) {
      injectStyles();
      setupGlobalFunctions();
    }
  }, [open]);

  // 타이핑 효과 (DOM 치환으로 안전한 플레이스홀더 생성)
  useEffect(() => {
    if (!open || loading || !processedHtml) {
      setDisplayedContent("");
      setIsTypingComplete(false);
      setImageUrls([]);
      setImageLoadStates(new Map());
      return;
    }

    // DOM으로 이미지 → <!--IMG_PLACEHOLDER_i--> 치환
    const tmp = document.createElement("div");
    tmp.innerHTML = processedHtml;

    const imgs = Array.from(tmp.querySelectorAll("img"));
    const urls = [];
    imgs.forEach((img, i) => {
      urls.push(img.getAttribute("src") || "");
      img.replaceWith(document.createComment(`IMG_PLACEHOLDER_${i}`));
    });

    const textWithPlaceholders = tmp.innerHTML;
    setImageUrls(urls);
    setImageLoadStates(new Map());
    setDisplayedContent("");
    setIsTypingComplete(false);

    // 타이핑 시작 (2배 빠른 속도)
    let currentIndex = 0;
    const typeText = () => {
      if (currentIndex < textWithPlaceholders.length) {
        setDisplayedContent(textWithPlaceholders.slice(0, currentIndex + 1));
        currentIndex++;
        const char = textWithPlaceholders[currentIndex - 1];
        const delay =
          char === "<" || char === ">" ? 2 :
          char === " " ? 10 :
          Math.random() * 15 + 7; // 7~22ms
        typingTimeoutRef.current = setTimeout(typeText, delay);
      } else {
        setIsTypingComplete(true);
      }
    };
    typingTimeoutRef.current = setTimeout(typeText, 300);

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [open, loading, processedHtml]);

  // 스크롤 진행률 이벤트
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateReadingProgress);
    return () => el.removeEventListener("scroll", updateReadingProgress);
  }, []);

  if (!open) return null;

  return (
    <>
      <div className="generate-modal-overlay" onClick={onClose}>
        <div className="generate-modal-container" onClick={(e) => e.stopPropagation()}>
          {/* 진행률 바 */}
          <div className="reading-progress-bar" style={{ width: `${readingProgress}%` }} />

          {/* 헤더 */}
          <div className="generate-modal-header">
            <div className="generate-modal-title-section">
              <div className="generate-modal-icon">🎨</div>
              <div>
                <h2 className="generate-modal-title">
                  {loading ? "마법을 부리는 중..." : (detail && detail.title) || "생성 결과"}
                </h2>
              </div>
            </div>
            <button className="generate-modal-close" onClick={onClose} aria-label="모달 닫기">✕</button>
          </div>

          {/* 툴바 */}
          <div className="generate-modal-toolbar">
            <button
              className="generate-toolbar-btn"
              onClick={onCopy}
              disabled={!detail || loading || !isTypingComplete}
              title="복사: 화면 간격/원본 이미지 URL 반영하여 리치 복사"
            >
              <span className="generate-toolbar-btn-icon">📋</span>
              <span>복사하기</span>
            </button>

            <button
              className="generate-toolbar-btn"
              onClick={onDownloadPdf}
              disabled={!detail || loading || downloadingPdf || !isTypingComplete}
            >
              <span className="generate-toolbar-btn-icon">{downloadingPdf ? "⬇️" : "📄"}</span>
              <span>{downloadingPdf ? "다운로드 중..." : "PDF 다운로드"}</span>
            </button>

            {/* 바로보기: 타이핑 스킵 + DOM 치환으로 일관 */}
            <button
              className="generate-toolbar-btn"
              onClick={() => {
                if (isTypingComplete || loading) return;
                if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

                const tmp = document.createElement("div");
                tmp.innerHTML = processedHtml;
                const imgs = Array.from(tmp.querySelectorAll("img"));
                const urls = [];
                imgs.forEach((img, i) => {
                  urls.push(img.getAttribute("src") || "");
                  img.replaceWith(document.createComment(`IMG_PLACEHOLDER_${i}`));
                });

                setImageUrls(urls);
                setDisplayedContent(tmp.innerHTML); // 플레이스홀더 포함 전체
                setIsTypingComplete(true);
              }}
              disabled={loading || isTypingComplete}
            >
              <span className="generate-toolbar-btn-icon">⚡</span>
              <span>{isTypingComplete ? "전체 표시됨" : "바로보기"}</span>
            </button>

            <button
              className="generate-toolbar-btn"
              onClick={() => contentRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
              disabled={loading}
            >
              <span className="generate-toolbar-btn-icon">⬆️</span>
              <span>맨 위로</span>
            </button>

            <button
              className="generate-toolbar-btn"
              onClick={() => {
                const text = contentRef.current?.textContent || "";
                const chars = text.replace(/\s/g, "").length;
                const totalChars = text.length;
                const readingTime = Math.ceil(chars / 500);
                alert(
                  `📖 예상 읽기 시간: ${readingTime}분\n` +
                  `📝 글자 수: ${chars.toLocaleString()}자 (공백 포함: ${totalChars.toLocaleString()}자)\n` +
                  `🖼️ 이미지: ${imageUrls.length}개\n` +
                  `📊 진행률: ${Math.round(readingProgress)}%`
                );
              }}
              disabled={loading || !isTypingComplete}
            >
              <span className="generate-toolbar-btn-icon">📊</span>
              <span>통계</span>
            </button>
          </div>

          {/* 콘텐츠 */}
          <div className="generate-modal-content" ref={contentRef}>
            {loading ? (
              <div className="generate-loading-container">
                <div className="generate-loading-spinner"></div>
                <div className="generate-loading-text">
                  AI가 마법같은 콘텐츠를 생성하고 있어요
                  <span className="generate-loading-dots"></span>
                </div>
              </div>
            ) : (
              <article
                className="generate-content-article"
                dangerouslySetInnerHTML={{ __html: finalContent }}
              />
            )}
          </div>
        </div>
      </div>

      {/* 풀스크린 이미지 뷰어 */}
      {isFullscreen && (
        <div className="fullscreen-overlay" onClick={() => setIsFullscreen(false)}>
          <img
            src={fullscreenImage}
            alt="풀스크린 이미지"
            className="fullscreen-image"
            onClick={(e) => e.stopPropagation()}
          />
          <button className="fullscreen-close" onClick={() => setIsFullscreen(false)}>✕</button>
        </div>
      )}
    </>
  );
}
