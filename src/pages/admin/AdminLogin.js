import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAdminAuth from "../../hooks/useAdminAuth";
import { adminLogin } from "../../api/admin";

export default function AdminLogin() {
  const nav = useNavigate();
  const { save } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // 🎨 마법같은 CSS 강제 주입!
  const injectAdminStyles = () => {
    const styleId = 'blogi-admin-login-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* 🌟 어드민 로그인 전용 스타일 */
      .admin-login-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #ffffff;
        padding: 1.5rem;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      }

      /* 💎 로그인 카드 */
      .admin-login-card {
        width: 100%;
        max-width: 420px;
        background: #ffffff;
        border-radius: 24px;
        padding: 2.5rem;
        box-shadow: 
          0 20px 40px rgba(0, 0, 0, 0.08),
          0 8px 16px rgba(0, 0, 0, 0.04),
          0 0 0 1px rgba(0, 0, 0, 0.02);
        border: 1px solid #f1f5f9;
        position: relative;
        animation: admin-card-entrance 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }

      @keyframes admin-card-entrance {
        0% {
          opacity: 0;
          transform: translateY(20px) scale(0.98);
        }
        100% {
          opacity: 1;
          transform: translateY(0px) scale(1);
        }
      }

      /* 🎯 카드 상단 액센트 */
      .admin-login-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899);
        border-radius: 24px 24px 0 0;
      }

      /* 🏷️ 헤더 섹션 */
      .admin-header {
        text-align: center;
        margin-bottom: 2rem;
      }

      .admin-logo {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        display: inline-block;
        animation: admin-logo-float 3s ease-in-out infinite;
      }

      @keyframes admin-logo-float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
      }

      .admin-title {
        font-size: 1.875rem;
        font-weight: 800;
        color: #1e293b;
        margin-bottom: 0.5rem;
        letter-spacing: -0.025em;
      }

      .admin-subtitle {
        color: #64748b;
        font-size: 1rem;
        font-weight: 500;
      }

      /* 📝 폼 스타일링 */
      .admin-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .admin-form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .admin-label {
        font-size: 0.875rem;
        font-weight: 600;
        color: #374151;
      }

      .admin-input {
        width: 100%;
        padding: 0.875rem 1rem;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        font-size: 1rem;
        background: #ffffff;
        color: #1e293b;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        outline: none;
      }

      .admin-input:focus {
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        transform: translateY(-1px);
      }

      .admin-input::placeholder {
        color: #94a3b8;
      }

      /* 🚨 에러 메시지 */
      .admin-error {
        background: #fef2f2;
        border: 1px solid #fecaca;
        color: #dc2626;
        padding: 0.875rem 1rem;
        border-radius: 12px;
        font-size: 0.875rem;
        font-weight: 500;
        animation: admin-error-shake 0.4s ease-in-out;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      @keyframes admin-error-shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-3px); }
        75% { transform: translateX(3px); }
      }

      .admin-error::before {
        content: '⚠️';
        font-size: 1rem;
      }

      /* 🚀 로그인 버튼 */
      .admin-submit-btn {
        width: 100%;
        height: 3rem;
        border: none;
        border-radius: 12px;
        background: #6366f1;
        color: white;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        position: relative;
        overflow: hidden;
      }

      .admin-submit-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s ease;
      }

      .admin-submit-btn:hover::before {
        left: 100%;
      }

      .admin-submit-btn:hover {
        background: #5855eb;
        transform: translateY(-1px);
        box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
      }

      .admin-submit-btn:active {
        transform: translateY(0px);
      }

      .admin-submit-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
        background: #94a3b8;
      }

      .admin-submit-btn:disabled:hover {
        background: #94a3b8;
        box-shadow: none;
      }

      /* ⏳ 로딩 스피너 */
      .admin-loading-spinner {
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid white;
        border-radius: 50%;
        animation: admin-spin 1s linear infinite;
      }

      @keyframes admin-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* 🔒 보안 배지 */
      .admin-security-badge {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 1.5rem;
        padding: 0.75rem 1rem;
        background: #f0f9ff;
        border: 1px solid #e0f2fe;
        border-radius: 12px;
        color: #0369a1;
        font-size: 0.875rem;
        font-weight: 500;
      }

      .admin-security-icon {
        animation: admin-security-pulse 2s ease-in-out infinite;
      }

      @keyframes admin-security-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }

      /* 📱 반응형 디자인 */
      @media (max-width: 768px) {
        .admin-login-container {
          padding: 1rem;
        }
        
        .admin-login-card {
          padding: 2rem;
          max-width: 100%;
        }
        
        .admin-title {
          font-size: 1.5rem;
        }
        
        .admin-logo {
          font-size: 2rem;
        }
      }

      @media (max-width: 480px) {
        .admin-login-card {
          padding: 1.5rem;
          border-radius: 20px;
        }
        
        .admin-title {
          font-size: 1.375rem;
        }
      }

      /* ♿ 접근성 */
      .admin-input:focus,
      .admin-submit-btn:focus {
        outline: 2px solid #6366f1;
        outline-offset: 2px;
      }

      /* 🎭 호버 효과 */
      .admin-login-card:hover {
        box-shadow: 
          0 25px 50px rgba(0, 0, 0, 0.1),
          0 10px 20px rgba(0, 0, 0, 0.05),
          0 0 0 1px rgba(0, 0, 0, 0.02);
        transform: translateY(-2px);
      }

      /* 🌟 성공 애니메이션 */
      .admin-success-glow {
        box-shadow: 
          0 25px 50px rgba(34, 197, 94, 0.2),
          0 10px 20px rgba(34, 197, 94, 0.1),
          0 0 0 2px rgba(34, 197, 94, 0.3) !important;
        transform: scale(1.02) !important;
      }

      .admin-success-glow::before {
        background: linear-gradient(90deg, #22c55e, #16a34a, #15803d) !important;
      }
    `;
    
    document.head.appendChild(style);
  };

  // 🎭 성공 애니메이션
  const showSuccessAnimation = () => {
    const card = document.querySelector('.admin-login-card');
    if (card) {
      card.classList.add('admin-success-glow');
      setTimeout(() => {
        card.classList.remove('admin-success-glow');
      }, 2000);
    }
  };

  useEffect(() => {
    console.log("[AdminLogin] mounted");
    injectAdminStyles();
  }, []);

  const doLogin = async () => {
    if (loading) return;
    setErr("");
    setLoading(true);
    console.log("[AdminLogin] doLogin start", { email });

    try {
      const data = await adminLogin(email.trim(), password);
      console.log("[AdminLogin] response:", data);

      const access =
        data?.access ||
        data?.token ||
        data?.access_token ||
        (typeof data === "string" ? data : "");
      if (!access) throw new Error("토큰이 응답에 없습니다.");

      // 성공 애니메이션 표시
      showSuccessAnimation();

      // 전역 저장 + axios 헤더 주입 + 훅 동기화
      save(access);

      console.log("[AdminLogin] token saved, navigating to /admin");
      
      // 약간의 딜레이 후 네비게이션 (애니메이션 완료 대기)
      setTimeout(() => {
        nav("/admin", { replace: true });
      }, 500);

      // ✅ 가드가 과거 상태로 한번 더 밀어낼 경우 안전장치
      setTimeout(() => {
        if (!window.location.pathname.startsWith("/admin")) {
          console.warn("[AdminLogin] hard redirect fallback used");
          window.location.replace("/admin/dashboard");
        }
      }, 1000);
    } catch (error) {
      const msg =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "로그인에 실패했습니다.";
      console.error("[AdminLogin] error:", error);
      setErr(String(msg));
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("[AdminLogin] onSubmit fired");
    void doLogin();
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-header">
          <div className="admin-logo">🔐</div>
          <h1 className="admin-title">Blogi Admin</h1>
          <p className="admin-subtitle">관리자 계정으로 로그인하세요</p>
        </div>

        <form onSubmit={onSubmit} className="admin-form">
          <div className="admin-form-group">
            <label className="admin-label">이메일</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="admin-input"
              placeholder="admin@example.com"
              autoComplete="username"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">비밀번호</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              className="admin-input"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {err && (
            <div className="admin-error">
              {err}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="admin-submit-btn"
          >
            {loading ? (
              <>
                <div className="admin-loading-spinner"></div>
                로그인 중...
              </>
            ) : (
              "로그인"
            )}
          </button>
        </form>

        <div className="admin-security-badge">
          <span className="admin-security-icon">🛡️</span>
          <span>SSL 보안 연결로 보호됨</span>
        </div>
      </div>
    </div>
  );
}
