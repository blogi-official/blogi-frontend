// src/components/Navigation.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ADMIN_TOKEN_KEY } from '../api/client';

function Navigator() {
  const location = useLocation();

  // ✅ CSS 주입 (한 번만)
  const injectStyles = () => {
    const styleId = 'navigator-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .dark-navbar {
        background: linear-gradient(135deg, #1a1a1a, #2d2d2d) !important;
        border-bottom: 1px solid #404040;
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        position: sticky;
        top: 0;
        z-index: 1000;
      }

      .navbar-brand-custom {
        font-size: 1.8rem !important;
        font-weight: 700 !important;
        color: white !important;
        text-decoration: none !important;
        background: linear-gradient(135deg, #667eea, #764ba2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        transition: all 0.3s ease;
      }
      .navbar-brand-custom:hover {
        transform: scale(1.05);
        filter: brightness(1.2);
      }

      .navbar-toggler-custom {
        border: 2px solid #667eea !important;
        border-radius: 8px !important;
        padding: 0.5rem !important;
        transition: all 0.3s ease;
      }
      .navbar-toggler-custom:hover {
        background: rgba(102, 126, 234, 0.1) !important;
        transform: scale(1.05);
      }
      .navbar-toggler-custom:focus {
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3) !important;
      }
      .navbar-toggler-icon-custom {
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='m4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e") !important;
      }

      .navbar-nav-custom { gap: 0.5rem; }
      .nav-item-custom { position: relative; }

      .nav-link-custom {
        color: #e5e7eb !important;
        font-weight: 600 !important;
        padding: 0.75rem 1.1rem !important;
        border-radius: 10px !important;
        transition: all 0.25s ease !important;
        text-decoration: none !important;
        position: relative;
        overflow: hidden;
      }
      .nav-link-custom:hover {
        color: #fff !important;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102,126,234,0.25);
      }
      .nav-link-custom:focus {
        color: #fff !important;
        box-shadow: 0 0 0 3px rgba(102,126,234,0.3);
      }

      /* 현재 경로 활성화 */
      .nav-link-custom.active {
        background: rgba(102,126,234,.25);
        color: #fff !important;
      }

      @media (max-width: 991.98px) {
        .navbar-nav-custom {
          padding-top: 1rem;
          border-top: 1px solid #404040;
          margin-top: 1rem;
        }
        .nav-link-custom {
          margin-bottom: 0.5rem;
          text-align: center;
        }
      }

      @media (max-width: 576px) {
        .navbar-brand-custom { font-size: 1.5rem !important; }
      }
    `;
    document.head.appendChild(style);
  };

  // ✅ 관리자 인증 여부 (accessToken 존재 여부로 판단)
  const [adminAuthed, setAdminAuthed] = React.useState(!!localStorage.getItem(ADMIN_TOKEN_KEY));
  React.useEffect(() => {
    const onStorage = () => setAdminAuthed(!!localStorage.getItem(ADMIN_TOKEN_KEY));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // ✅ 모바일 메뉴 열림 상태 (Bootstrap JS 없이 제어)
  const [menuOpen, setMenuOpen] = React.useState(false);
  const toggleMenu = () => setMenuOpen(v => !v);
  const closeMenu = () => setMenuOpen(false);

  // 라우트 변경 시 자동 닫기
  React.useEffect(() => { closeMenu(); }, [location.pathname]);

  // Esc 키로 닫기 (접근성)
  React.useEffect(() => {
    function onKeydown(e) { if (e.key === 'Escape') closeMenu(); }
    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  }, []);

  // 리사이즈 시 데스크톱 너비면 강제 열림 상태 해제(표시는 자동)
  React.useEffect(() => {
    function onResize() { if (window.innerWidth >= 992) closeMenu(); }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  React.useEffect(() => { injectStyles(); }, []);

  // 현재 경로 활성화
  const isActive = (path) => (location.pathname === path ? 'active' : '');

  return (
    <nav className="navbar navbar-expand-lg navbar-dark dark-navbar">
      <div className="container">
        <Link className="navbar-brand navbar-brand-custom" to="/" onClick={closeMenu}>Blogi</Link>

        {/* ✅ Bootstrap data-attrs 제거, React로 토글 */}
        <button
          className="navbar-toggler navbar-toggler-custom"
          type="button"
          aria-controls="navbarSupportedContent"
          aria-expanded={menuOpen ? 'true' : 'false'}
          aria-label="Toggle navigation"
          onClick={toggleMenu}
        >
          <span className="navbar-toggler-icon navbar-toggler-icon-custom" />
        </button>

        <div
          id="navbarSupportedContent"
          className={`navbar-collapse collapse${menuOpen ? ' show' : ''}`}
        >
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 navbar-nav-custom">
            <li className="nav-item nav-item-custom">
              <Link className={`nav-link nav-link-custom ${isActive('/')}`} to="/" onClick={closeMenu}>🏠 Home</Link>
            </li>
            <li className="nav-item nav-item-custom">
              <Link className={`nav-link nav-link-custom ${isActive('/about')}`} to="/about" onClick={closeMenu}>ℹ️ About</Link>
            </li>
            {/* <li className="nav-item nav-item-custom">
              <Link className={`nav-link nav-link-custom ${isActive('/chatBot')}`} to="/chatBot" onClick={closeMenu}>🤖 AI</Link>
            </li>
            <li className="nav-item nav-item-custom">
              <Link className={`nav-link nav-link-custom ${isActive('/news-summary')}`} to="/news-summary" onClick={closeMenu}>📰 News</Link>
            </li>
            <li className="nav-item nav-item-custom">
              <Link className={`nav-link nav-link-custom ${isActive('/blogList')}`} to="/blogList" onClick={closeMenu}>📝 Blog</Link>
            </li> */}
            <li className="nav-item nav-item-custom">
              <Link className={`nav-link nav-link-custom ${isActive('/mypage')}`} to="/mypage" onClick={closeMenu}>👤 MyPage</Link>
            </li>
            <li className="nav-item nav-item-custom">
              <Link className={`nav-link nav-link-custom ${isActive('/login')}`} to="/login" onClick={closeMenu}>🔐 Login</Link>
            </li>

            {/* ✅ 관리자 진입 메뉴 (토큰 유무로 분기) */}
            <li className="nav-item nav-item-custom">
              {adminAuthed ? (
                <Link className={`nav-link nav-link-custom ${location.pathname.startsWith('/admin') ? 'active' : ''}`} to="/admin" onClick={closeMenu}>🛠️ Admin 콘솔</Link>
              ) : (
                <Link className={`nav-link nav-link-custom ${isActive('/admin/login')}`} to="/admin/login" onClick={closeMenu}>🛡️ Admin 로그인</Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigator;


