// src/pages/login.js
import React, { useLayoutEffect, useState } from 'react';
import { API_BASE } from '../api/client'; // client.js에서 export API_BASE 필요

const STYLE_ID = 'blogi-login-styles';

// ✅ 로그인 전용 스타일 주입 (페이지 스코프: .login-page)
const injectLoginStyles = () => {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    /* ====== 스코프: .login-page 하위에만 적용 ====== */

    /* 기본 리셋(해당 페이지 범위) */
    .login-page * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    /* 배경 애니메이션 */
    .login-page::before {
      content: '';
      position: fixed;
      inset: 0;
      background:
        radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(240, 147, 251, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(118, 75, 162, 0.1) 0%, transparent 50%);
      animation: login-bg-shift 20s ease-in-out infinite;
      pointer-events: none;
      z-index: 1;
    }

    @keyframes login-bg-shift {
      0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
      33%      { opacity: .8; transform: scale(1.1) rotate(120deg); }
      66%      { opacity: .9; transform: scale(.9) rotate(240deg); }
    }

    /* 플로팅 파티클 */
    .login-page .floating-particles {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 2;
    }
    .login-page .particle {
      position: absolute;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      animation: login-float-particle 15s ease-in-out infinite;
    }
    .login-page .particle:nth-child(1) { width: 80px; height: 80px; top: 10%; left: 10%; animation-delay: 0s; }
    .login-page .particle:nth-child(2) { width: 60px; height: 60px; top: 20%; right: 15%; animation-delay: 3s; }
    .login-page .particle:nth-child(3) { width: 100px; height: 100px; bottom: 20%; left: 20%; animation-delay: 6s; }
    .login-page .particle:nth-child(4) { width: 40px; height: 40px; bottom: 30%; right: 25%; animation-delay: 9s; }
    .login-page .particle:nth-child(5) { width: 70px; height: 70px; top: 50%; left: 5%; animation-delay: 12s; }

    @keyframes login-float-particle {
      0%, 100% { transform: translateY(0) translateX(0) rotate(0); opacity: .3; }
      25%      { transform: translateY(-30px) translateX(20px) rotate(90deg); opacity: .7; }
      50%      { transform: translateY(-10px) translateX(-15px) rotate(180deg); opacity: .5; }
      75%      { transform: translateY(-40px) translateX(10px) rotate(270deg); opacity: .8; }
    }

    /* 메인 컨테이너 */
    .login-page .login-container {
      position: relative;
      z-index: 10;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    /* 로그인 카드 */
    .login-page .login-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 32px;
      padding: 3rem;
      box-shadow:
        0 32px 64px rgba(0, 0, 0, 0.2),
        0 16px 32px rgba(102, 126, 234, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.3);
      width: 100%;
      max-width: 480px;
      position: relative;
      overflow: hidden;
      animation: login-card-entrance 1s ease-out;
    }

    @keyframes login-card-entrance {
      0%   { opacity: 0; transform: translateY(50px) scale(0.9); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }

    .login-page .login-card::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: conic-gradient(from 0deg, transparent, rgba(102, 126, 234, 0.03), transparent);
      animation: login-card-rotate 20s linear infinite;
      pointer-events: none;
    }
    @keyframes login-card-rotate { to { transform: rotate(360deg); } }

    /* 헤더 */
    .login-page .login-header { text-align: center; margin-bottom: 3rem; position: relative; z-index: 2; }
    .login-page .login-logo { font-size: 4rem; margin-bottom: 1rem; animation: login-logo-pulse 3s ease-in-out infinite; }
    @keyframes login-logo-pulse {
      0%, 100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.3)); }
      50%      { transform: scale(1.05); filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.5)); }
    }
    .login-page .login-title {
      font-size: 2.5rem; font-weight: 800; margin-bottom: .5rem;
      background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      text-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .login-page .login-subtitle { font-size: 1.1rem; color: #64748b; font-weight: 500; }

    /* 버튼 컨테이너 */
    .login-page .buttons-container { display: flex; flex-direction: column; gap: 1.5rem; position: relative; z-index: 2; }

    /* 소셜 버튼 */
    .login-page .social-btn {
      display: flex; align-items: center; justify-content: center; gap: 1rem;
      padding: 1.25rem 2rem; border: none; border-radius: 20px;
      font-size: 1.1rem; font-weight: 700; cursor: pointer; position: relative; overflow: hidden;
      text-decoration: none; transition: all .4s cubic-bezier(.4,0,.2,1);
      box-shadow: 0 8px 16px rgba(0,0,0,.1);
    }
    .login-page .social-btn::before {
      content: ''; position: absolute; inset: 0; left: -100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,.3), transparent);
      transition: left .6s ease;
    }
    .login-page .social-btn:hover::before { left: 100%; }
    .login-page .social-btn:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 16px 32px rgba(0,0,0,.2); }
    .login-page .social-btn:active { transform: translateY(-2px) scale(.98); }

    .login-page .kakao-btn { background: linear-gradient(135deg, #FEE500, #FFCD00); color: #3C1E1E; }
    .login-page .kakao-btn:hover { background: linear-gradient(135deg, #FFCD00, #FFB800); box-shadow: 0 16px 32px rgba(254,229,0,.4); }

    .login-page .naver-btn { background: linear-gradient(135deg, #03C75A, #00B050); color: #fff; }
    .login-page .naver-btn:hover { background: linear-gradient(135deg, #00B050, #009944); box-shadow: 0 16px 32px rgba(3,199,90,.4); }

    .login-page .btn-icon { font-size: 1.5rem; animation: login-icon-bounce 2s ease-in-out infinite; }
    @keyframes login-icon-bounce { 50% { transform: translateY(-3px); } }

    .login-page .divider { display: flex; align-items: center; margin: 2rem 0; position: relative; z-index: 2; }
    .login-page .divider::before,
    .login-page .divider::after { content: ''; flex: 1; height: 2px; background: linear-gradient(90deg, transparent, #e2e8f0, transparent); }
    .login-page .divider span { padding: 0 1.5rem; color: #64748b; font-weight: 600; font-size: .9rem; }

    .login-page .login-footer { text-align: center; margin-top: 2rem; color: #64748b; font-size: .9rem; position: relative; z-index: 2; }

    /* 반응형 */
    @media (max-width: 640px) {
      .login-page .login-card { padding: 2rem; margin: 1rem; border-radius: 24px; }
      .login-page .login-title { font-size: 2rem; }
      .login-page .login-logo { font-size: 3rem; }
      .login-page .social-btn { padding: 1rem 1.5rem; font-size: 1rem; }
    }

    /* 접근성 + 로딩 */
    .login-page .social-btn:focus { outline: 3px solid rgba(102, 126, 234, 0.5); outline-offset: 2px; }
    .login-page .btn-loading { pointer-events: none; opacity: .7; }
    .login-page .btn-loading::after {
      content: ''; position: absolute; width: 20px; height: 20px; right: 1rem;
      border: 2px solid transparent; border-top: 2px solid currentColor; border-radius: 50%;
      animation: login-spin 1s linear infinite;
    }
    @keyframes login-spin { to { transform: rotate(360deg); } }
  `;
  document.head.appendChild(style);
};

function Login() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  // ✅ FOUC 방지: 최소한의 인라인 스타일(배경/레이아웃)로 최초 페인트 안정화
  const rootInlineStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  };

  // ✅ 스타일 선 주입 + 언마운트 시 클린업 (다른 페이지로 누수 방지)
  useLayoutEffect(() => {
    injectLoginStyles();
    return () => {
      const el = document.getElementById(STYLE_ID);
      if (el) el.remove();
    };
  }, []);

  const handleSocialLogin = (provider) => {
    if (isRedirecting) return;
    setIsRedirecting(true);

    const cls = `${provider.toLowerCase()}-btn`;
    const button = document.querySelector(`.login-page .${cls}`);
    if (button) button.classList.add('btn-loading');

    // 실제 리다이렉트
    if (provider === 'Kakao') {
      window.location.href = `${API_BASE}/auth/kakao/login/`;
    } else if (provider === 'Naver') {
      window.location.href = `${API_BASE}/auth/naver/login/`;
    }
  };

  return (
    <div className="login-page" style={rootInlineStyle}>
      {/* 플로팅 파티클 */}
      <div className="floating-particles" aria-hidden="true">
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
      </div>

      {/* 메인 로그인 컨테이너 */}
      <div className="login-container">
        <div className="login-card" role="region" aria-label="소셜 로그인 카드">
          {/* 헤더 */}
          <div className="login-header">
            <div className="login-logo" aria-hidden="true">✨</div>
            <h1 className="login-title">Blogi</h1>
            <p className="login-subtitle">소셜 로그인으로 간편하게 시작하세요</p>
          </div>

          {/* 소셜 로그인 버튼들 */}
          <div className="buttons-container">
            <button
              className="social-btn kakao-btn"
              onClick={() => handleSocialLogin('Kakao')}
              type="button"
              disabled={isRedirecting}
            >
              <span className="btn-icon" aria-hidden="true">💬</span>
              <span>Kakao로 시작하기</span>
            </button>

            <div className="divider"><span>또는</span></div>

            <button
              className="social-btn naver-btn"
              onClick={() => handleSocialLogin('Naver')}
              type="button"
              disabled={isRedirecting}
            >
              <span className="btn-icon" aria-hidden="true">🟢</span>
              <span>Naver로 시작하기</span>
            </button>
          </div>

          {/* 푸터 */}
          <div className="login-footer">
            <p>로그인하면 서비스 이용약관에 동의하게 됩니다</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
