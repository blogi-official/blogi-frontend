import React, { useEffect, useState } from "react";
import { api } from "../api/client";

/** 인라인 모달 / GET /mypage/posts/?page=&page_size= */
const PostListModal = ({ onClose, onPostClick, onDeletePost, pageSize = 20 }) => {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // CSS 주입 함수
  const injectStyles = () => {
    const styleId = 'postlist-modal-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .postlist-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
        backdrop-filter: blur(8px);
      }

      .postlist-modal {
        background: white;
        border-radius: 16px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        width: 96vw;
        max-width: 1400px;
        max-height: 90vh;
        overflow: auto;
        padding: 2rem;
        animation: modalSlideIn 0.3s ease-out;
      }

      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: translateY(-50px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .postlist-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid #f1f5f9;
      }

      .postlist-title {
        font-size: 1.75rem;
        font-weight: 700;
        color: #1e293b;
        background: linear-gradient(135deg, #667eea, #764ba2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .btn-close {
        background: linear-gradient(135deg, #64748b, #475569);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .btn-close:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(100, 116, 139, 0.4);
      }

      .loading-text {
        padding: 2rem 0;
        text-align: center;
        color: #64748b;
        font-size: 1.1rem;
      }

      .error-text {
        color: #dc2626;
        margin-bottom: 1rem;
        padding: 1rem;
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 8px;
        font-weight: 500;
      }

      .empty-text {
        padding: 3rem 0;
        text-align: center;
        color: #64748b;
        font-size: 1.1rem;
      }

      .table-container {
        overflow-x: auto;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        background: white;
      }

      .content-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.95rem;
      }

      .table-header {
        background: linear-gradient(135deg, #f8fafc, #e2e8f0);
        border-bottom: 2px solid #cbd5e1;
      }

      .table-header th {
        padding: 1rem 0.75rem;
        text-align: left;
        font-weight: 600;
        color: #475569;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .table-row {
        border-bottom: 1px solid #f1f5f9;
        transition: all 0.2s ease;
      }

      .table-row:hover {
        background: linear-gradient(135deg, #f8fafc, #f1f5f9);
      }

      .table-row:last-child {
        border-bottom: none;
      }

      .table-cell {
        padding: 1rem 0.75rem;
        color: #334155;
        vertical-align: middle;
      }

      .title-cell {
        font-weight: 500;
        color: #1e293b;
      }

      .copy-count {
        font-weight: 600;
        color: #0f766e;
        background: #f0fdfa;
        padding: 0.25rem 0.5rem;
        border-radius: 6px;
        display: inline-block;
        min-width: 2rem;
        text-align: center;
      }

      .date-cell {
        color: #64748b;
        font-size: 0.9rem;
      }

      .action-buttons {
        display: flex;
        gap: 0.5rem;
      }

      .btn-detail {
        padding: 0.5rem 1rem;
        border: 2px solid #e2e8f0;
        background: white;
        color: #475569;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.9rem;
      }

      .btn-detail:hover {
        border-color: #667eea;
        color: #667eea;
        background: #f8fafc;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
      }

      .btn-delete {
        padding: 0.5rem 1rem;
        border: 2px solid #fecaca;
        background: #fef2f2;
        color: #dc2626;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.9rem;
      }

      .btn-delete:hover {
        border-color: #dc2626;
        background: #dc2626;
        color: white;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25);
      }

      .pagination-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 1.5rem;
        padding-top: 1rem;
        border-top: 1px solid #e2e8f0;
      }

      .pagination-info {
        font-size: 0.9rem;
        color: #64748b;
        font-weight: 500;
      }

      .pagination-buttons {
        display: flex;
        gap: 0.5rem;
      }

      .btn-page {
        padding: 0.5rem 1rem;
        border: 2px solid #e2e8f0;
        background: white;
        color: #475569;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.9rem;
      }

      .btn-page:hover:not(:disabled) {
        border-color: #667eea;
        color: #667eea;
        background: #f8fafc;
        transform: translateY(-1px);
      }

      .btn-page:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: #f8fafc;
        color: #94a3b8;
      }

      @media (max-width: 768px) {
        .postlist-modal {
          width: 95vw;
          padding: 1rem;
          max-height: 95vh;
        }

        .postlist-header {
          flex-direction: column;
          gap: 1rem;
          align-items: stretch;
        }

        .postlist-title {
          font-size: 1.5rem;
          text-align: center;
        }

        .table-header th {
          padding: 0.75rem 0.5rem;
          font-size: 0.8rem;
        }

        .table-cell {
          padding: 0.75rem 0.5rem;
          font-size: 0.9rem;
        }

        .action-buttons {
          flex-direction: column;
          gap: 0.25rem;
        }

        .btn-detail, .btn-delete {
          padding: 0.4rem 0.8rem;
          font-size: 0.8rem;
        }

        .pagination-container {
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }
      }
    `;
    document.head.appendChild(style);
  };

  useEffect(() => {
    injectStyles();
  }, []);

  const fetchList = async (p = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/mypage/posts/", { params: { page: p, page_size: pageSize } });
      setItems(res?.data?.data ?? []);
      setPagination(res?.data?.pagination ?? null);
    } catch (err) {
      const r = err?.response?.data;
      setError((typeof r === "string" && r) || r?.detail || "목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  return (
    <div className="postlist-overlay">
      <div className="postlist-modal">
        <div className="postlist-header">
          <h2 className="postlist-title">내 콘텐츠 목록</h2>
          <button 
            type="button" 
            className="btn-close" 
            onClick={onClose}
            style={{ outline: 'none' }}
          >
            X
          </button>
        </div>

        {loading && <p className="loading-text">불러오는 중...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && (
          <>
            {items.length === 0 ? (
              <p className="empty-text">생성한 콘텐츠가 없습니다.</p>
            ) : (
              <div className="table-container">
                <table className="content-table">
                  <thead className="table-header">
                    <tr>
                      <th>제목</th>
                      <th style={{ width: '7rem' }}>복사수</th>
                      <th style={{ width: '10rem' }}>생성일</th>
                      <th style={{ width: '10rem' }}>액션</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it) => (
                      <tr key={it.id} className="table-row">
                        <td className="table-cell title-cell">{it.title}</td>
                        <td className="table-cell">
                          <span className="copy-count">{it.copy_count}</span>
                        </td>
                        <td className="table-cell date-cell">
                          {new Date(it.created_at).toLocaleString()}
                        </td>
                        <td className="table-cell">
                          <div className="action-buttons">
                            <button
                              type="button"
                              className="btn-detail"
                              onClick={() => onPostClick?.(it)}
                              style={{ outline: 'none' }}
                            >
                              상세
                            </button>
                            <button
                              type="button"
                              className="btn-delete"
                              onClick={() => onDeletePost?.(it)}
                              style={{ outline: 'none' }}
                            >
                              삭제
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {pagination && pagination.total_pages > 1 && (
              <div className="pagination-container">
                <div className="pagination-info">
                  총 {pagination.total_items}개 / {pagination.current_page} / {pagination.total_pages}
                </div>
                <div className="pagination-buttons">
                  <button
                    type="button"
                    className="btn-page"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    style={{ outline: 'none' }}
                  >
                    이전
                  </button>
                  <button
                    type="button"
                    className="btn-page"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={pagination && page >= pagination.total_pages}
                    style={{ outline: 'none' }}
                  >
                    다음
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PostListModal;








