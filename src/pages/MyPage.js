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

  // CSS 주입 함수
  const injectStyles = () => {
    const styleId = 'mypage-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .mypage-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        min-height: 100vh;
      }

      .mypage-title {
        font-size: 2.5rem;
        font-weight: 700;
        color: #2d3748;
        margin-bottom: 2rem;
        text-align: center;
        background: linear-gradient(135deg, #667eea, #764ba2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      /* ★ 버튼 영역: 더 크게 + 중앙 쪽 배치 */
      .menu-flex {
        display: flex;
        gap: 1.25rem;
        position: relative;
        z-index: 200;
        justify-content: center;    /* 가로 중앙 */
        align-items: center;        /* 세로 중앙 */
        flex-wrap: wrap;
        /* 아래 두 줄로 화면 중앙 쪽으로 시선 이동 */
        min-height: 20vh;           /* 버튼 영역을 크게 잡아 세로 가운데로 당김 */
        margin: 6vh auto 3rem;      /* 상단 여백 늘려 중앙 쪽 배치 */
      }

      /* ★ 버튼: 확실히 크게 */
      .btn-primary,
      .btn-secondary {
        border: none;
        padding: clamp(18px, 2.8vh, 28px) clamp(36px, 6vw, 64px); /* 더 두툼하게 */
        border-radius: 14px;
        font-size: clamp(1.1rem, 1.6vw, 1.6rem);                  /* 큰 타이포 */
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        min-width: 320px;                                         /* 버튼 폭 최소 확보 */
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
        letter-spacing: 0.2px;
      }

      /* 기존 그라디언트 유지 (색은 그대로 두고 크기만 바뀜) */
      .btn-primary {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
      }
      .btn-primary:hover {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 16px 40px rgba(102, 126, 234, 0.45);
      }

      .btn-secondary {
        background: linear-gradient(135deg, #4facfe, #00f2fe);
        color: white;
      }
      .btn-secondary:hover {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 16px 40px rgba(79, 172, 254, 0.45);
      }

      /* ★ 모바일에서 꽉 차게 */
      @media (max-width: 768px) {
        .mypage-container { padding: 1rem; }
        .mypage-title { font-size: 2rem; }

        .menu-flex {
          min-height: auto;        /* 모바일에선 일반 흐름 */
          margin: 1.25rem 0 1rem;
          flex-direction: column;
        }

        .btn-primary,
        .btn-secondary {
          width: 100%;
          max-width: 420px;
          min-width: 0;
          font-size: 1.125rem;
          padding: 18px 28px;
        }
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

  return (
    <div className="mypage-container" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <h1 className="mypage-title">마이페이지 관리</h1>

      {/* 메뉴 */}
      <div className="menu-flex">
        <button 
          type="button" 
          className="btn-primary" 
          onClick={openUserInfoModal}
          style={{ outline: 'none' }}
        >
          MyPage 관리 (사용자 정보)
        </button>
        <button 
          type="button" 
          className="btn-secondary" 
          onClick={openPostListModal}
          style={{ outline: 'none' }}
        >
          MyContents 관리 (내 콘텐츠 목록)
        </button>
      </div>

      {/* 사용자 정보 */}
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

      {/* MyContents: 목록/상세/삭제 */}
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





