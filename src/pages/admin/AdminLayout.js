// src/pages/admin/AdminLayout.js
import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useAdminAuth from "../../hooks/useAdminAuth";

export default function AdminLayout() {
  const { isAuthed, clear } = useAdminAuth();
  const nav = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 🎨 까리한 CSS 강제 주입!
  const injectAdminLayoutStyles = () => {
    const styleId = 'blogi-admin-layout-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* 🌟 어드민 레이아웃 전용 스타일 */
      .admin-layout-container {
        min-height: 100vh;
        background: #f8fafc;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      }

      /* 🎯 헤더 스타일링 */
      .admin-header {
        position: sticky;
        top: 0;
        z-index: 50;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      }

      .admin-header-content {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 1rem;
        height: 4rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      /* 🏷️ 로고 섹션 */
      .admin-logo-section {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .admin-logo-icon {
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 0.75rem;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 8px rgba(99, 102, 241, 0.2);
        animation: admin-logo-glow 3s ease-in-out infinite;
      }

      @keyframes admin-logo-glow {
        0%, 100% { 
          box-shadow: 0 4px 8px rgba(99, 102, 241, 0.2);
          transform: scale(1);
        }
        50% { 
          box-shadow: 0 6px 12px rgba(99, 102, 241, 0.3);
          transform: scale(1.02);
        }
      }

      .admin-logo-emoji {
        font-size: 1.25rem;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
      }

      .admin-logo-text {
        font-size: 1.125rem;
        font-weight: 800;
        color: #1e293b;
        letter-spacing: -0.025em;
      }

      /* 🧭 네비게이션 */
      .admin-nav-desktop {
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }

      .admin-nav-link {
        padding: 0.5rem 0.75rem;
        border-radius: 0.5rem;
        color: #64748b;
        font-weight: 500;
        font-size: 0.875rem;
        text-decoration: none;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }

      .admin-nav-link::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent);
        transition: left 0.5s ease;
      }

      .admin-nav-link:hover::before {
        left: 100%;
      }

      .admin-nav-link:hover {
        color: #6366f1;
        background: rgba(99, 102, 241, 0.05);
        transform: translateY(-1px);
      }

      .admin-nav-link.active {
        color: #6366f1;
        background: rgba(99, 102, 241, 0.1);
        font-weight: 600;
      }

      .admin-nav-link.active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: #6366f1;
        border-radius: 1px;
      }

      /* 🚪 로그아웃 버튼 */
      .admin-logout-btn {
        margin-left: 0.5rem;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 0.5rem;
        background: #ef4444;
        color: white;
        font-weight: 600;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
      }

      .admin-logout-btn:hover {
        background: #dc2626;
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
      }

      .admin-logout-btn:active {
        transform: translateY(0px);
      }

      /* 📱 모바일 메뉴 버튼 */
      .admin-mobile-menu-btn {
        display: none;
        padding: 0.5rem;
        border: none;
        background: none;
        color: #64748b;
        cursor: pointer;
        border-radius: 0.5rem;
        transition: all 0.2s ease;
      }

      .admin-mobile-menu-btn:hover {
        background: rgba(99, 102, 241, 0.05);
        color: #6366f1;
      }

      /* 📱 모바일 메뉴 */
      .admin-mobile-menu {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transform: translateY(-10px);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .admin-mobile-menu.open {
        transform: translateY(0px);
        opacity: 1;
        visibility: visible;
      }

      .admin-mobile-menu-content {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .admin-mobile-nav-link {
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        color: #64748b;
        font-weight: 500;
        text-decoration: none;
        transition: all 0.2s ease;
        border: 1px solid transparent;
      }

      .admin-mobile-nav-link:hover {
        color: #6366f1;
        background: rgba(99, 102, 241, 0.05);
        border-color: rgba(99, 102, 241, 0.1);
      }

      .admin-mobile-nav-link.active {
        color: #6366f1;
        background: rgba(99, 102, 241, 0.1);
        border-color: rgba(99, 102, 241, 0.2);
        font-weight: 600;
      }

      .admin-mobile-logout-btn {
        margin-top: 0.5rem;
        padding: 0.75rem 1rem;
        border: none;
        border-radius: 0.5rem;
        background: #ef4444;
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .admin-mobile-logout-btn:hover {
        background: #dc2626;
      }

      /* 📄 메인 컨텐츠 */
      .admin-main-content {
        max-width: 1280px;
        margin: 0 auto;
        padding: 2rem 1rem;
        animation: admin-content-fade-in 0.5s ease-out;
      }

      @keyframes admin-content-fade-in {
        0% {
          opacity: 0;
          transform: translateY(10px);
        }
        100% {
          opacity: 1;
          transform: translateY(0px);
        }
      }

      /* 📱 반응형 디자인 */
      @media (max-width: 768px) {
        .admin-nav-desktop {
          display: none;
        }
        
        .admin-mobile-menu-btn {
          display: block;
        }
        
        .admin-header-content {
          padding: 0 1rem;
        }
        
        .admin-main-content {
          padding: 1.5rem 1rem;
        }
        
        .admin-logo-text {
          font-size: 1rem;
        }
      }

      @media (max-width: 480px) {
        .admin-header-content {
          padding: 0 0.75rem;
        }
        
        .admin-main-content {
          padding: 1rem 0.75rem;
        }
        
        .admin-logo-section {
          gap: 0.5rem;
        }
        
        .admin-logo-icon {
          width: 2rem;
          height: 2rem;
        }
        
        .admin-logo-emoji {
          font-size: 1rem;
        }
      }

      /* ♿ 접근성 */
      .admin-nav-link:focus,
      .admin-logout-btn:focus,
      .admin-mobile-menu-btn:focus {
        outline: 2px solid #6366f1;
        outline-offset: 2px;
      }

      /* 🎭 다크모드 지원 */
      @media (prefers-color-scheme: dark) {
        .admin-layout-container {
          background: #0f172a;
        }
        
        .admin-header {
          background: rgba(15, 23, 42, 0.95);
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }
        
        .admin-logo-text {
          color: #f1f5f9;
        }
        
        .admin-nav-link {
          color: #94a3b8;
        }
        
        .admin-nav-link:hover {
          color: #a5b4fc;
          background: rgba(99, 102, 241, 0.1);
        }
        
        .admin-nav-link.active {
          color: #a5b4fc;
          background: rgba(99, 102, 241, 0.2);
        }
        
        .admin-mobile-menu {
          background: rgba(15, 23, 42, 0.98);
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }
        
        .admin-mobile-nav-link {
          color: #94a3b8;
        }
        
        .admin-mobile-nav-link:hover {
          color: #a5b4fc;
          background: rgba(99, 102, 241, 0.1);
        }
        
        .admin-mobile-nav-link.active {
          color: #a5b4fc;
          background: rgba(99, 102, 241, 0.2);
        }
      }
    `;
    
    document.head.appendChild(style);
  };

  useEffect(() => {
    console.log("[AdminLayout] mounted");
    injectAdminLayoutStyles();
    
    if (!isAuthed) nav("/admin/login");
  }, [isAuthed, nav]);

  const handleLogout = () => {
    console.log("[AdminLayout] logout clicked");
    clear();
    nav("/admin/login");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // 모바일 메뉴 열림 시 스크롤 잠금
  useEffect(() => {
    const prev = document.body.style.overflow;
  
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = prev;
    }
  
    // 항상 cleanup 반환 (ESLint 경고 제거)
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileMenuOpen]);

  // 모바일 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.admin-header')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <div className="admin-layout-container">
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-logo-section">


          </div>

          {/* 데스크톱 네비게이션 */}
          <nav className="admin-nav-desktop">
            <NavLink 
              to="/admin" 
              end
              className={({ isActive }) => 
                `admin-nav-link ${isActive ? 'active' : ''}`
              }
            >
              📊 대시보드
            </NavLink>
            <NavLink 
              to="/admin/keywords" 
              className={({ isActive }) => 
                `admin-nav-link ${isActive ? 'active' : ''}`
              }
            >
              🔑 키워드
            </NavLink>
            <NavLink 
              to="/admin/generated" 
              className={({ isActive }) => 
                `admin-nav-link ${isActive ? 'active' : ''}`
              }
            >
              📝 생성글
            </NavLink>
            <NavLink 
              to="/admin/users" 
              className={({ isActive }) => 
                `admin-nav-link ${isActive ? 'active' : ''}`
              }
            >
              👥 유저
            </NavLink>
            <button onClick={handleLogout} className="admin-logout-btn">
              🚪 로그아웃
            </button>
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <button 
            onClick={toggleMobileMenu}
            className="admin-mobile-menu-btn"
            aria-label="메뉴 열기"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* 모바일 메뉴 */}
        <div className={`admin-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="admin-mobile-menu-content">
            <NavLink 
              to="/admin" 
              end
              className={({ isActive }) => 
                `admin-mobile-nav-link ${isActive ? 'active' : ''}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              📊 대시보드
            </NavLink>
            <NavLink 
              to="/admin/keywords" 
              className={({ isActive }) => 
                `admin-mobile-nav-link ${isActive ? 'active' : ''}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              🔑 키워드
            </NavLink>
            <NavLink 
              to="/admin/generated" 
              className={({ isActive }) => 
                `admin-mobile-nav-link ${isActive ? 'active' : ''}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              📝 생성글
            </NavLink>
            <NavLink 
              to="/admin/users" 
              className={({ isActive }) => 
                `admin-mobile-nav-link ${isActive ? 'active' : ''}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              👥 유저
            </NavLink>
            <button onClick={handleLogout} className="admin-mobile-logout-btn">
              🚪 로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
}
