import React, { useEffect } from 'react';
import { API_BASE } from '../api/client';  // client.js에서 export API_BASE 추가 필요

// CSS 강제주입
const injectStyles = () => {
  if (document.getElementById('login-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'login-styles';
  style.textContent = `
    /* 기본 리셋 */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      color: #1e293b;
      line-height: 1.6;
      min-height: 100vh;
      overflow: hidden;
    }
    
    /* 마법같은 배경 애니메이션 */
    body::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(240, 147, 251, 0.15) 0%, transparent 50%),
                  radial-gradient(circle at 40% 40%, rgba(118, 75, 162, 0.1) 0%, transparent 50%);
      animation: bg-shift 20s ease-in-out infinite;
      pointer-events: none;
      z-index: 1;
    }
    
    @keyframes bg-shift {
      0%, 100% { 
        opacity: 1; 
        transform: scale(1) rotate(0deg); 
      }
      33% { 
        opacity: 0.8; 
        transform: scale(1.1) rotate(120deg); 
      }
      66% { 
        opacity: 0.9; 
        transform: scale(0.9) rotate(240deg); 
      }
    }
    
    /* 플로팅 파티클 */
    .floating-particles {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2;
    }
    
    .particle {
      position: absolute;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      animation: float-particle 15s ease-in-out infinite;
    }
    
    .particle:nth-child(1) {
      width: 80px;
      height: 80px;
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }
    
    .particle:nth-child(2) {
      width: 60px;
      height: 60px;
      top: 20%;
      right: 15%;
      animation-delay: 3s;
    }
    
    .particle:nth-child(3) {
      width: 100px;
      height: 100px;
      bottom: 20%;
      left: 20%;
      animation-delay: 6s;
    }
    
    .particle:nth-child(4) {
      width: 40px;
      height: 40px;
      bottom: 30%;
      right: 25%;
      animation-delay: 9s;
    }
    
    .particle:nth-child(5) {
      width: 70px;
      height: 70px;
      top: 50%;
      left: 5%;
      animation-delay: 12s;
    }
    
    @keyframes float-particle {
      0%, 100% { 
        transform: translateY(0px) translateX(0px) rotate(0deg);
        opacity: 0.3;
      }
      25% { 
        transform: translateY(-30px) translateX(20px) rotate(90deg);
        opacity: 0.7;
      }
      50% { 
        transform: translateY(-10px) translateX(-15px) rotate(180deg);
        opacity: 0.5;
      }
      75% { 
        transform: translateY(-40px) translateX(10px) rotate(270deg);
        opacity: 0.8;
      }
    }
    
    /* 메인 컨테이너 */
    .login-container {
      position: relative;
      z-index: 10;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    
    /* 로그인 카드 */
    .login-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 32px;
      padding: 3rem;
      box-shadow: 0 32px 64px rgba(0, 0, 0, 0.2),
                  0 16px 32px rgba(102, 126, 234, 0.15),
                  inset 0 1px 0 rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.3);
      width: 100%;
      max-width: 480px;
      position: relative;
      overflow: hidden;
      animation: card-entrance 1s ease-out;
    }
    
    @keyframes card-entrance {
      0% {
        opacity: 0;
        transform: translateY(50px) scale(0.9);
      }
      100% {
        opacity: 1;
        transform: translateY(0px) scale(1);
      }
    }
    
    .login-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #667eea);
      background-size: 200% 100%;
      animation: gradient-flow 3s ease-in-out infinite;
    }
    
    @keyframes gradient-flow {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    
    .login-card::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: conic-gradient(from 0deg, transparent, rgba(102, 126, 234, 0.03), transparent);
      animation: card-rotate 20s linear infinite;
      pointer-events: none;
    }
    
    @keyframes card-rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* 헤더 섹션 */
    .login-header {
      text-align: center;
      margin-bottom: 3rem;
      position: relative;
      z-index: 2;
    }
    
    .login-logo {
      font-size: 4rem;
      margin-bottom: 1rem;
      animation: logo-pulse 3s ease-in-out infinite;
    }
    
    @keyframes logo-pulse {
      0%, 100% { 
        transform: scale(1);
        filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.3));
      }
      50% { 
        transform: scale(1.05);
        filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.5));
      }
    }
    
    .login-title {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .login-subtitle {
      font-size: 1.1rem;
      color: #64748b;
      font-weight: 500;
    }
    
    /* 버튼 컨테이너 */
    .buttons-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      position: relative;
      z-index: 2;
    }
    
    /* 소셜 로그인 버튼 */
    .social-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 1.25rem 2rem;
      border: none;
      border-radius: 20px;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      text-decoration: none;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }
    
    .social-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      transition: left 0.6s ease;
    }
    
    .social-btn:hover::before {
      left: 100%;
    }
    
    .social-btn:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);
    }
    
    .social-btn:active {
      transform: translateY(-2px) scale(0.98);
    }
    
    /* 카카오 버튼 */
    .kakao-btn {
      background: linear-gradient(135deg, #FEE500, #FFCD00);
      color: #3C1E1E;
    }
    
    .kakao-btn:hover {
      background: linear-gradient(135deg, #FFCD00, #FFB800);
      box-shadow: 0 16px 32px rgba(254, 229, 0, 0.4);
    }
    
    /* 네이버 버튼 */
    .naver-btn {
      background: linear-gradient(135deg, #03C75A, #00B050);
      color: white;
    }
    
    .naver-btn:hover {
      background: linear-gradient(135deg, #00B050, #009944);
      box-shadow: 0 16px 32px rgba(3, 199, 90, 0.4);
    }
    
    /* 버튼 아이콘 */
    .btn-icon {
      font-size: 1.5rem;
      animation: icon-bounce 2s ease-in-out infinite;
    }
    
    @keyframes icon-bounce {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-3px); }
    }
    
    /* 구분선 */
    .divider {
      display: flex;
      align-items: center;
      margin: 2rem 0;
      position: relative;
      z-index: 2;
    }
    
    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      height: 2px;
      background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
    }
    
    .divider span {
      padding: 0 1.5rem;
      color: #64748b;
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    /* 푸터 */
    .login-footer {
      text-align: center;
      margin-top: 2rem;
      color: #64748b;
      font-size: 0.9rem;
      position: relative;
      z-index: 2;
    }
    
    /* 반응형 */
    @media (max-width: 640px) {
      .login-card {
        padding: 2rem;
        margin: 1rem;
        border-radius: 24px;
      }
      
      .login-title {
        font-size: 2rem;
      }
      
      .login-logo {
        font-size: 3rem;
      }
      
      .social-btn {
        padding: 1rem 1.5rem;
        font-size: 1rem;
      }
    }
    
    /* 접근성 */
    .social-btn:focus {
      outline: 3px solid rgba(102, 126, 234, 0.5);
      outline-offset: 2px;
    }
    
    /* 로딩 상태 */
    .btn-loading {
      pointer-events: none;
      opacity: 0.7;
    }
    
    .btn-loading::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      right: 1rem;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  
  document.head.appendChild(style);
};

function Login() {
  useEffect(() => {
    injectStyles();
  }, []);

  const handleSocialLogin = (provider) => {
    const button = document.querySelector(`.${provider.toLowerCase()}-btn`);
    if (button) button.classList.add("btn-loading");

    if (provider === "Kakao") {
      window.location.href = `${API_BASE}/auth/kakao/login/`;
    } else if (provider === "Naver") {
      window.location.href = `${API_BASE}/auth/naver/login/`;
    }
  };

  return (
    <>
      {/* 플로팅 파티클 */}
      <div className="floating-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      {/* 메인 로그인 컨테이너 */}
      <div className="login-container">
        <div className="login-card">
          {/* 헤더 */}
          <div className="login-header">
            <div className="login-logo">✨</div>
            <h1 className="login-title">Blogi</h1>
            <p className="login-subtitle">
              소셜 로그인으로 간편하게 시작하세요
            </p>
          </div>

          {/* 소셜 로그인 버튼들 */}
          <div className="buttons-container">
            <button
              className="social-btn kakao-btn"
              onClick={() => handleSocialLogin('Kakao')}
              type="button"
            >
              <span className="btn-icon">💬</span>
              <span>Kakao로 시작하기</span>
            </button>

            <div className="divider">
              <span>또는</span>
            </div>

            <button
              className="social-btn naver-btn"
              onClick={() => handleSocialLogin('Naver')}
              type="button"
            >
              <span className="btn-icon">🟢</span>
              <span>Naver로 시작하기</span>
            </button>
          </div>

          {/* 푸터 */}
          <div className="login-footer">
            <p>로그인하면 서비스 이용약관에 동의하게 됩니다</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
