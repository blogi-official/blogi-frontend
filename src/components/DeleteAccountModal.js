// src/components/DeleteAccountModal.js
import React, { useEffect, useRef, useState } from "react";
import { api } from "../api/client";

const DeleteAccountModal = ({
  onClose,              // 모달 닫기 콜백
  onDeleted,            // 탈퇴 성공 후 콜백(예: 로그아웃/리다이렉트)
  endpoint = "/user/",  // 백엔드 DELETE 경로 (확정)
}) => {
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState(null);
  const dialogRef = useRef(null);

  // CSS 주입 함수
  const injectStyles = () => {
    const styleId = 'delete-account-modal-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .delete-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
        backdrop-filter: blur(10px);
      }

      .delete-modal {
        background: white;
        border-radius: 20px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
        width: 90vw;
        max-width: 500px;
        overflow: hidden;
        animation: dangerModalSlide 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        position: relative;
        border: 3px solid #ef4444;
      }

      @keyframes dangerModalSlide {
        from {
          opacity: 0;
          transform: translateY(-100px) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .delete-header {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
        padding: 2rem;
        text-align: center;
        position: relative;
      }

      .delete-header::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 15px solid transparent;
        border-right: 15px solid transparent;
        border-top: 10px solid #dc2626;
      }

      .delete-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }

      .delete-subtitle {
        font-size: 0.9rem;
        opacity: 0.95;
      }

      .delete-content {
        padding: 2rem;
      }

      .warning-section {
        background: linear-gradient(135deg, #fef2f2, #fee2e2);
        border: 2px solid #fecaca;
        border-radius: 15px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        position: relative;
      }

      .warning-icon {
        position: absolute;
        top: -15px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        font-weight: bold;
      }

      .warning-text {
        color: #991b1b;
        font-size: 0.95rem;
        line-height: 1.6;
        text-align: center;
        margin-top: 0.5rem;
      }

      .warning-highlight {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 6px;
        font-weight: 700;
        display: inline-block;
        margin: 0 0.25rem;
      }

      .consequences-list {
        background: #f8fafc;
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        border-left: 4px solid #ef4444;
      }

      .consequences-title {
        font-size: 1rem;
        font-weight: 700;
        color: #374151;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .consequences-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
        color: #64748b;
        font-size: 0.9rem;
      }

      .consequences-item:last-child {
        margin-bottom: 0;
      }

      .agreement-section {
        background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        border: 2px solid #cbd5e1;
      }

      .agreement-checkbox {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        cursor: pointer;
        user-select: none;
      }

      .custom-checkbox {
        width: 20px;
        height: 20px;
        border: 2px solid #cbd5e1;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
        transition: all 0.3s ease;
        flex-shrink: 0;
        margin-top: 2px;
      }

      .custom-checkbox.checked {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        border-color: #ef4444;
        color: white;
      }

      .agreement-text {
        color: #374151;
        font-size: 0.95rem;
        line-height: 1.5;
        font-weight: 500;
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
        animation: errorPulse 0.5s ease-in-out;
      }

      @keyframes errorPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
      }

      .delete-actions {
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

      .btn-delete {
        background: linear-gradient(135deg, #ef4444, #dc2626);
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

      .btn-delete:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(239, 68, 68, 0.5);
        background: linear-gradient(135deg, #dc2626, #b91c1c);
      }

      .btn-delete:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
        background: #9ca3af;
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
        .delete-modal {
          width: 95vw;
          margin: 1rem;
        }

        .delete-header {
          padding: 1.5rem;
        }

        .delete-content {
          padding: 1.5rem;
        }

        .delete-title {
          font-size: 1.3rem;
        }

        .delete-actions {
          flex-direction: column;
        }

        .btn-cancel, .btn-delete {
          justify-content: center;
        }
      }
    `;
    document.head.appendChild(style);
  };

  useEffect(() => {
    injectStyles();
  }, []);

  // ESC로 닫기
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !loading && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loading, onClose]);

  // 배경 클릭으로 닫기 (모달 외부 클릭)
  const handleBackdrop = (e) => {
    if (loading) return;
    if (dialogRef.current && !dialogRef.current.contains(e.target)) {
      onClose?.();
    }
  };

  const handleDelete = async () => {
    if (!agree || loading) return;
    setError(null);
    setLoading(true);

    try {
      await api.delete(endpoint);
    } catch (err) {
      console.error("[회원 탈퇴 실패]", err?.response?.status, err?.response?.data);

      const status = err?.response?.status;
      const data = err?.response?.data;

      if (status === 401) {
        setError("로그인이 필요합니다. 다시 로그인해 주세요.");
      } else if (status === 403) {
        setError("이 작업을 수행할 권한이 없습니다.");
      } else {
        const msg =
          (typeof data === "string" && data) ||
          data?.detail ||
          (typeof data === "object" ? Object.values(data).flat().join(" ") : null) ||
          "탈퇴 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
        setError(msg);
      }
      setLoading(false);
      return; // 실패 종료
    }

    // 네트워크 성공 → 콜백은 분리 실행
    try {
      onDeleted?.();
    } catch (cbErr) {
      console.error("[onDeleted 콜백 에러]", cbErr);
    }

    try {
      onClose?.();
    } catch (cbErr) {
      console.error("[onClose 콜백 에러]", cbErr);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="delete-overlay"
      onMouseDown={handleBackdrop}
      aria-modal="true"
      role="dialog"
      aria-labelledby="delete-title"
      aria-describedby="delete-desc"
    >
      <div
        ref={dialogRef}
        className="delete-modal"
        onMouseDown={(e) => e.stopPropagation()} // 내부 클릭 버블링 차단
      >
        <div className="delete-header">
          <h2 id="delete-title" className="delete-title">
            🚨 회원 탈퇴
          </h2>
          <div className="delete-subtitle">
            신중하게 결정해 주세요
          </div>
        </div>

        <div className="delete-content">
          <div className="warning-section">
            <div className="warning-icon">!</div>
            <div className="warning-text">
              탈퇴 시 작성한 콘텐츠 및 이용 기록이 삭제되며
              <span className="warning-highlight">복구가 불가능</span>
              합니다.
              <br />
              정말로 탈퇴하시겠습니까?
            </div>
          </div>

          <div className="consequences-list">
            <div className="consequences-title">
              📋 탈퇴 시 삭제되는 정보
            </div>
            <div className="consequences-item">
              <span>🗑️</span>
              <span>작성한 모든 콘텐츠 및 댓글</span>
            </div>
            <div className="consequences-item">
              <span>📊</span>
              <span>활동 기록 및 통계 정보</span>
            </div>
            <div className="consequences-item">
              <span>⚙️</span>
              <span>개인 설정 및 관심사 정보</span>
            </div>
            <div className="consequences-item">
              <span>🔐</span>
              <span>계정 정보 및 로그인 권한</span>
            </div>
          </div>

          <div className="agreement-section">
            <label className="agreement-checkbox">
              <div className={`custom-checkbox ${agree ? 'checked' : ''}`}>
                {agree && '✓'}
              </div>
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                disabled={loading}
                style={{ display: 'none' }}
              />
              <span className="agreement-text">
                안내 사항을 모두 확인했으며, 회원 탈퇴에 동의합니다.
              </span>
            </label>
          </div>

          {error && (
            <div className="error-message" role="alert">
              ⚠️ {error}
            </div>
          )}

          <div className="delete-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => {
                if (loading) return;
                setError(null);
                onClose?.();
              }}
              disabled={loading}
              style={{ outline: 'none' }}
            >
              ↩️ 취소
            </button>
            <button
              type="button"
              className="btn-delete"
              onClick={handleDelete}
              disabled={!agree || loading}
              style={{ outline: 'none' }}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  탈퇴 처리 중...
                </>
              ) : (
                <>
                  🗑️ 탈퇴하기
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;

