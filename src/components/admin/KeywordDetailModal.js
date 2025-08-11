// src/components/admin/KeywordDetailModal.jsx
import React from "react";
import {
  getKeywordDetail,
  updateKeywordTitle,
  toggleKeywordActive,
} from "../../api/admin";

export default function KeywordDetailModal({ open, keywordId, onClose, onChanged }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [data, setData] = React.useState(null);

  const [title, setTitle] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [toggling, setToggling] = React.useState(false);

  // CSS 주입 함수
  const injectStyles = () => {
    const styleId = 'keyword-detail-modal-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .keyword-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        animation: keywordModalFadeIn 0.3s ease-out;
      }

      @keyframes keywordModalFadeIn {
        from {
          opacity: 0;
          backdrop-filter: blur(0px);
        }
        to {
          opacity: 1;
          backdrop-filter: blur(8px);
        }
      }

      .keyword-modal-container {
        width: 100%;
        max-width: 960px;
        max-height: 85vh;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 24px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        overflow: hidden;
        animation: keywordModalSlideIn 0.3s ease-out;
        position: relative;
      }

      .keyword-modal-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #667eea, #764ba2);
      }

      @keyframes keywordModalSlideIn {
        from {
          opacity: 0;
          transform: translateY(-20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .keyword-modal-content {
        padding: 2rem;
        overflow-y: auto;
        max-height: calc(85vh - 4px);
      }

      .keyword-modal-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 2px solid rgba(102, 126, 234, 0.1);
      }

      .keyword-modal-title-section {
        flex: 1;
      }

      .keyword-modal-title {
        font-size: 1.75rem;
        font-weight: 800;
        color: #1f2937;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .keyword-modal-id {
        color: #667eea;
        font-weight: 600;
      }

      .keyword-modal-date {
        font-size: 0.9rem;
        color: #6b7280;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .keyword-modal-close {
        background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
        color: #374151;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .keyword-modal-close:hover {
        background: linear-gradient(135deg, #e5e7eb, #d1d5db);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .keyword-modal-body {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      .keyword-modal-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 3rem;
        color: #667eea;
        font-weight: 500;
      }

      .keyword-modal-spinner {
        width: 24px;
        height: 24px;
        border: 3px solid rgba(102, 126, 234, 0.2);
        border-top: 3px solid #667eea;
        border-radius: 50%;
        animation: keywordModalSpin 1s linear infinite;
      }

      @keyframes keywordModalSpin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .keyword-modal-error {
        background: linear-gradient(135deg, #fef2f2, #fee2e2);
        border: 2px solid #fecaca;
        color: #dc2626;
        padding: 1.5rem;
        border-radius: 16px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .keyword-modal-section {
        background: rgba(255, 255, 255, 0.7);
        border: 1px solid rgba(102, 126, 234, 0.1);
        border-radius: 16px;
        padding: 1.5rem;
        transition: all 0.3s ease;
      }

      .keyword-modal-section:hover {
        background: rgba(255, 255, 255, 0.9);
        border-color: rgba(102, 126, 234, 0.2);
        transform: translateY(-1px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      }

      .keyword-modal-label {
        display: block;
        font-size: 0.9rem;
        font-weight: 700;
        color: #374151;
        margin-bottom: 0.75rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .keyword-modal-input-group {
        display: flex;
        gap: 0.75rem;
        align-items: stretch;
      }

      .keyword-modal-input {
        flex: 1;
        padding: 0.875rem 1.25rem;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        font-size: 1rem;
        transition: all 0.3s ease;
        background: white;
      }

      .keyword-modal-input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        transform: translateY(-1px);
      }

      .keyword-modal-button {
        padding: 0.875rem 1.5rem;
        border: none;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        white-space: nowrap;
      }

      .keyword-modal-button-primary {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
      }

      .keyword-modal-button-primary:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
      }

      .keyword-modal-button-success {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
      }

      .keyword-modal-button-success:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
      }

      .keyword-modal-button-warning {
        background: linear-gradient(135deg, #f59e0b, #d97706);
        color: white;
      }

      .keyword-modal-button-warning:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
      }

      .keyword-modal-button-disabled {
        background: #9ca3af;
        color: white;
        cursor: not-allowed;
        opacity: 0.7;
      }

      .keyword-modal-toggle-section {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        background: linear-gradient(135deg, #f8fafc, #f1f5f9);
        border: 2px solid #e2e8f0;
        border-radius: 16px;
        padding: 1.5rem;
        transition: all 0.3s ease;
      }

      .keyword-modal-toggle-section:hover {
        border-color: #667eea;
        background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
      }

      .keyword-modal-toggle-info {
        flex: 1;
      }

      .keyword-modal-toggle-label {
        font-size: 0.9rem;
        color: #64748b;
        margin-bottom: 0.25rem;
      }

      .keyword-modal-toggle-status {
        font-size: 1.1rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .keyword-modal-toggle-active {
        color: #059669;
      }

      .keyword-modal-toggle-inactive {
        color: #d97706;
      }

      .keyword-modal-content-box {
        background: linear-gradient(135deg, #f8fafc, #f1f5f9);
        border: 2px solid #e2e8f0;
        border-radius: 16px;
        padding: 1.5rem;
        white-space: pre-wrap;
        color: #374151;
        line-height: 1.6;
        font-size: 0.95rem;
        max-height: 300px;
        overflow-y: auto;
      }

      .keyword-modal-generated-content {
        background: white;
        border: 2px solid #e2e8f0;
        border-radius: 16px;
        padding: 1.5rem;
        max-height: 400px;
        overflow-y: auto;
      }

      .keyword-modal-generated-content h1,
      .keyword-modal-generated-content h2,
      .keyword-modal-generated-content h3 {
        color: #1f2937;
        font-weight: 700;
        margin-bottom: 1rem;
      }

      .keyword-modal-generated-content p {
        color: #374151;
        line-height: 1.7;
        margin-bottom: 1rem;
      }

      .keyword-modal-generated-content ul,
      .keyword-modal-generated-content ol {
        margin-bottom: 1rem;
        padding-left: 1.5rem;
      }

      .keyword-modal-generated-content li {
        color: #374151;
        line-height: 1.6;
        margin-bottom: 0.5rem;
      }

      @media (max-width: 768px) {
        .keyword-modal-overlay {
          padding: 0.5rem;
        }

        .keyword-modal-content {
          padding: 1.5rem;
        }

        .keyword-modal-header {
          flex-direction: column;
          align-items: stretch;
          gap: 1rem;
        }

        .keyword-modal-title {
          font-size: 1.5rem;
        }

        .keyword-modal-input-group {
          flex-direction: column;
        }

        .keyword-modal-toggle-section {
          flex-direction: column;
          align-items: stretch;
          text-align: center;
        }

        .keyword-modal-button {
          width: 100%;
          justify-content: center;
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
      const payload = await getKeywordDetail(keywordId);
  
      const raw = payload?.data ?? payload ?? {};
  
      setData(prev => {
        const normalized = {
          title: raw.title ?? "",
          article: {
            content: raw.content ?? "",
            origin_link: raw.original_url ?? null,
          },
          generated_post: {
            image_1_url: raw.image_1_url ?? null,
            image_2_url: raw.image_2_url ?? null,
            image_3_url: raw.image_3_url ?? null,
            content: raw.generated_post?.content ?? null,
          },
          // 🔴 응답에 없으면 이전값 유지, 그래도 없으면 기본 true (백엔드 기본과 일치)
          is_active: (raw.is_active ?? prev?.is_active) ?? true,
          created_at: raw.created_at ?? prev?.created_at ?? null,
        };
        return normalized;
      });
  
      setTitle((payload?.data ?? payload)?.title ?? "");
    } catch (e) {
      console.error("[KeywordDetailModal] getKeywordDetail error:", e);
      setError(e?.response?.data?.detail || e?.message || "상세 조회에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [open, keywordId]);
  

  React.useEffect(() => {
    reload();
  }, [reload]);

  const handleSaveTitle = async () => {
    const next = title.trim();
    if (!next) {
      alert("제목을 입력해주세요.");
      return;
    }
    try {
      setSaving(true);
      await updateKeywordTitle(keywordId, { title: next });
      await reload();
      onChanged?.({ title: next });
    } catch (e) {
      console.error("[KeywordDetailModal] updateKeywordTitle error:", e);
      alert(e?.response?.data?.detail || e?.message || "제목 수정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async () => {
      if (!keywordId) return;
      try {
        setToggling(true);
        const res = await toggleKeywordActive(keywordId); // ← 1)에서 {id,title,is_active}만 오도록 수정함
        const nextActive = Boolean(res?.is_active);
  
        // UI 즉시 반영
        setData(prev => prev ? { ...prev, is_active: nextActive } : { is_active: nextActive });
  
        // 부모 콜백이 구조분해 파라미터여도 안전하게 객체 전달
        if (typeof onChanged === "function") {
          try { onChanged({ is_active: nextActive, title: res?.title }); } catch (err) { console.warn(err); }
        }
  
        // (선택) 서버와 완전 동기화 원하면 주석 해제
        // await reload();
      } catch (e) {
        console.error("[KeywordDetailModal] toggleKeywordActive error:", e);
        alert(e?.response?.data?.detail || e?.message || "공개 토글에 실패했습니다.");
      } finally {
        setToggling(false);
      }
    };

  if (!open) return null;

  const articleText = data?.article?.content ?? data?.article?.body ?? "(기사 본문 없음)";
  const createdAt = data?.created_at
    ? new Date(data.created_at).toLocaleString("ko-KR")
    : "-";

  return (
    <div className="keyword-modal-overlay" onClick={onClose}>
      <div className="keyword-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="keyword-modal-content">
          {/* 헤더 */}
          <div className="keyword-modal-header">
            <div className="keyword-modal-title-section">
              <h3 className="keyword-modal-title">
                🔑 키워드 상세 
                <span className="keyword-modal-id">#{keywordId}</span>
              </h3>
              <p className="keyword-modal-date">
                📅 생성일: {createdAt}
              </p>
            </div>
            <button onClick={onClose} className="keyword-modal-close">
              ✕ 닫기
            </button>
          </div>

          {/* 본문 */}
          <div className="keyword-modal-body">
            {/* 로딩 */}
            {loading && (
              <div className="keyword-modal-loading">
                <div className="keyword-modal-spinner"></div>
                <span>상세 정보를 불러오는 중...</span>
              </div>
            )}

            {/* 에러 */}
            {!!error && (
              <div className="keyword-modal-error">
                ❌ {error}
              </div>
            )}

            {/* 데이터 */}
            {data && !loading && !error && (
              <>
                {/* 제목 수정 */}
                <div className="keyword-modal-section">
                  <label className="keyword-modal-label">
                    ✏️ 제목 수정
                  </label>
                  <div className="keyword-modal-input-group">
                    <input
                      className="keyword-modal-input"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="제목을 입력하세요"
                    />
                    <button
                      onClick={handleSaveTitle}
                      disabled={saving}
                      className={`keyword-modal-button ${
                        saving 
                          ? 'keyword-modal-button-disabled' 
                          : 'keyword-modal-button-primary'
                      }`}
                    >
                      {saving ? '💾 저장 중...' : '💾 제목 저장'}
                    </button>
                  </div>
                </div>

                {/* 공개 토글 */}
                <div className="keyword-modal-toggle-section">
                  <div className="keyword-modal-toggle-info">
                    <div className="keyword-modal-toggle-label">공개 상태</div>
                    <div className={`keyword-modal-toggle-status ${
                      data.is_active 
                        ? 'keyword-modal-toggle-active' 
                        : 'keyword-modal-toggle-inactive'
                    }`}>
                      {data.is_active ? '🟢 공개' : '🟡 비공개'}
                    </div>
                  </div>
                  <button
                    onClick={handleToggle}
                    disabled={toggling}
                    className={`keyword-modal-button ${
                      toggling
                        ? 'keyword-modal-button-disabled'
                        : data.is_active
                        ? 'keyword-modal-button-warning'
                        : 'keyword-modal-button-success'
                    }`}
                  >
                    {toggling
                      ? '⏳ 처리 중...'
                      : data.is_active
                      ? '🔒 비공개로 전환'
                      : '🔓 공개로 전환'}
                  </button>
                </div>

                {/* 기사 본문 */}
                <div className="keyword-modal-section">
                  <div className="keyword-modal-label">
                    📰 기사 본문
                  </div>
                  <div className="keyword-modal-content-box">
                    {articleText}
                  </div>
                </div>

                {/* 기존 생성글 요약 */}
                {data.generated_post?.content && (
                  <div className="keyword-modal-section">
                    <div className="keyword-modal-label">
                      🤖 AI 생성 콘텐츠
                    </div>
                    <div 
                      className="keyword-modal-generated-content"
                      dangerouslySetInnerHTML={{
                        __html: data.generated_post.content,
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}