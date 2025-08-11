import React, { useEffect, useState } from "react";
import { api } from "../api/client";

/** GET /mypage/posts/:id/ */
const PostDetailModal = ({ post, onBack, onClose, onDeletePost }) => {
  const id = post?.id;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // CSS 주입 함수
  const injectStyles = () => {
    const styleId = 'postdetail-modal-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .postdetail-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
        backdrop-filter: blur(10px);
      }

      .postdetail-modal {
        background: white;
        border-radius: 20px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        width: 96vw;
        max-width: 1400px;
        max-height: 90vh;
        overflow: auto;
        padding: 2.5rem;
        animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        position: relative;
      }

      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: translateY(-100px) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .postdetail-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 3px solid #f1f5f9;
        position: relative;
      }

      .postdetail-header::after {
        content: '';
        position: absolute;
        bottom: -3px;
        left: 0;
        width: 60px;
        height: 3px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 2px;
      }

      .postdetail-title {
        font-size: 2rem;
        font-weight: 700;
        color: #1e293b;
        background: linear-gradient(135deg, #667eea, #764ba2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .header-buttons {
        display: flex;
        gap: 0.75rem;
      }

      .btn-back {
        background: linear-gradient(135deg, #64748b, #475569);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.95rem;
      }

      .btn-back:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(100, 116, 139, 0.4);
      }

      .btn-close-detail {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.95rem;
      }

      .btn-close-detail:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
      }

      .loading-detail {
        padding: 3rem 0;
        text-align: center;
        color: #64748b;
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
      }

      .loading-spinner {
        width: 24px;
        height: 24px;
        border: 3px solid #e2e8f0;
        border-top: 3px solid #667eea;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .error-detail {
        color: #dc2626;
        margin-bottom: 1.5rem;
        padding: 1.5rem;
        background: linear-gradient(135deg, #fef2f2, #fee2e2);
        border: 2px solid #fecaca;
        border-radius: 12px;
        font-weight: 500;
        text-align: center;
      }

      .content-article {
        max-width: none;
        line-height: 1.7;
      }

      .content-header {
        margin-bottom: 2rem;
        padding: 1.5rem;
        background: linear-gradient(135deg, #f8fafc, #e2e8f0);
        border-radius: 16px;
        border-left: 5px solid #667eea;
      }

      .content-title {
        font-size: 1.75rem;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 1rem;
        line-height: 1.3;
      }

      .content-meta {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        font-size: 0.95rem;
        color: #64748b;
        flex-wrap: wrap;
      }

      .meta-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: white;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .copy-badge {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 0.4rem 0.8rem;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.9rem;
      }

      .content-body {
        background: white;
        border: 2px solid #f1f5f9;
        border-radius: 16px;
        padding: 2rem;
        margin: 2rem 0;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        font-size: 1.1rem;
        line-height: 1.8;
        color: #374151;
      }

      .images-section {
        margin: 2rem 0;
      }

      .images-title {
        font-size: 1.3rem;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .images-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
      }

      .image-container {
        position: relative;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        cursor: pointer;
        background: #f8fafc;
      }

      .image-container:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
      }

      .content-image {
        width: 100%;
        height: 250px;
        object-fit: cover;
        transition: all 0.3s ease;
      }

      .image-container:hover .content-image {
        transform: scale(1.05);
      }

      .image-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8));
        opacity: 0;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        font-size: 1.1rem;
      }

      .image-container:hover .image-overlay {
        opacity: 1;
      }

      .actions-section {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 3rem;
        padding-top: 2rem;
        border-top: 2px solid #f1f5f9;
      }

      .btn-delete-detail {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
        border: none;
        padding: 0.75rem 2rem;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .btn-delete-detail:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
      }

      /* 이미지 확대 모달 */
      .image-lightbox {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1001;
        backdrop-filter: blur(5px);
      }

      .lightbox-content {
        max-width: 90vw;
        max-height: 90vh;
        position: relative;
      }

      .lightbox-image {
        max-width: 100%;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 12px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
      }

      .lightbox-close {
        position: absolute;
        top: -50px;
        right: 0;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      }

      .lightbox-close:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.1);
      }

      @media (max-width: 768px) {
        .postdetail-modal {
          width: 95vw;
          padding: 1.5rem;
          max-height: 95vh;
        }

        .postdetail-header {
          flex-direction: column;
          gap: 1rem;
          align-items: stretch;
        }

        .postdetail-title {
          font-size: 1.5rem;
          text-align: center;
        }

        .header-buttons {
          justify-content: center;
        }

        .content-title {
          font-size: 1.4rem;
        }

        .content-meta {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .images-grid {
          grid-template-columns: 1fr;
        }

        .actions-section {
          justify-content: center;
        }
      }
    `;
    document.head.appendChild(style);
  };

  useEffect(() => {
    injectStyles();
  }, []);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/mypage/posts/${id}/`);
        if (alive) setData(res?.data ?? null);
      } catch (err) {
        const r = err?.response?.data;
        if (alive) setError((typeof r === "string" && r) || r?.detail || "상세 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  const images = data ? [data.image_1_url, data.image_2_url, data.image_3_url].filter(Boolean) : [];

  const openImageLightbox = (index) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  return (
    <>
      <div className="postdetail-overlay">
        <div className="postdetail-modal">
          <div className="postdetail-header">
            <h2 className="postdetail-title">콘텐츠 상세</h2>
            <div className="header-buttons">
              <button 
                type="button" 
                className="btn-back" 
                onClick={onBack}
                style={{ outline: 'none' }}
              >
                ← 뒤로가기
              </button>
              <button 
                type="button" 
                className="btn-close-detail" 
                onClick={onClose}
                style={{ outline: 'none' }}
              >
                ✕ 닫기
              </button>
            </div>
          </div>

          {loading && (
            <div className="loading-detail">
              <div className="loading-spinner"></div>
              불러오는 중...
            </div>
          )}
          
          {error && <div className="error-detail">⚠️ {error}</div>}

          {data && !error && (
            <article className="content-article">
              <header className="content-header">
                <h3 className="content-title">{data.title}</h3>
                <div className="content-meta">
                  <div className="meta-item">
                    📅 {new Date(data.created_at).toLocaleString()}
                  </div>
                  <div className="meta-item">
                    <span className="copy-badge">📋 복사수 {data.copy_count}</span>
                  </div>
                </div>
              </header>

              <div 
                className="content-body" 
                dangerouslySetInnerHTML={{ __html: data.content }} 
              />

              {images.length > 0 && (
                <div className="images-section">
                  <h4 className="images-title">
                    🖼️ 첨부 이미지 ({images.length}개)
                  </h4>
                  <div className="images-grid">
                    {images.map((src, i) => (
                      <div 
                        key={i} 
                        className="image-container"
                        onClick={() => openImageLightbox(i)}
                      >
                        <img 
                          src={src} 
                          alt={`첨부 이미지 ${i + 1}`} 
                          className="content-image" 
                        />
                        <div className="image-overlay">
                          🔍 확대보기
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="actions-section">
                <button
                  type="button"
                  className="btn-delete-detail"
                  onClick={() => onDeletePost?.(data)}
                  style={{ outline: 'none' }}
                >
                  🗑️ 삭제
                </button>
              </div>
            </article>
          )}
        </div>
      </div>

      {/* 이미지 확대 모달 */}
      {selectedImageIndex !== null && (
        <div className="image-lightbox" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="lightbox-close" 
              onClick={closeLightbox}
              style={{ outline: 'none' }}
            >
              ✕
            </button>
            <img 
              src={images[selectedImageIndex]} 
              alt={`확대 이미지 ${selectedImageIndex + 1}`}
              className="lightbox-image"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PostDetailModal;



