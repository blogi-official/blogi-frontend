import React from 'react';

function Footer() {
  // CSS 주입 함수
  const injectStyles = () => {
    const styleId = 'footer-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .dark-footer {
        background: linear-gradient(135deg, #1a1a1a, #2d2d2d) !important;
        border-top: 1px solid #404040;
        box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.3);
        position: relative;
        overflow: hidden;
      }

      .dark-footer::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, transparent, #667eea, #764ba2, transparent);
        animation: footerShine 3s ease-in-out infinite;
      }

      @keyframes footerShine {
        0% { left: -100%; }
        50% { left: 100%; }
        100% { left: 100%; }
      }

      .footer-content {
        position: relative;
        z-index: 1;
      }

      .footer-text {
        color: white !important;
        font-size: 1rem !important;
        font-weight: 500 !important;
        margin: 0 !important;
        text-align: center !important;
        letter-spacing: 0.5px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .footer-logo {
        background: linear-gradient(135deg, #667eea, #764ba2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 700;
        font-size: 1.1rem;
      }

      .footer-year {
        color: #a0a0a0 !important;
        font-weight: 400;
      }

      .footer-divider {
        width: 2px;
        height: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 1px;
        margin: 0 0.5rem;
      }

      @media (max-width: 576px) {
        .footer-text {
          font-size: 0.9rem !important;
          flex-direction: column;
          gap: 0.25rem;
        }

        .footer-divider {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);
  };

  React.useEffect(() => {
    injectStyles();
  }, []);

  return (
    <footer className="py-5 dark-footer">
      <div className="container footer-content">
        <p className="footer-text">
          <span className="footer-year">© 2025</span>
          <div className="footer-divider"></div>
          <span className="footer-logo">Blogi</span>
          <div className="footer-divider"></div>
          <span>All Rights Reserved</span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;