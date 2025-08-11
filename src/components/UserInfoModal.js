import React, { useEffect, useState } from "react";
import { api } from "../api/client";

const UserInfoModal = ({ onClose, onEditNickname, onDeleteAccount }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // CSS 주입 함수
  const injectStyles = () => {
    const styleId = 'userinfo-modal-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .userinfo-overlay {
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

      .userinfo-modal {
        background: white;
        border-radius: 20px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        width: 90vw;
        max-width: 500px;
        overflow: hidden;
        animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        position: relative;
      }

      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: translateY(-100px) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .userinfo-header {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 2rem;
        text-align: center;
        position: relative;
      }

      .userinfo-header::after {
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

      .userinfo-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }

      .userinfo-subtitle {
        font-size: 0.9rem;
        opacity: 0.9;
      }

      .userinfo-content {
        padding: 2rem;
      }

      .userinfo-loading {
        text-align: center;
        padding: 3rem 2rem;
        color: #64748b;
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
      }

      .loading-spinner {
        width: 24px;
        height: 24px;
        border: 3px solid #e2e8f0;
        border-top: 3px solid #667eea;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .userinfo-error {
        text-align: center;
        padding: 2rem;
        color: #dc2626;
        background: linear-gradient(135deg, #fef2f2, #fee2e2);
        border: 2px solid #fecaca;
        border-radius: 12px;
        margin: 1rem;
        font-weight: 500;
      }

      .userinfo-grid {
        display: grid;
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .info-card {
        background: linear-gradient(135deg, #f8fafc, #e2e8f0);
        border-radius: 12px;
        padding: 1.25rem;
        border-left: 4px solid #667eea;
        transition: all 0.3s ease;
      }

      .info-card:hover {
        transform: translateX(5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      }

      .info-label {
        font-size: 0.85rem;
        font-weight: 600;
        color: #64748b;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .info-value {
        font-size: 1.1rem;
        font-weight: 600;
        color: #1e293b;
        word-break: break-all;
      }

      .provider-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 600;
      }

      .date-badge {
        background: linear-gradient(135deg, #f59e0b, #d97706);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 600;
        display: inline-block;
      }

      .userinfo-actions {
        display: flex;
        gap: 0.75rem;
        justify-content: center;
        flex-wrap: wrap;
        padding-top: 1.5rem;
        border-top: 2px solid #f1f5f9;
      }

      .btn-edit {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.95rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .btn-edit:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
      }

      .btn-delete {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.95rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .btn-delete:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
      }

      .btn-close {
        background: linear-gradient(135deg, #64748b, #475569);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.95rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .btn-close:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(100, 116, 139, 0.4);
      }

      @media (max-width: 768px) {
        .userinfo-modal {
          width: 95vw;
          margin: 1rem;
        }

        .userinfo-header {
          padding: 1.5rem;
        }

        .userinfo-content {
          padding: 1.5rem;
        }

        .userinfo-title {
          font-size: 1.3rem;
        }

        .userinfo-actions {
          flex-direction: column;
          align-items: stretch;
        }

        .btn-edit, .btn-delete, .btn-close {
          justify-content: center;
        }
      }
    `;
    document.head.appendChild(style);
  };

  useEffect(() => {
    injectStyles();
  }, []);

  // 사용자 정보 API 호출 (res.data.data에 사용자 정보 존재)
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await api.get("/mypage/me");
        setUserInfo(res.data.data);  // 여기서 data 안의 실제 정보 할당
      } catch (err) {
        setError("사용자 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  const getProviderIcon = (provider) => {
    switch (provider?.toLowerCase()) {
      case 'google': return '🔍';
      case 'kakao': return '💬';
      case 'naver': return '🟢';
      case 'facebook': return '📘';
      default: return '🔐';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  if (loading) {
    return (
      <div className="userinfo-overlay">
        <div className="userinfo-modal">
          <div className="userinfo-loading">
            <div className="loading-spinner"></div>
            사용자 정보를 불러오는 중...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="userinfo-overlay">
        <div className="userinfo-modal">
          <div className="userinfo-error">
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
            <div style={{ marginBottom: '1.5rem' }}>{error}</div>
            <button
              onClick={onClose}
              className="btn-close"
              style={{ outline: 'none' }}
            >
              ✕ 닫기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="userinfo-overlay">
      <div className="userinfo-modal">
        <div className="userinfo-header">
          <h2 className="userinfo-title">
            👤 사용자 정보
          </h2>
          <div className="userinfo-subtitle">
            계정 정보를 확인하고 관리하세요
          </div>
        </div>

        <div className="userinfo-content">
          <div className="userinfo-grid">
            <div className="info-card">
              <div className="info-label">
                ✏️ 닉네임
              </div>
              <div className="info-value">{userInfo.nickname}</div>
            </div>

            <div className="info-card">
              <div className="info-label">
                📧 이메일 주소
              </div>
              <div className="info-value">{userInfo.email}</div>
            </div>

            <div className="info-card">
              <div className="info-label">
                🔐 로그인 플랫폼
              </div>
              <div className="info-value">
                <span className="provider-badge">
                  {getProviderIcon(userInfo.provider)}
                  {userInfo.provider}
                </span>
              </div>
            </div>

            <div className="info-card">
              <div className="info-label">
                📅 가입일시
              </div>
              <div className="info-value">
                <span className="date-badge">
                  {formatDate(userInfo.created_at)}
                </span>
              </div>
            </div>
          </div>

          <div className="userinfo-actions">
            <button
              onClick={onEditNickname}
              className="btn-edit"
              style={{ outline: 'none' }}
            >
              ✏️ 닉네임 수정
            </button>
            <button
              onClick={onDeleteAccount}
              className="btn-delete"
              style={{ outline: 'none' }}
            >
              🗑️ 회원 탈퇴
            </button>
            <button
              onClick={onClose}
              className="btn-close"
              style={{ outline: 'none' }}
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoModal;

