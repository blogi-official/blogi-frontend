import React from 'react';
import { Link } from 'react-router-dom';

function Navigator() {
  // CSS 주입 함수
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
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='%23667eea' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='m4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e") !important;
      }

      .navbar-nav-custom {
        gap: 0.5rem;
      }

      .nav-item-custom {
        position: relative;
      }

      .nav-link-custom {
        color: white !important;
        font-weight: 500 !important;
        padding: 0.75rem 1.25rem !important;
        border-radius: 10px !important;
        transition: all 0.3s ease !important;
        text-decoration: none !important;
        position: relative;
        overflow: hidden;
      }

      .nav-link-custom::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea, #764ba2);
        transition: left 0.3s ease;
        z-index: -1;
        border-radius: 10px;
      }

      .nav-link-custom:hover {
        color: white !important;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
      }

      .nav-link-custom:hover::before {
        left: 0;
      }

      .nav-link-custom:focus {
        color: white !important;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
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
        .navbar-brand-custom {
          font-size: 1.5rem !important;
        }
      }
    `;
    document.head.appendChild(style);
  };

  React.useEffect(() => {
    injectStyles();
  }, []);

  return (
    <nav className="navbar navbar-expand-lg dark-navbar">
      <div className="container">
        <Link className="navbar-brand-custom" to="/">
          Blogi
        </Link>
        <button
          className="navbar-toggler navbar-toggler-custom"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon navbar-toggler-icon-custom" />
        </button>
        
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 navbar-nav-custom">
            <li className="nav-item nav-item-custom">
              <Link className="nav-link nav-link-custom" to="/">
                🏠 Home
              </Link>
            </li>
            <li className="nav-item nav-item-custom">
              <Link className="nav-link nav-link-custom" to="/about">
                ℹ️ About
              </Link>
            </li>
            <li className="nav-item nav-item-custom">
              <Link className="nav-link nav-link-custom" to="/chatBot">
                🤖 AI
              </Link>
            </li>
            <li className="nav-item nav-item-custom">
              <Link className="nav-link nav-link-custom" to="/news-summary">
                📰 News
              </Link>
            </li>
            <li className="nav-item nav-item-custom">
              <Link className="nav-link nav-link-custom" to="/blogList">
                📝 Blog
              </Link>
            </li>
            <li className="nav-item nav-item-custom">
              <Link className="nav-link nav-link-custom" to="/mypage">
                👤 MyPage
              </Link>
            </li>
            <li className="nav-item nav-item-custom">
              <Link className="nav-link nav-link-custom" to="/login">
                🔐 Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigator;
