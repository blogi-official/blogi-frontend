import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, AUTH } from '../api/client';

const categoryOptions = ["연예", "경제", "스포츠", "패션", "자동차", "여행", "맛집"];

// 카테고리별 이모지 매핑
const categoryEmojis = {
  "연예": "🎭",
  "경제": "💰", 
  "스포츠": "⚽",
  "패션": "👗",
  "자동차": "🚗",
  "여행": "✈️",
  "맛집": "🍽️"
};

// CSS를 확실하게 주입 - 완전히 새로운 마법 버전!
const injectStyles = () => {
  if (document.getElementById('onboarding-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'onboarding-styles';
  style.textContent = `
    /* 기본 리셋 */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 30%, #f093fb 70%, #667eea 100%);
      background-size: 400% 400%;
      animation: gradient-shift 15s ease infinite;
      color: #1e293b;
      line-height: 1.6;
      min-height: 100vh;
      overflow-x: hidden;
    }
    
    @keyframes gradient-shift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    /* 마법같은 배경 애니메이션 */
    body::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 75% 75%, rgba(240, 147, 251, 0.15) 0%, transparent 50%),
                  radial-gradient(circle at 50% 50%, rgba(118, 75, 162, 0.1) 0%, transparent 50%);
      animation: bg-float 20s ease-in-out infinite;
      pointer-events: none;
      z-index: 1;
    }
    
    @keyframes bg-float {
      0%, 100% { 
        opacity: 1; 
        transform: scale(1) rotate(0deg); 
      }
      33% { 
        opacity: 0.8; 
        transform: scale(1.2) rotate(120deg); 
      }
      66% { 
        opacity: 0.9; 
        transform: scale(0.8) rotate(240deg); 
      }
    }
    
    /* 플로팅 아이콘들 */
    .floating-icons {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2;
    }
    
    .floating-icon {
      position: absolute;
      font-size: 2rem;
      opacity: 0.3;
      animation: float-icon 20s ease-in-out infinite;
    }
    
    .floating-icon:nth-child(1) {
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }
    
    .floating-icon:nth-child(2) {
      top: 20%;
      right: 15%;
      animation-delay: 4s;
    }
    
    .floating-icon:nth-child(3) {
      bottom: 20%;
      left: 20%;
      animation-delay: 8s;
    }
    
    .floating-icon:nth-child(4) {
      bottom: 30%;
      right: 25%;
      animation-delay: 12s;
    }
    
    .floating-icon:nth-child(5) {
      top: 50%;
      left: 5%;
      animation-delay: 16s;
    }
    
    @keyframes float-icon {
      0%, 100% { 
        transform: translateY(0px) translateX(0px) rotate(0deg);
        opacity: 0.3;
      }
      25% { 
        transform: translateY(-40px) translateX(30px) rotate(90deg);
        opacity: 0.6;
      }
      50% { 
        transform: translateY(-20px) translateX(-20px) rotate(180deg);
        opacity: 0.4;
      }
      75% { 
        transform: translateY(-50px) translateX(15px) rotate(270deg);
        opacity: 0.7;
      }
    }
    
    /* 메인 컨테이너 */
    .onboarding-container {
      position: relative;
      z-index: 10;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    
    /* 온보딩 카드 */
    .onboarding-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 32px;
      padding: 3rem;
      box-shadow: 0 32px 64px rgba(0, 0, 0, 0.2),
                  0 16px 32px rgba(102, 126, 234, 0.15),
                  inset 0 1px 0 rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.3);
      width: 100%;
      max-width: 600px;
      position: relative;
      overflow: hidden;
      animation: card-entrance 1.2s ease-out;
    }
    
    @keyframes card-entrance {
      0% {
        opacity: 0;
        transform: translateY(60px) scale(0.8);
      }
      100% {
        opacity: 1;
        transform: translateY(0px) scale(1);
      }
    }
    
    .onboarding-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #667eea);
      background-size: 200% 100%;
      animation: gradient-flow 4s ease-in-out infinite;
    }
    
    @keyframes gradient-flow {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    
    .onboarding-card::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: conic-gradient(from 0deg, transparent, rgba(102, 126, 234, 0.03), transparent);
      animation: card-rotate 25s linear infinite;
      pointer-events: none;
    }
    
    @keyframes card-rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* 헤더 섹션 */
    .onboarding-header {
      text-align: center;
      margin-bottom: 3rem;
      position: relative;
      z-index: 2;
    }
    
    .welcome-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      animation: welcome-bounce 3s ease-in-out infinite;
    }
    
    @keyframes welcome-bounce {
      0%, 100% { 
        transform: scale(1) rotate(0deg);
        filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.3));
      }
      50% { 
        transform: scale(1.1) rotate(5deg);
        filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.5));
      }
    }
    
    .onboarding-title {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .onboarding-subtitle {
      font-size: 1.2rem;
      color: #64748b;
      font-weight: 500;
    }
    
    /* 닉네임 입력 */
    .nickname-section {
      margin-bottom: 3rem;
      position: relative;
      z-index: 2;
    }
    
    .nickname-input {
      width: 100%;
      padding: 1.25rem 1.5rem;
      border: 2px solid #e2e8f0;
      border-radius: 20px;
      font-size: 1.1rem;
      background: rgba(255,255,255,0.9);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      font-weight: 500;
    }
    
    .nickname-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
      background: white;
      transform: translateY(-2px);
    }
    
    .nickname-input::placeholder {
      color: #94a3b8;
    }
    
    /* 관심사 섹션 */
    .interests-section {
      margin-bottom: 3rem;
      position: relative;
      z-index: 2;
    }
    
    .interests-title {
      font-size: 1.3rem;
      font-weight: 700;
      color: #374151;
      margin-bottom: 1.5rem;
      text-align: center;
    }
    
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }
    
    /* 카테고리 버튼 */
    .category-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1.5rem 1rem;
      border: 2px solid #e2e8f0;
      background: rgba(255,255,255,0.9);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      font-weight: 600;
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
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      transition: left 0.6s ease;
    }
    
    .category-btn:hover::before {
      left: 100%;
    }
    
    .category-btn:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 12px 24px rgba(102, 126, 234, 0.2);
      border-color: #667eea;
    }
    
    .category-btn.selected {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border-color: transparent;
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
    }
    
    .category-btn.selected:hover {
      background: linear-gradient(135deg, #5a67d8, #6b46c1);
      transform: translateY(-6px) scale(1.02);
      box-shadow: 0 16px 32px rgba(102, 126, 234, 0.4);
    }
    
    .category-emoji {
      font-size: 2rem;
      animation: emoji-float 3s ease-in-out infinite;
    }
    
    @keyframes emoji-float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-3px); }
    }
    
    .category-text {
      font-size: 1rem;
      font-weight: 600;
    }
    
    /* 에러 메시지 */
    .error-message {
      background: rgba(239, 68, 68, 0.1);
      border: 2px solid rgba(239, 68, 68, 0.3);
      color: #dc2626;
      padding: 1rem 1.5rem;
      border-radius: 16px;
      margin-bottom: 2rem;
      text-align: center;
      font-weight: 600;
      animation: error-shake 0.5s ease-in-out;
    }
    
    @keyframes error-shake {
      0%, 100% { transform: translateX(0px); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    
    /* 시작하기 버튼 */
    .start-btn {
      width: 100%;
      padding: 1.5rem 2rem;
      background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
      background-size: 200% 200%;
      color: white;
      border: none;
      border-radius: 20px;
      font-size: 1.2rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
      animation: btn-gradient 3s ease-in-out infinite;
    }
    
    @keyframes btn-gradient {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    
    .start-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      transition: left 0.6s ease;
    }
    
    .start-btn:hover::before {
      left: 100%;
    }
    
    .start-btn:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 16px 32px rgba(102, 126, 234, 0.4);
    }
    
    .start-btn:active {
      transform: translateY(-2px) scale(0.98);
    }
    
    .start-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }
    
    /* 로딩 상태 */
    .btn-loading {
      pointer-events: none;
    }
    
    .btn-loading::after {
      content: '';
      position: absolute;
      width: 24px;
      height: 24px;
      border: 3px solid transparent;
      border-top: 3px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      right: 1.5rem;
      top: 50%;
      transform: translateY(-50%);
    }
    
    @keyframes spin {
      0% { transform: translateY(-50%) rotate(0deg); }
      100% { transform: translateY(-50%) rotate(360deg); }
    }
    
    /* 반응형 */
    @media (max-width: 640px) {
      .onboarding-card {
        padding: 2rem;
        margin: 1rem;
        border-radius: 24px;
      }
      
      .onboarding-title {
        font-size: 2rem;
      }
      
      .welcome-icon {
        font-size: 3rem;
      }
      
      .categories-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
      }
      
      .category-btn {
        padding: 1rem 0.75rem;
      }
      
      .category-emoji {
        font-size: 1.5rem;
      }
      
      .category-text {
        font-size: 0.9rem;
      }
    }
    
    /* 접근성 */
    .category-btn:focus,
    .start-btn:focus,
    .nickname-input:focus {
      outline: 3px solid rgba(102, 126, 234, 0.5);
      outline-offset: 2px;
    }
  `;
  
  document.head.appendChild(style);
};

const Onboarding = () => {
  const [nickname, setNickname] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    injectStyles();
  }, []);

  const toggleCategory = (category) => {
    setError('');
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async () => {
    setError('');
    setIsLoading(true);

    if (selectedCategories.length < 1) {
      setError('❗ 관심사는 최소 1개 이상 선택해야 합니다.');
      setIsLoading(false);
      return;
    }

    const payload = {
      categories: selectedCategories,
    };
    if (nickname.trim()) {
      payload.nickname = nickname.trim();
    }

    try {
      const token = localStorage.getItem(AUTH.TOKEN_KEY);
      if (!token) {
        setError('❗ 로그인 상태가 아닙니다. 다시 로그인해주세요.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      const res = await api.post('/user/interests/', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        console.log('✅ 온보딩 완료:', res.data.user_info);
        setTimeout(() => navigate('/'), 500);
      }
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;

      if (status === 409) {
        setError('❗ 해당 닉네임은 이미 사용 중입니다.');
      } else if (status === 400) {
        setError(data?.detail || '❗ 유효하지 않은 요청입니다.');
      } else if (status === 401) {
        setError('❗ 로그인 상태가 아닙니다. 다시 로그인해주세요.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('❗ 알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 플로팅 아이콘들 */}
      <div className="floating-icons">
        <div className="floating-icon">🎭</div>
        <div className="floating-icon">💰</div>
        <div className="floating-icon">⚽</div>
        <div className="floating-icon">✈️</div>
        <div className="floating-icon">🍽️</div>
      </div>

      {/* 메인 온보딩 컨테이너 */}
      <div className="onboarding-container">
        <div className="onboarding-card">
          {/* 헤더 */}
          <div className="onboarding-header">
            <div className="welcome-icon">🎉</div>
            <h1 className="onboarding-title">환영합니다!</h1>
            <p className="onboarding-subtitle">닉네임과 관심사를 설정해 주세요</p>
          </div>

          {/* 닉네임 입력 */}
          <div className="nickname-section">
            <input
              type="text"
              placeholder="✨ 닉네임을 입력해주세요 (선택사항)"
              maxLength={20}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="nickname-input"
            />
          </div>

          {/* 관심사 선택 */}
          <div className="interests-section">
            <h3 className="interests-title">🎯 관심사를 선택해주세요 (최소 1개)</h3>
            <div className="categories-grid">
              {categoryOptions.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`category-btn ${selectedCategories.includes(category) ? 'selected' : ''}`}
                >
                  <span className="category-emoji">{categoryEmojis[category]}</span>
                  <span className="category-text">{category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && <div className="error-message">{error}</div>}

          {/* 시작하기 버튼 */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`start-btn ${isLoading ? 'btn-loading' : ''}`}
          >
            {isLoading ? '설정 중...' : '🚀 Blogi 시작하기'}
          </button>
        </div>
      </div>
    </>
  );
};

export default Onboarding;