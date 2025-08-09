import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

import UserInfoModal from "../components/UserInfoModal";
import NicknameEditModal from "../components/NicknameEditModal";
import DeleteAccountModal from "../components/DeleteAccountModal";

import PostListModal from "../components/PostListModal";
import PostDetailModal from "../components/PostDetailModal";
import DeleteContentModal from "../components/DeleteContentModal";

const MyPage = () => {
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [showNicknameEditModal, setShowNicknameEditModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const [showPostListModal, setShowPostListModal] = useState(false);
  const [showPostDetailModal, setShowPostDetailModal] = useState(false);
  const [showDeleteContentModal, setShowDeleteContentModal] = useState(false);

  const [me, setMe] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [listRefreshKey, setListRefreshKey] = useState(0);

  const navigate = useNavigate();

  // 🎨 완전히 새로운 마법같은 CSS 주입!
  const injectStyles = () => {
    const styleId = 'mypage-premium-magic-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      
      /* 💫 마법같은 배경 오버레이 */
      .mypage-magic-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: 
          radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(240, 147, 251, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(118, 75, 162, 0.1) 0%, transparent 50%);
        animation: bg-shift 25s ease-in-out infinite;
        pointer-events: none;
        z-index: 1;
      }
      
      @keyframes bg-shift {
        0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
        25% { opacity: 0.8; transform: scale(1.1) rotate(90deg); }
        50% { opacity: 0.9; transform: scale(0.9) rotate(180deg); }
        75% { opacity: 0.7; transform: scale(1.2) rotate(270deg); }
      }
      
      /* 🎪 플로팅 파티클들 */
      .floating-particles {
        position: absolute;
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
        animation: float-particle 18s ease-in-out infinite;
      }
      
      .particle:nth-child(1) {
        width: 100px; height: 100px;
        top: 10%; left: 10%;
        animation-delay: 0s;
      }
      
      .particle:nth-child(2) {
        width: 80px; height: 80px;
        top: 20%; right: 15%;
        animation-delay: 4s;
      }
      
      .particle:nth-child(3) {
        width: 120px; height: 120px;
        bottom: 20%; left: 20%;
        animation-delay: 8s;
      }
      
      .particle:nth-child(4) {
        width: 60px; height: 60px;
        bottom: 30%; right: 25%;
        animation-delay: 12s;
      }
      
      .particle:nth-child(5) {
        width: 90px; height: 90px;
        top: 50%; left: 5%;
        animation-delay: 16s;
      }
      
      .particle:nth-child(6) {
        width: 70px; height: 70px;
        top: 60%; right: 10%;
        animation-delay: 20s;
      }
      
      @keyframes float-particle {
        0%, 100% { 
          transform: translateY(0px) translateX(0px) rotate(0deg);
          opacity: 0.3;
        }
        25% { 
          transform: translateY(-50px) translateX(40px) rotate(90deg);
          opacity: 0.7;
        }
        50% { 
          transform: translateY(-20px) translateX(-30px) rotate(180deg);
          opacity: 0.5;
        }
        75% { 
          transform: translateY(-60px) translateX(20px) rotate(270deg);
          opacity: 0.8;
        }
      }
      
      /* 🏗️ 메인 콘텐츠 */
      .mypage-content {
        position: relative;
        z-index: 10;
        max-width: 1400px;
        margin: 0 auto;
      }
      
      /* ✨ 헤더 섹션 */
      .mypage-header {
        text-align: center;
        margin-bottom: 4rem;
        position: relative;
        z-index: 2;
      }
      
      .mypage-icon {
        font-size: 5rem;
        margin-bottom: 1.5rem;
        animation: icon-pulse 4s ease-in-out infinite;
      }
      
      @keyframes icon-pulse {
        0%, 100% { 
          transform: scale(1) rotate(0deg);
          filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.4));
        }
        50% { 
          transform: scale(1.1) rotate(5deg);
          filter: drop-shadow(0 0 40px rgba(102, 126, 234, 0.6));
        }
      }
      
      .mypage-title {
        font-size: 3.5rem;
        font-weight: 900;
        margin-bottom: 1rem;
        background: linear-gradient(135deg, #667eea, #764ba2, #f093fb, #667eea);
        background-size: 300% 300%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: title-gradient 6s ease-in-out infinite;
        text-shadow: 0 8px 16px rgba(0,0,0,0.1);
      }
      
      @keyframes title-gradient {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      
      .mypage-subtitle {
        font-size: 1.3rem;
        color: rgba(0, 0, 0, 0.93);
        font-weight: 600;
        text-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
      
      /* 🎭 메뉴 카드 컨테이너 */
      .menu-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 3rem;
        margin-bottom: 4rem;
        position: relative;
        z-index: 2;
      }
      
      /* 💎 글래스모피즘 카드 */
      .menu-card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 32px;
        padding: 3rem;
        box-shadow: 0 32px 64px rgba(0, 0, 0, 0.2),
                  0 16px 32px rgba(102, 126, 234, 0.15),
                  inset 0 1px 0 rgba(255, 255, 255, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.3);
        position: relative;
        overflow: hidden;
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        animation: card-entrance 1s ease-out;
      }
      
      @keyframes card-entrance {
        0% {
          opacity: 0;
          transform: translateY(60px) scale(0.9);
        }
        100% {
          opacity: 1;
          transform: translateY(0px) scale(1);
        }
      }
      
      .menu-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 40px 80px rgba(0, 0, 0, 0.25),
                  0 20px 40px rgba(102, 126, 234, 0.2);
      }
      
      /* 🌟 카드 상단 그라디언트 */
      .menu-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 6px;
        background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #667eea);
        background-size: 200% 100%;
        animation: card-gradient-flow 4s ease-in-out infinite;
      }
      
      @keyframes card-gradient-flow {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }     

      
      /* 🎯 카드 헤더 */
      .card-header {
        text-align: center;
        margin-bottom: 2.5rem;
        position: relative;
        z-index: 2;
      }
      
      .card-icon {
        font-size: 3.5rem;
        margin-bottom: 1rem;
        animation: card-icon-bounce 3s ease-in-out infinite;
      }
      
      @keyframes card-icon-bounce {
        0%, 100% { 
          transform: translateY(0px) rotate(0deg);
          filter: drop-shadow(0 0 15px rgba(102, 126, 234, 0.3));
        }
        50% { 
          transform: translateY(-8px) rotate(5deg);
          filter: drop-shadow(0 0 25px rgba(102, 126, 234, 0.5));
        }
      }
      
      .card-title {
        font-size: 1.8rem;
        font-weight: 800;
        color: #374151;
        margin-bottom: 0.5rem;
      }
      
      .card-subtitle {
        font-size: 1rem;
        color: #64748b;
        font-weight: 500;
      }
      
      /* 🎨 메뉴 버튼들 */
      .menu-buttons {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        position: relative;
        z-index: 2;
      }
      
      .menu-btn {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1.25rem 1.5rem;
        background: rgba(255, 255, 255, 0.8);
        border: 2px solid #e2e8f0;
        border-radius: 16px;
        font-size: 1rem;
        font-weight: 600;
        color: #374151;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        text-decoration: none;
      }
      
      /* 💫 버튼 샤인 효과 */
      .menu-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        transition: left 0.6s ease;
      }
      
      .menu-btn:hover::before {
        left: 100%;
      }
      
      .menu-btn:hover {
        transform: translateX(8px);
        background: rgba(102, 126, 234, 0.1);
        border-color: #667eea;
        color: #667eea;
        box-shadow: 0 8px 16px rgba(102, 126, 234, 0.2);
      }
      
      .menu-btn-icon {
        font-size: 1.2rem;
        animation: btn-icon-float 2s ease-in-out infinite;
      }
      
      @keyframes btn-icon-float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-2px); }
      }
      
      /* 🚀 메인 액션 버튼 */
      .main-action-btn {
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
        box-shadow: 0 12px 24px rgba(102, 126, 234, 0.3);
        animation: main-btn-gradient 4s ease-in-out infinite;
        margin-top: 1.5rem;
      }
      
      @keyframes main-btn-gradient {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      
      .main-action-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        transition: left 0.6s ease;
      }
      
      .main-action-btn:hover::before {
        left: 100%;
      }
      
      .main-action-btn:hover {
        transform: translateY(-4px) scale(1.02);
        box-shadow: 0 20px 40px rgba(102, 126, 234, 0.4);
      }
      
      .main-action-btn:active {
        transform: translateY(-2px) scale(0.98);
      }
      
      /* 📱 반응형 */
      @media (max-width: 768px) {
        .mypage-magic-container {
          padding: 1.5rem;
        }
        
        .mypage-title {
          font-size: 2.5rem;
        }
        
        .mypage-icon {
          font-size: 3.5rem;
        }
        
        .menu-container {
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        
        .menu-card {
          padding: 2rem;
          border-radius: 24px;
        }
        
        .card-title {
          font-size: 1.5rem;
        }
        
        .menu-btn {
          padding: 1rem 1.25rem;
          font-size: 0.95rem;
        }
      }
      
      /* ♿ 접근성 */
      .menu-btn:focus,
      .main-action-btn:focus {
        outline: 3px solid rgba(102, 126, 234, 0.5);
        outline-offset: 2px;
      }
    `;
    
    document.head.appendChild(style);
  };

  useEffect(() => {
    injectStyles();
  }, []);

  const refreshMe = async () => {
    try {
      const res = await api.get("/mypage/me");
      setMe(res?.data?.data ?? null);
    } catch {
      setMe(null);
    }
  };

  const rollbackAfterAccountDelete = () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      sessionStorage.clear();
      if (api?.defaults?.headers?.common?.Authorization) {
        delete api.defaults.headers.common.Authorization;
      }
    } finally {
      navigate("/login", { replace: true });
    }
  };

  // 🎯 모달 열기 함수들
  const openUserInfoModal = () => setShowUserInfoModal(true);
  const openNicknameEditModal = async () => {
    await refreshMe();
    setShowNicknameEditModal(true);
  };
  const openDeleteAccountModal = () => setShowDeleteAccountModal(true);

  const openPostListModal = () => setShowPostListModal(true);
  const openPostDetailModal = (post) => {
    setSelectedPost(post);
    setShowPostDetailModal(true);
  };
  const openDeleteContentModal = (post) => {
    setSelectedPost(post);
    setShowDeleteContentModal(true);
  };

  // 🎯 모달 닫기 함수들
  const closeUserInfoModal = () => setShowUserInfoModal(false);
  const closeNicknameEditModal = () => setShowNicknameEditModal(false);
  const closeDeleteAccountModal = () => setShowDeleteAccountModal(false);

  const closePostListModal = () => setShowPostListModal(false);
  const closePostDetailModal = () => {
    setShowPostDetailModal(false);
    setSelectedPost(null);
  };
  const closeDeleteContentModal = () => setShowDeleteContentModal(false);

  const onPostDeleted = () => {
    setShowDeleteContentModal(false);
    if (showPostDetailModal) setShowPostDetailModal(false);
    setSelectedPost(null);
    setListRefreshKey((k) => k + 1);
  };

  // 🎨 개별 메뉴 액션 함수들
  const handleUserInfo = () => openUserInfoModal();
  const handleEditProfile = () => openNicknameEditModal();
  const handleDeleteAccount = () => openDeleteAccountModal();
  const handleContentList = () => openPostListModal();
  const handleContentDetail = () => openPostListModal();
  const handleDeleteContent = () => openPostListModal();

  return (
    <div 
      className="mypage-magic-container" 
      style={{ 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' 
      }}
    >
      {/* 💫 플로팅 파티클들 */}
      <div className="floating-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      {/* 🏗️ 메인 콘텐츠 */}
      <div className="mypage-content">
        {/* ✨ 헤더 */}
        <div className="mypage-header">
          <div className="mypage-icon">👤</div>
          <h1 className="mypage-title">Blogi 마이페이지</h1>
          <p className="mypage-subtitle">나만의 블로그 공간을 관리해보세요</p>
        </div>

        {/* 🎭 메뉴 카드들 */}
        <div className="menu-container">
          {/* 🔧 사용자 정보 관리 카드 */}
          <div className="menu-card">
            <div className="card-header">
              <div className="card-icon">🔧</div>
              <h2 className="card-title">MyPage 관리</h2>
              <p className="card-subtitle">사용자 정보를 관리하세요</p>
            </div>
            
            <div className="menu-buttons">
              <button className="menu-btn" onClick={handleUserInfo}>
                <span className="menu-btn-icon">👁️</span>
                <span>사용자 기본 정보 조회</span>
              </button>
              
              <button className="menu-btn" onClick={handleEditProfile}>
                <span className="menu-btn-icon">✏️</span>
                <span>닉네임 및 관심사 수정</span>
              </button>
              
              <button className="menu-btn" onClick={handleDeleteAccount}>
                <span className="menu-btn-icon">⚠️</span>
                <span>회원탈퇴</span>
              </button>
            </div>
            
            <button className="main-action-btn" onClick={openUserInfoModal}>
              🚀 사용자 정보 관리하기
            </button>
          </div>

          {/* 📝 콘텐츠 관리 카드 */}
          <div className="menu-card">
            <div className="card-header">
              <div className="card-icon">📝</div>
              <h2 className="card-title">MyContents 관리</h2>
              <p className="card-subtitle">내 콘텐츠를 관리하세요</p>
            </div>
            
            <div className="menu-buttons">
              <button className="menu-btn" onClick={handleContentList}>
                <span className="menu-btn-icon">📋</span>
                <span>콘텐츠 목록 조회</span>
              </button>
              
              <button className="menu-btn" onClick={handleContentDetail}>
                <span className="menu-btn-icon">🔍</span>
                <span>콘텐츠 상세 조회</span>
              </button>
              
              <button className="menu-btn" onClick={handleDeleteContent}>
                <span className="menu-btn-icon">🗑️</span>
                <span>콘텐츠 삭제</span>
              </button>
            </div>
            
            <button className="main-action-btn" onClick={openPostListModal}>
              📚 내 콘텐츠 관리하기
            </button>
          </div>
        </div>
      </div>

      {/* 🎭 모달들 */}
      {showUserInfoModal && (
        <UserInfoModal
          onClose={closeUserInfoModal}
          onEditNickname={async () => {
            closeUserInfoModal();
            await openNicknameEditModal();
          }}
          onDeleteAccount={() => {
            closeUserInfoModal();
            openDeleteAccountModal();
          }}
        />
      )}

      {showNicknameEditModal && (
        <NicknameEditModal
          user={me || {}}
          onClose={closeNicknameEditModal}
          onNicknameUpdated={(updated) => {
            if (updated) setMe(updated);
          }}
        />
      )}

      {showDeleteAccountModal && (
        <DeleteAccountModal
          onClose={closeDeleteAccountModal}
          onDeleted={() => {
            closeDeleteAccountModal();
            rollbackAfterAccountDelete();
          }}
        />
      )}

      {showPostListModal && (
        <PostListModal
          key={listRefreshKey}
          onClose={closePostListModal}
          onPostClick={(post) => openPostDetailModal(post)}
          onDeletePost={(post) => openDeleteContentModal(post)}
        />
      )}

      {showPostDetailModal && selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onBack={closePostDetailModal}
          onClose={() => {
            closePostDetailModal();
            closePostListModal();
          }}
          onDeletePost={(post) => openDeleteContentModal(post)}
        />
      )}

      {showDeleteContentModal && selectedPost && (
        <DeleteContentModal
          post={selectedPost}
          onClose={closeDeleteContentModal}
          onDeleted={onPostDeleted}
        />
      )}
    </div>
  );
};

export default MyPage;





