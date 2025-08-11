// src/components/admin/GeneratedDetailModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { getGeneratedDetail, manageGenerated, deleteGenerated } from "../../api/admin";

const nf = (n) => Number(n || 0).toLocaleString();

/** 내부 전용 확인 다이얼로그 */
function InlineConfirm({ open, title, message, confirmText = "확인", cancelText = "취소", onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return;
    
    const styleId = 'confirm-modal-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .confirm-backdrop {
        backdrop-filter: blur(8px);
        animation: fadeIn 0.3s ease-out;
      }
      
      .confirm-modal {
        animation: bounceIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }
      
      @keyframes bounceIn {
        0% { transform: scale(0.3) rotate(-10deg); opacity: 0; }
        50% { transform: scale(1.1) rotate(5deg); }
        70% { transform: scale(0.9) rotate(-2deg); }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) existingStyle.remove();
    };
  }, [open]);

  if (!open) return null;
  
  return createPortal(
    <div 
      className="confirm-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1001,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onCancel}
    >
      <div
        className="confirm-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: '400px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <div style={{ padding: '32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 16px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              animation: 'pulse 2s infinite'
            }}>
              ⚠️
            </div>
            <h3 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '8px'
            }}>
              {title}
            </h3>
            <p style={{ 
              color: '#6b7280', 
              fontSize: '16px',
              lineHeight: '1.5'
            }}>
              {message}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onCancel}
              style={{
                flex: 1,
                padding: '14px 20px',
                borderRadius: '16px',
                border: '2px solid #e5e7eb',
                background: 'white',
                color: '#374151',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f9fafb';
                e.target.style.borderColor = '#d1d5db';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              style={{
                flex: 1,
                padding: '14px 20px',
                borderRadius: '16px',
                border: 'none',
                background: 'linear-gradient(90deg, #ef4444, #dc2626)',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(90deg, #dc2626, #b91c1c)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 25px 50px -12px rgba(239, 68, 68, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 25px -5px rgba(239, 68, 68, 0.4)';
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

/** 상세 모달 본체 (Modal+ConfirmDialog 통합) */
export default function GeneratedDetailModal({ open, postId, onClose, onHidden, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  // 확인 모달 상태
  const [confirmHide, setConfirmHide] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // CSS 스타일 주입
  useEffect(() => {
    if (!open) return;
    
    const styleId = 'detail-modal-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
      
      .detail-modal-backdrop {
        backdrop-filter: blur(20px);
        animation: fadeIn 0.4s ease-out;
        font-family: 'Inter', sans-serif;
      }
      
      .detail-modal {
        animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .image-gallery {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 16px;
      }
      
      .image-item {
        position: relative;
        border-radius: 16px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s ease;
        aspect-ratio: 1;
      }
      
      .image-item:hover {
        transform: scale(1.05);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      }
      
      .image-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(45deg, rgba(0,0,0,0.1), transparent);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .image-item:hover .image-overlay {
        opacity: 1;
      }
      
      .content-preview {
        background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
        border: 2px solid #e2e8f0;
        border-radius: 20px;
        padding: 24px;
        position: relative;
        overflow: hidden;
      }
      
      .content-preview::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #f59e0b, #f97316, #ef4444);
      }
      
      .prose {
        line-height: 1.7;
        color: #374151;
      }
      
      .prose h1, .prose h2, .prose h3 {
        color: #111827;
        font-weight: 700;
      }
      
      .prose p {
        margin-bottom: 16px;
      }
      
      .prose img {
        border-radius: 12px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
      }
      
      .action-button {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .action-button:hover {
        transform: translateY(-3px);
      }
      
      .loading-spinner {
        animation: spin 1s linear infinite;
      }
      
      .fade-in {
        animation: fadeIn 0.6s ease-out;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideUp {
        from { 
          opacity: 0; 
          transform: translateY(100px) scale(0.95); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0) scale(1); 
        }
      }
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      .image-lightbox {
        backdrop-filter: blur(20px);
        animation: fadeIn 0.3s ease-out;
      }
      
      .lightbox-image {
        animation: zoomIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 90vw;
        max-height: 90vh;
        object-fit: contain;
      }
      
      @keyframes zoomIn {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) existingStyle.remove();
    };
  }, [open]);

  // 상세 불러오기
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!open || !postId) return;
      try {
        setLoading(true);
        setError("");
        const payload = await getGeneratedDetail(postId);
        if (!alive) return;
        setDetail(payload?.data ?? payload ?? null);
      } catch (e) {
        if (!alive) return;
        console.error("[GeneratedDetailModal] getGeneratedDetail error:", e);
        setError(e?.response?.data?.detail || e?.message || "상세 정보를 불러오지 못했습니다.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [open, postId]);

  const images = useMemo(() => {
    if (!detail) return [];
    return [detail.image_1_url, detail.image_2_url, detail.image_3_url].filter(Boolean);
  }, [detail]);

  async function handleHide() {
    try {
      setConfirmHide(false);
      await manageGenerated(postId, { is_active: false });
      onHidden?.(postId);
      onClose?.();
    } catch (e) {
      console.error("[GeneratedDetailModal] hide error:", e);
      alert(e?.response?.data?.detail || e?.message || "비공개 처리 실패");
    }
  }

  async function handleDelete() {
    try {
      setConfirmDelete(false);
      const ok = await deleteGenerated(postId);
      if (ok) {
        onDeleted?.(postId);
        onClose?.();
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (e) {
      console.error("[GeneratedDetailModal] delete error:", e);
      alert(e?.response?.data?.detail || e?.message || "삭제 실패");
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        weekday: 'short'
      });
    } catch {
      return 'N/A';
    }
  };

  if (!open) return null;

  return createPortal(
    <>
      {/* 상세 모달 */}
      <div
        className="detail-modal-backdrop"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}
        onClick={onClose}
      >
        <div
          className="detail-modal"
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            width: '100%',
            maxWidth: '1200px',
            maxHeight: '90vh',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          {/* 헤더 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 32px',
            borderBottom: '2px solid #f1f5f9',
            background: 'linear-gradient(90deg, #f8fafc, #ffffff)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px'
              }}>
                📝
              </div>
              <h3 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold',
                color: '#111827'
              }}>
                생성 콘텐츠 상세
              </h3>
            </div>
            <button
              onClick={onClose}
              style={{
                padding: '12px 20px',
                borderRadius: '16px',
                border: '2px solid #e5e7eb',
                background: 'white',
                color: '#374151',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f9fafb';
                e.target.style.borderColor = '#d1d5db';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              ✕ 닫기
            </button>
          </div>

          {/* 콘텐츠 */}
          <div style={{ 
            padding: '32px', 
            overflowY: 'auto', 
            maxHeight: 'calc(90vh - 140px)' 
          }}>
            {error ? (
              <div className="fade-in" style={{
                padding: '24px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '2px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '16px',
                color: '#dc2626',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                  오류가 발생했습니다
                </div>
                <div>{error}</div>
              </div>
            ) : loading ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '64px 0',
                color: '#6b7280'
              }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px' }}>
                  <div className="loading-spinner" style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #f3f4f6',
                    borderTop: '4px solid #f59e0b',
                    borderRadius: '50%'
                  }}></div>
                  <span style={{ fontSize: '20px', fontWeight: '500' }}>
                    까리한 콘텐츠를 불러오는 중...
                  </span>
                </div>
              </div>
            ) : !detail ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '64px 0',
                color: '#6b7280'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
                <div style={{ fontSize: '20px', fontWeight: '500' }}>
                  데이터가 없습니다
                </div>
              </div>
            ) : (
              <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* 제목 및 메타 정보 */}
                <div>
                  <h1 style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '16px',
                    lineHeight: '1.2'
                  }}>
                    {detail.title ?? "(제목 없음)"}
                  </h1>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    flexWrap: 'wrap',
                    padding: '16px 24px',
                    background: 'rgba(99, 102, 241, 0.05)',
                    borderRadius: '16px',
                    border: '1px solid rgba(99, 102, 241, 0.1)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '20px' }}>📅</span>
                      <span style={{ color: '#6b7280', fontWeight: '500' }}>
                        {formatDate(detail.created_at)}
                      </span>
                    </div>
                    
                    {typeof detail.copy_count !== "undefined" && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '20px' }}>📋</span>
                        <span style={{ color: '#6b7280', fontWeight: '500' }}>
                          복사 {nf(detail.copy_count)}회
                        </span>
                      </div>
                    )}
                    
                    <div style={{
                      padding: '6px 16px',
                      borderRadius: '20px',
                      background: detail.is_active === false 
                        ? 'linear-gradient(90deg, #f59e0b, #f97316)' 
                        : 'linear-gradient(90deg, #10b981, #059669)',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      {detail.is_active === false ? '🟡 비공개' : '🟢 공개'}
                    </div>
                  </div>
                </div>

                {/* 이미지 갤러리 */}
                {images.length > 0 && (
                  <div>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#111827',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      🖼️ 이미지 갤러리 ({images.length}개)
                    </h3>
                    <div className="image-gallery">
                      {images.map((src, i) => (
                        <div
                          key={i}
                          className="image-item"
                          onClick={() => setSelectedImage(src)}
                        >
                          <img
                            src={src}
                            alt={`image_${i + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: '16px'
                            }}
                          />
                          <div className="image-overlay">
                            <div style={{
                              background: 'rgba(0, 0, 0, 0.7)',
                              color: 'white',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600'
                            }}>
                              🔍 확대보기
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 콘텐츠 미리보기 */}
                <div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    📄 콘텐츠 미리보기
                  </h3>
                  <div className="content-preview">
                    <div
                      className="prose"
                      style={{ maxWidth: 'none' }}
                      dangerouslySetInnerHTML={{ 
                        __html: detail.content || "<p style='color: #9ca3af; font-style: italic;'>본문이 없습니다.</p>" 
                      }}
                    />
                  </div>
                </div>

                {/* 액션 버튼들 */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '16px',
                  paddingTop: '24px',
                  borderTop: '2px solid #f1f5f9'
                }}>
                  <button
                    className="action-button"
                    onClick={() => setConfirmHide(true)}
                    style={{
                      padding: '14px 24px',
                      borderRadius: '16px',
                      border: '2px solid #f59e0b',
                      background: 'rgba(245, 158, 11, 0.1)',
                      color: '#d97706',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(245, 158, 11, 0.2)';
                      e.target.style.borderColor = '#d97706';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(245, 158, 11, 0.1)';
                      e.target.style.borderColor = '#f59e0b';
                    }}
                  >
                    🔒 비공개 처리
                  </button>
                  
                  <button
                    className="action-button"
                    onClick={() => setConfirmDelete(true)}
                    style={{
                      padding: '14px 24px',
                      borderRadius: '16px',
                      border: 'none',
                      background: 'linear-gradient(90deg, #ef4444, #dc2626)',
                      color: 'white',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.4)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(90deg, #dc2626, #b91c1c)';
                      e.target.style.boxShadow = '0 25px 50px -12px rgba(239, 68, 68, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
                      e.target.style.boxShadow = '0 10px 25px -5px rgba(239, 68, 68, 0.4)';
                    }}
                  >
                    🗑️ 영구 삭제
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 이미지 라이트박스 */}
      {selectedImage && (
        <div
          className="image-lightbox"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1002,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="확대 이미지"
            className="lightbox-image"
            style={{
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setSelectedImage(null)}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(0, 0, 0, 0.9)';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(0, 0, 0, 0.7)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* 내부 확인 다이얼로그 */}
      <InlineConfirm
        open={confirmHide}
        title="비공개 처리"
        message="해당 콘텐츠를 비공개로 전환할까요? 되돌릴 수 없습니다."
        confirmText="비공개"
        onConfirm={handleHide}
        onCancel={() => setConfirmHide(false)}
      />
      <InlineConfirm
        open={confirmDelete}
        title="영구 삭제"
        message="정말로 삭제하시겠습니까? 이 동작은 되돌릴 수 없습니다."
        confirmText="삭제"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </>,
    document.body
  );
}
