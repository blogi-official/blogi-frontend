// src/components/admin/ClovaPreviewModal.jsx
import React from "react";
import { getKeywordPreview, requestRegenerate } from "../../api/admin";

export default function ClovaPreviewModal({ open, keywordId, onClose }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [pv, setPv] = React.useState(null);
  const [regening, setRegening] = React.useState(false);

  // CSS 주입 함수
  const injectStyles = () => {
    const styleId = 'clova-preview-modal-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .clova-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(12px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        animation: clovaModalFadeIn 0.4s ease-out;
      }

      @keyframes clovaModalFadeIn {
        from {
          opacity: 0;
          backdrop-filter: blur(0px);
        }
        to {
          opacity: 1;
          backdrop-filter: blur(12px);
        }
      }

      .clova-modal-container {
        width: 100%;
        max-width: 1024px;
        max-height: 85vh;
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95));
        backdrop-filter: blur(20px);
        border-radius: 24px;
        border: 1px solid rgba(139, 92, 246, 0.3);
        box-shadow: 
          0 25px 50px rgba(0, 0, 0, 0.4),
          0 0 0 1px rgba(139, 92, 246, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
        overflow: hidden;
        animation: clovaModalSlideIn 0.4s ease-out;
        position: relative;
      }

      .clova-modal-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #8b5cf6, #ec4899, #06b6d4, #8b5cf6);
        background-size: 200% 100%;
        animation: clovaGradientShift 3s ease-in-out infinite;
      }

      @keyframes clovaGradientShift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }

      @keyframes clovaModalSlideIn {
        from {
          opacity: 0;
          transform: translateY(-30px) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .clova-modal-content {
        padding: 2rem;
        overflow-y: auto;
        max-height: calc(85vh - 4px);
      }

      .clova-modal-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 1.5rem;
        padding-bottom: 1.5rem;
        border-bottom: 2px solid rgba(139, 92, 246, 0.2);
      }

      .clova-modal-title-section {
        flex: 1;
      }

      .clova-modal-title {
        font-size: 1.75rem;
        font-weight: 800;
        background: linear-gradient(135deg, #a855f7, #ec4899, #06b6d4);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        animation: clovaTextShimmer 2s ease-in-out infinite;
      }

      @keyframes clovaTextShimmer {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }

      .clova-modal-ai-icon {
        font-size: 2rem;
        animation: clovaIconPulse 2s ease-in-out infinite;
      }

      @keyframes clovaIconPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }

      .clova-modal-id {
        color: #8b5cf6;
        font-weight: 600;
      }

      .clova-modal-date {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.7);
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .clova-modal-close {
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2));
        color: #fca5a5;
        border: 1px solid rgba(239, 68, 68, 0.3);
        padding: 0.75rem 1.5rem;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        backdrop-filter: blur(10px);
      }

      .clova-modal-close:hover {
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(220, 38, 38, 0.3));
        transform: translateY(-1px);
        box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
      }

      .clova-modal-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
      }

      .clova-modal-button {
        padding: 0.875rem 1.5rem;
        border: none;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        white-space: nowrap;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .clova-modal-button-refresh {
        background: linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(59, 130, 246, 0.2));
        color: #7dd3fc;
      }

      .clova-modal-button-refresh:hover:not(:disabled) {
        background: linear-gradient(135deg, rgba(14, 165, 233, 0.3), rgba(59, 130, 246, 0.3));
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(14, 165, 233, 0.4);
      }

      .clova-modal-button-regenerate {
        background: linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(168, 85, 247, 0.2));
        color: #f0abfc;
      }

      .clova-modal-button-regenerate:hover:not(:disabled) {
        background: linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(168, 85, 247, 0.3));
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(236, 72, 153, 0.4);
      }

      .clova-modal-button-disabled {
        background: rgba(107, 114, 128, 0.2);
        color: rgba(156, 163, 175, 0.8);
        cursor: not-allowed;
        opacity: 0.6;
      }

      .clova-modal-body {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      .clova-modal-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 3rem;
        color: #a855f7;
        font-weight: 500;
      }

      .clova-modal-spinner {
        width: 32px;
        height: 32px;
        border: 3px solid rgba(168, 85, 247, 0.2);
        border-top: 3px solid #a855f7;
        border-radius: 50%;
        animation: clovaSpinnerRotate 1s linear infinite;
      }

      @keyframes clovaSpinnerRotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .clova-modal-error {
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
        border: 2px solid rgba(239, 68, 68, 0.3);
        color: #fca5a5;
        padding: 1.5rem;
        border-radius: 16px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        backdrop-filter: blur(10px);
      }

      .clova-modal-content-section {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
        border: 1px solid rgba(139, 92, 246, 0.2);
        border-radius: 20px;
        padding: 2rem;
        backdrop-filter: blur(10px);
        position: relative;
        overflow: hidden;
      }

      .clova-modal-content-section::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(236, 72, 153, 0.05));
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      }

      .clova-modal-content-section:hover::before {
        opacity: 1;
      }

      .clova-modal-ai-content {
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.7;
        font-size: 1rem;
      }

      .clova-modal-ai-content h1,
      .clova-modal-ai-content h2,
      .clova-modal-ai-content h3 {
        color: #a855f7;
        font-weight: 700;
        margin-bottom: 1rem;
        margin-top: 1.5rem;
      }

      .clova-modal-ai-content h1:first-child,
      .clova-modal-ai-content h2:first-child,
      .clova-modal-ai-content h3:first-child {
        margin-top: 0;
      }

      .clova-modal-ai-content p {
        color: rgba(255, 255, 255, 0.85);
        margin-bottom: 1rem;
      }

      .clova-modal-ai-content ul,
      .clova-modal-ai-content ol {
        margin-bottom: 1rem;
        padding-left: 1.5rem;
      }

      .clova-modal-ai-content li {
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 0.5rem;
      }

      .clova-modal-ai-content strong {
        color: #ec4899;
        font-weight: 600;
      }

      .clova-modal-ai-content em {
        color: #06b6d4;
        font-style: italic;
      }

      .clova-modal-images-section {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
        border: 1px solid rgba(6, 182, 212, 0.2);
        border-radius: 20px;
        padding: 1.5rem;
        backdrop-filter: blur(10px);
      }

      .clova-modal-images-label {
        font-size: 1rem;
        font-weight: 700;
        color: #06b6d4;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .clova-modal-images-grid {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .clova-modal-image {
        width: 160px;
        height: 120px;
        object-fit: cover;
        border-radius: 12px;
        border: 2px solid rgba(6, 182, 212, 0.3);
        transition: all 0.3s ease;
        cursor: pointer;
      }

      .clova-modal-image:hover {
        transform: scale(1.05);
        border-color: rgba(6, 182, 212, 0.6);
        box-shadow: 0 8px 25px rgba(6, 182, 212, 0.3);
      }

      .clova-modal-no-content {
        text-align: center;
        padding: 4rem 2rem;
        color: rgba(255, 255, 255, 0.6);
      }

      .clova-modal-no-content-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        display: block;
        opacity: 0.5;
      }

      .clova-modal-no-content-text {
        font-size: 1.2rem;
        font-weight: 500;
      }

      @media (max-width: 768px) {
        .clova-modal-overlay {
          padding: 0.5rem;
        }

        .clova-modal-content {
          padding: 1.5rem;
        }

        .clova-modal-header {
          flex-direction: column;
          align-items: stretch;
          gap: 1rem;
        }

        .clova-modal-title {
          font-size: 1.5rem;
        }

        .clova-modal-actions {
          flex-direction: column;
          align-items: stretch;
        }

        .clova-modal-button {
          width: 100%;
          justify-content: center;
        }

        .clova-modal-images-grid {
          justify-content: center;
        }

        .clova-modal-image {
          width: 140px;
          height: 100px;
        }
      }
    `;
    document.head.appendChild(style);
  };

  React.useEffect(() => {
    if (open) {
      injectStyles();
    }
  }, [open]);

  // ESC로 닫기
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const reload = React.useCallback(async () => {
    if (!open || !keywordId) return;
    try {
      setLoading(true);
      setError("");
      const payload = await getKeywordPreview(keywordId);
      setPv(payload);
    } catch (e) {
      console.error("[ClovaPreviewModal] getKeywordPreview error:", e);
      setError(e?.response?.data?.detail || e?.message || "미리보기를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [open, keywordId]);

  React.useEffect(() => {
    reload();
  }, [reload]);

  const handleRegenerate = async () => {
    if (!keywordId) return;
    try {
      setRegening(true);
      await requestRegenerate(keywordId);
      // 재생성 완료 후 재조회
      await reload();
      alert("재생성 요청을 완료했어요. 결과가 반영되었는지 확인하세요.");
    } catch (e) {
      console.error("[ClovaPreviewModal] requestRegenerate error:", e);
      alert(e?.response?.data?.detail || e?.message || "재생성 요청에 실패했습니다.");
    } finally {
      setRegening(false);
    }
  };

  if (!open) return null;

  const createdAt = pv?.created_at
    ? new Date(pv.created_at).toLocaleString("ko-KR")
    : "-";

  const images = [pv?.image_1_url, pv?.image_2_url, pv?.image_3_url].filter(Boolean);

  return (
    <div className="clova-modal-overlay" onClick={onClose}>
      <div className="clova-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="clova-modal-content">
          {/* 헤더 */}
          <div className="clova-modal-header">
            <div className="clova-modal-title-section">
              <h3 className="clova-modal-title">
                <span className="clova-modal-ai-icon">🤖</span>
                Clova AI 미리보기
                <span className="clova-modal-id">#{keywordId}</span>
              </h3>
              <p className="clova-modal-date">
                ⏰ 생성일: {createdAt}
              </p>
            </div>
            <button onClick={onClose} className="clova-modal-close">
              ✕ 닫기
            </button>
          </div>

          {/* 액션 바 */}
          <div className="clova-modal-actions">
            <button
              onClick={reload}
              disabled={loading}
              className={`clova-modal-button ${
                loading 
                  ? 'clova-modal-button-disabled' 
                  : 'clova-modal-button-refresh'
              }`}
            >
              {loading ? '🔄 새로고침 중...' : '🔄 새로고침'}
            </button>
            <button
              onClick={handleRegenerate}
              disabled={regening}
              className={`clova-modal-button ${
                regening 
                  ? 'clova-modal-button-disabled' 
                  : 'clova-modal-button-regenerate'
              }`}
            >
              {regening ? '✨ 재생성 중...' : '✨ Clova 재생성 요청'}
            </button>
          </div>

          {/* 본문 */}
          <div className="clova-modal-body">
            {/* 로딩 */}
            {loading && (
              <div className="clova-modal-loading">
                <div className="clova-modal-spinner"></div>
                <span>AI 미리보기를 불러오는 중...</span>
              </div>
            )}

            {/* 에러 */}
            {!!error && (
              <div className="clova-modal-error">
                ❌ {error}
              </div>
            )}

            {/* AI 생성 콘텐츠 */}
            {pv?.content && !loading && !error && (
              <div className="clova-modal-content-section">
                <div 
                  className="clova-modal-ai-content"
                  dangerouslySetInnerHTML={{ __html: pv.content }} 
                />
              </div>
            )}

            {/* 대표 이미지들 */}
            {images.length > 0 && !loading && !error && (
              <div className="clova-modal-images-section">
                <div className="clova-modal-images-label">
                  🖼️ 대표 이미지
                </div>
                <div className="clova-modal-images-grid">
                  {images.map((src, i) => (
                    <img
                      key={i}
                      alt={`AI 생성 이미지 ${i + 1}`}
                      src={src}
                      className="clova-modal-image"
                      onClick={() => window.open(src, '_blank')}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 콘텐츠 없음 */}
            {!pv?.content && !loading && !error && (
              <div className="clova-modal-no-content">
                <span className="clova-modal-no-content-icon">🤖</span>
                <div className="clova-modal-no-content-text">
                  아직 AI가 생성한 콘텐츠가 없습니다
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}