import React, { useState, useEffect, useRef } from "react";
import { api } from "../api/client";

const categoryOptions = ["연예", "경제", "스포츠", "야구", "드라마", "패션", "자동차", "여행", "맛집"];

const NicknameEditModal = ({ user = {}, onClose, onNicknameUpdated }) => {
  const initialized = useRef(false);

  const [nickname, setNickname] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // CSS 주입 함수
  const injectStyles = () => {
    const styleId = 'nickname-edit-modal-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .nickname-overlay {
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
        backdrop-filter: blur(10px);
      }

      .nickname-modal {
        background: white;
        border-radius: 20px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        width: 90vw;
        max-width: 600px;
        overflow: hidden;
        animation: modalBounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        position: relative;
      }

      @keyframes modalBounceIn {
        from {
          opacity: 0;
          transform: translateY(-100px) scale(0.8);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .nickname-header {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 2rem;
        text-align: center;
        position: relative;
      }

      .nickname-header::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 15px solid transparent;
        border-right: 15px solid transparent;
        border-top: 10px solid #764ba2;
      }

      .nickname-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }

      .nickname-subtitle {
        font-size: 0.9rem;
        opacity: 0.9;
      }

      .nickname-form {
        padding: 2rem;
      }

      .form-group {
        margin-bottom: 2rem;
      }

      .form-label {
        display: block;
        font-size: 1rem;
        font-weight: 600;
        color: #374151;
        margin-bottom: 0.75rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .nickname-input {
        width: 100%;
        padding: 1rem 1.25rem;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        font-size: 1rem;
        transition: all 0.3s ease;
        background: linear-gradient(135deg, #f8fafc, #ffffff);
      }

      .nickname-input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        transform: translateY(-2px);
      }

      .char-counter {
        text-align: right;
        font-size: 0.8rem;
        color: #64748b;
        margin-top: 0.5rem;
      }

      .categories-section {
        margin-bottom: 2rem;
      }

      .categories-label {
        font-size: 1rem;
        font-weight: 600;
        color: #374151;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .categories-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 0.75rem;
      }

      .category-btn {
        padding: 0.75rem 1rem;
        border: 2px solid #e2e8f0;
        border-radius: 25px;
        background: white;
        color: #64748b;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
        position: relative;
        overflow: hidden;
      }

      .category-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea, #764ba2);
        transition: left 0.3s ease;
        z-index: -1;
      }

      .category-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      }

      .category-btn.selected {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border-color: #667eea;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
      }

      .category-btn.selected::before {
        left: 0;
      }

      .category-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
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
        animation: errorShake 0.5s ease-in-out;
      }

      @keyframes errorShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }

      .form-actions {
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

      .btn-save {
        background: linear-gradient(135deg, #10b981, #059669);
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

      .btn-save:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
      }

      .btn-save:disabled {
        opacity: 0.7;
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

      .selected-count {
        background: linear-gradient(135deg, #f59e0b, #d97706);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 600;
        margin-left: 0.5rem;
      }

      @media (max-width: 768px) {
        .nickname-modal {
          width: 95vw;
          margin: 1rem;
        }

        .nickname-header {
          padding: 1.5rem;
        }

        .nickname-form {
          padding: 1.5rem;
        }

        .nickname-title {
          font-size: 1.3rem;
        }

        .categories-grid {
          grid-template-columns: repeat(2, 1fr);
        }

        .form-actions {
          flex-direction: column;
        }

        .btn-cancel, .btn-save {
          justify-content: center;
        }
      }
    `;
    document.head.appendChild(style);
  };

  useEffect(() => {
    injectStyles();
  }, []);

  useEffect(() => {
    if (!initialized.current && user) {
      setNickname(user.nickname || "");
      setCategories(user.categories || []);
      initialized.current = true;
    }
  }, [user]);

  const toggleCategory = (category) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (nickname.trim().length === 0 || nickname.length > 20) {
      setError("닉네임은 1자 이상 20자 이하여야 합니다.");
      return;
    }
    if (categories.length === 0) {
      setError("관심사를 최소 1개 이상 선택하세요.");
      return;
    }

    setLoading(true);
    let data = null;

    // 1) 네트워크/검증 에러만 try/catch로 처리
    try {
      const res = await api.patch("/user/nickname/", { nickname, categories });
      data = res?.data ?? null;
    } catch (err) {
      console.error(
        "[닉네임 업데이트 실패 - 네트워크/검증]",
        err?.response?.status,
        err?.response?.data
      );

      const r = err?.response?.data;
      const msg =
        (typeof r === "string" && r) ||
        r?.detail ||
        (typeof r === "object" ? Object.values(r).flat().join(" ") : null) ||
        "수정 중 오류가 발생했습니다.";
      setError(msg);
      setLoading(false);
      return; // 실패면 여기서 종료
    }

    // 2) 콜백은 별도로 실행(여기서 에러 나도 catch로 떨어지지 않음)
    try {
      if (typeof onNicknameUpdated === "function") {
        onNicknameUpdated(data);
      }
    } catch (cbErr) {
      console.error("[onNicknameUpdated 콜백 에러]", cbErr);
      // UI에 붉은 오류를 띄우진 않음(성공 응답이므로)
    }

    try {
      if (typeof onClose === "function") onClose();
    } catch (cbErr) {
      console.error("[onClose 콜백 에러]", cbErr);
    } finally {
      setLoading(false);
      setError(null);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      '연예': '🎭',
      '경제': '💰',
      '스포츠': '⚽',
      "야구": "⚾",
      "드라마": "🎬",
      '패션': '👗',
      '자동차': '🚗',
      '여행': '✈️',
      '맛집': '🍽️'
    };
    return icons[category] || '📌';
  };

  if (!user) return null;

  return (
    <div className="nickname-overlay">
      <div className="nickname-modal">
        <div className="nickname-header">
          <h2 className="nickname-title">
            ✏️ 프로필 수정
          </h2>
          <div className="nickname-subtitle">
            닉네임과 관심사를 업데이트하세요
          </div>
        </div>

        <form onSubmit={handleSubmit} className="nickname-form">
          <div className="form-group">
            <label className="form-label">
              👤 닉네임
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="nickname-input"
              maxLength={20}
              required
              disabled={loading}
              placeholder="새로운 닉네임을 입력하세요"
            />
            <div className="char-counter">
              {nickname.length}/20자
            </div>
          </div>

          <div className="categories-section">
            <div className="categories-label">
              🎯 관심사 선택
              <span className="selected-count">
                {categories.length}개 선택됨
              </span>
            </div>
            <div className="categories-grid">
              {categoryOptions.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`category-btn ${categories.includes(cat) ? 'selected' : ''}`}
                  onClick={() => toggleCategory(cat)}
                  disabled={loading}
                >
                  {getCategoryIcon(cat)} {cat}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={() => {
                setError(null);
                if (typeof onClose === "function") onClose();
              }}
              className="btn-cancel"
              disabled={loading}
              style={{ outline: 'none' }}
            >
              ✕ 취소
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={loading}
              style={{ outline: 'none' }}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  저장 중...
                </>
              ) : (
                <>
                  💾 저장하기
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NicknameEditModal;


