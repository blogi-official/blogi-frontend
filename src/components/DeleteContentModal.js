import React, { useState, useEffect } from "react";
import { api } from "../api/client";

/** DELETE /user/posts/:id/ */
const DeleteContentModal = ({ post, onClose, onDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // CSS 주입 함수
  const injectStyles = () => {
    const styleId = 'delete-content-modal-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .delete-content-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
        backdrop-filter: blur(8px);
      }

      .delete-content-modal {
        background: white;
        border-radius: 20px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        width: 90vw;
        max-width: 600px;
        overflow: hidden;
        animation: deleteContentSlide 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        position: relative;
        border: 2px solid #f59e0b;
      }

      @keyframes deleteContentSlide {
        from {
          opacity: 0;
          transform: translateY(-80px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .delete-content-header {
        background: linear-gradient(135deg, #f59e0b, #d97706);
        color: white;
        padding: 2rem;
        text-align: center;
        position: relative;
      }

      .delete-content-header::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 15px solid transparent;
        border-right: 15px solid transparent;
        border-top: 10px solid #d97706;
      }

      .delete-content-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }

      .delete-content-subtitle {
        font-size: 0.9rem;
        opacity: 0.95;
      }

      .delete-content-body {
        padding: 2rem;
      }

      .warning-message {
        background: linear-gradient(135deg, #fef3c7, #fde68a);
        border: 2px solid #f59e0b;
        border-radius: 15px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        text-align: center;
        position: relative;
      }

      .warning-message::before {
        content: '⚠️';
        position: absolute;
        top: -15px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #f59e0b, #d97706);
        color: white;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
      }

      .warning-text {
        color: #92400e;
        font-size: 0.95rem;
        line-height: 1.6;
        margin-top: 0.5rem;
      }

      .warning-highlight {
        background: linear-gradient(135deg, #dc2626, #b91c1c);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 6px;
        font-weight: 700;
        display: inline-block;
        margin: 0 0.25rem;
      }

      .content-preview {
        background: linear-gradient(135deg, #f8fafc, #f1f5f9);
        border: 2px solid #e2e8f0;
        border-radius: 15px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        position: relative;
      }

      .content-preview::before {
        content: '📄';
        position: absolute;
        top: -12px;
        left: 20px;
        background: white;
        padding: 0 0.5rem;
        font-size: 1.2rem;
      }

      .preview-title {
        font-size: 1rem;
        font-weight: 700;
        color: #374151;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .preview-item {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 1rem;
        padding: 0.75rem;
        background: white;
        border-radius: 10px;
        border-left: 4px solid #f59e0b;
      }

      .preview-item:last-child {
        margin-bottom: 0;
      }

      .preview-label {
        font-weight: 600;
        color: #6b7280;
        min-width: 60px;
        font-size: 0.9rem;
      }

      .preview-value {
        color: #374151;
        font-size: 0.9rem;
        line-height: 1.4;
        word-break: break-word;
      }

      .error-message {
        background: linear-gradient(135deg, #fef2f2, #fee2e2);
        border: 2px solid #fecaca;
        color: #dc2626;
        padding: 1rem 1.25rem;
        border-radius: 12px;
        margin-bottom: 1.5rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: errorBounce 0.5s ease-in-out;
      }

      @keyframes errorBounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
      }

      .delete-content-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        padding-top: 1.5rem;
        border-top: 2px solid #f1f5f9;
      }

      .btn-cancel {
        background: linear-gradient(135deg, #64748b, #475569);
        color: white;
        border: none;
        padding: 0.875rem 2rem;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .btn-cancel:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(100, 116, 139, 0.4);
      }

      .btn-delete-content {
        background: linear-gradient(135deg, #f59e0b, #d97706);
        color: white;
        border: none;
        padding: 0.875rem 2rem;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        position: relative;
        overflow: hidden;
      }

      .btn-delete-content:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(245, 158, 11, 0.5);
        background: linear-gradient(135deg, #d97706, #b45309);
      }

      .btn-delete-content:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }

      .loading-spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @media (max-width: 768px) {
        .delete-content-modal {
          width: 95vw;
          margin: 1rem;
        }

        .delete-content-header {
          padding: 1.5rem;
        }

        .delete-content-body {
          padding: 1.5rem;
        }

        .delete-content-title {
          font-size: 1.3rem;
        }

        .delete-content-actions {
          flex-direction: column;
        }

        .btn-cancel, .btn-delete-content {
          justify-content: center;
        }

        .preview-item {
          flex-direction: column;
          gap: 0.5rem;
        }

        .preview-label {
          min-width: auto;
        }
      }
    `;
    document.head.appendChild(style);
  };

  useEffect(() => {
    injectStyles();
  }, []);

  const handleDelete = async () => {
    if (!post?.id || loading) return;
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/user/posts/${post.id}/`);
      onDeleted?.(post);
      onClose?.();
    } catch (err) {
      const r = err?.response?.data;
      setError((typeof r === "string" && r) || r?.detail || "삭제 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "-";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div className="delete-content-overlay">
      <div className="delete-content-modal">
        <div className="delete-content-header">
          <h2 className="delete-content-title">
            🗑️ 콘텐츠 삭제
          </h2>
          <div className="delete-content-subtitle">
            선택한 콘텐츠를 삭제합니다
          </div>
        </div>

        <div className="delete-content-body">
          <div className="warning-message">
            <div className="warning-text">
              아래 콘텐츠를 삭제하시겠습니까?
              <br />
              이 작업은
              <span className="warning-highlight">되돌릴 수 없습니다</span>
            </div>
          </div>

          <div className="content-preview">
            <div className="preview-title">
              📋 삭제될 콘텐츠 정보
            </div>
            
            <div className="preview-item">
              <span className="preview-label">ID:</span>
              <span className="preview-value">{post?.id ?? "-"}</span>
            </div>
            
            <div className="preview-item">
              <span className="preview-label">제목:</span>
              <span className="preview-value">{truncateText(post?.title, 80)}</span>
            </div>
            
            {post?.content && (
              <div className="preview-item">
                <span className="preview-label">내용:</span>
                <span className="preview-value">{truncateText(post?.content, 120)}</span>
              </div>
            )}
            
            {post?.created_at && (
              <div className="preview-item">
                <span className="preview-label">작성일:</span>
                <span className="preview-value">
                  {new Date(post.created_at).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            )}
          </div>

          {error && (
            <div className="error-message" role="alert">
              ❌ {error}
            </div>
          )}

          <div className="delete-content-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
              style={{ outline: 'none' }}
            >
              ↩️ 취소
            </button>
            <button
              type="button"
              className="btn-delete-content"
              onClick={handleDelete}
              disabled={loading}
              style={{ outline: 'none' }}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  삭제 중...
                </>
              ) : (
                <>
                  🗑️ 삭제하기
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteContentModal;



