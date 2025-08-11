// src/pages/admin/Keywords.js
import React from "react";
import { fetchAdminKeywords } from "../../api/admin";
import KeywordDetailModal from "../../components/admin/KeywordDetailModal";
import ClovaPreviewModal from "../../components/admin/ClovaPreviewModal";

const nf = (n) => Number(n || 0).toLocaleString();

export default function Keywords() {
  const [list, setList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const [q, setQ] = React.useState("");
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);

  // ✅ 빠져있던 페이징 상태 복구
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);

  // 모달 제어 (부모가 책임)
  const [openDetail, setOpenDetail] = React.useState(false);
  const [openPreview, setOpenPreview] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(null);

  // CSS 주입 함수
  const injectStyles = () => {
    const styleId = 'keywords-admin-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .keywords-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        position: relative;
        overflow-x: hidden;
      }

      .keywords-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background:
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
        pointer-events: none;
      }

      .keywords-header {
        max-width: 1280px;
        margin: 0 auto;
        padding: 2rem 1rem;
        position: relative;
        z-index: 1;
      }

      .keywords-title {
        font-size: 3rem;
        font-weight: 800;
        background: linear-gradient(135deg, #ffffff, #f0f9ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-align: center;
        margin-bottom: 1rem;
        text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        letter-spacing: -0.02em;
      }

      .keywords-subtitle {
        color: rgba(255, 255, 255, 0.9);
        text-align: center;
        font-size: 1.1rem;
        font-weight: 300;
        line-height: 1.6;
      }

      .keywords-search-section {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 1rem;
        position: relative;
        z-index: 1;
      }

      .keywords-search-card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 24px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 2rem;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        margin-bottom: 2rem;
      }

      .keywords-search-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .keywords-search-row {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .keywords-search-input-group {
        flex: 1;
      }

      .keywords-search-label {
        display: block;
        font-size: 0.9rem;
        font-weight: 600;
        color: #374151;
        margin-bottom: 0.5rem;
      }

      .keywords-search-input {
        width: 100%;
        padding: 0.875rem 1.25rem;
        border: 2px solid #e5e7eb;
        border-radius: 16px;
        font-size: 1rem;
        transition: all 0.3s ease;
        background: white;
      }

      .keywords-search-input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        transform: translateY(-1px);
      }

      .keywords-search-controls {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
      }

      .keywords-search-select {
        padding: 0.875rem 1.25rem;
        border: 2px solid #e5e7eb;
        border-radius: 16px;
        font-size: 1rem;
        background: white;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .keywords-search-select:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .keywords-search-button {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        padding: 0.875rem 2rem;
        border-radius: 16px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .keywords-search-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
      }

      .keywords-main {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 1rem 3rem;
        position: relative;
        z-index: 1;
      }

      .keywords-error {
        background: linear-gradient(135deg, #fef2f2, #fee2e2);
        border: 2px solid #fecaca;
        color: #dc2626;
        padding: 1rem 1.5rem;
        border-radius: 16px;
        margin-bottom: 1.5rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .keywords-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5rem 0;
        color: white;
      }

      .keywords-loading-spinner {
        width: 32px;
        height: 32px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-top: 3px solid white;
        border-radius: 50%;
        animation: keywordsSpinAnimation 1s linear infinite;
        margin-right: 1rem;
      }

      @keyframes keywordsSpinAnimation {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .keywords-empty {
        text-align: center;
        padding: 5rem 0;
        color: white;
      }

      .keywords-empty-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        display: block;
      }

      .keywords-empty-text {
        font-size: 1.2rem;
        font-weight: 500;
      }

      .keywords-grid {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      }

      .keywords-card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 1.5rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .keywords-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #667eea, #764ba2);
      }

      .keywords-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      }

      .keywords-card-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .keywords-card-content {
        min-width: 0;
        flex: 1;
      }

      .keywords-card-title {
        font-size: 1.1rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 0.5rem;
        word-break: break-word;
        line-height: 1.4;
      }

      .keywords-card-meta {
        font-size: 0.9rem;
        color: #6b7280;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .keywords-card-id {
        background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
        color: #374151;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
      }

      .keywords-card-category {
        background: linear-gradient(135deg, #ddd6fe, #c4b5fd);
        color: #5b21b6;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
      }

      .keywords-card-actions {
        display: flex;
        gap: 0.75rem;
      }

      .keywords-card-button {
        flex: 1;
        padding: 0.75rem 1rem;
        border: none;
        border-radius: 12px;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }

      .keywords-card-button-detail {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
      }

      .keywords-card-button-detail:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
      }

      .keywords-card-button-preview {
        background: linear-gradient(135deg, #ec4899, #be185d);
        color: white;
      }

      .keywords-card-button-preview:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(236, 72, 153, 0.4);
      }

      .keywords-pagination {
        margin-top: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 2rem 0;
      }

      .keywords-pagination-button {
        padding: 0.875rem 1.5rem;
        border: none;
        border-radius: 16px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .keywords-pagination-button-active {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
      }

      .keywords-pagination-button-active:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
      }

      .keywords-pagination-button-disabled {
        background: rgba(255, 255, 255, 0.7);
        color: #9ca3af;
        cursor: not-allowed;
      }

      .keywords-pagination-current {
        background: rgba(255, 255, 255, 0.95);
        color: #667eea;
        padding: 0.875rem 1.5rem;
        border-radius: 16px;
        font-weight: 700;
        border: 2px solid #667eea;
      }

      @media (max-width: 768px) {
        .keywords-title {
          font-size: 2rem;
        }

        .keywords-search-card {
          padding: 1.5rem;
        }

        .keywords-search-row {
          flex-direction: column;
        }

        .keywords-search-controls {
          flex-direction: column;
          align-items: stretch;
        }

        .keywords-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .keywords-card {
          padding: 1.25rem;
        }

        .keywords-card-actions {
          flex-direction: column;
        }

        .keywords-pagination {
          flex-direction: column;
          gap: 0.75rem;
        }

        .keywords-pagination-button,
        .keywords-pagination-current {
          width: 100%;
          justify-content: center;
        }
      }

      @media (min-width: 768px) {
        .keywords-search-row {
          flex-direction: row;
          align-items: end;
        }
      }
    `;
    document.head.appendChild(style);
  };

  React.useLayoutEffect(() => {
    injectStyles(); // 첫 페인트 전에 스타일 붙이기
    return () => {
      const el = document.getElementById('keywords-admin-styles');
      if (el) el.remove(); // 라우트 이탈 시 깔끔 제거
    };
  }, []);

  const load = React.useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const payload = await fetchAdminKeywords({
        search: q || undefined,
        page,
        page_size: pageSize,
        sort: "created_desc",
      });
      const items = Array.isArray(payload?.data) ? payload.data : [];
      setList(items);
      setTotalPages(Number(payload?.pagination?.total_pages ?? 1));
      setTotalItems(Number(payload?.pagination?.total_items ?? items.length));
    } catch (e) {
      console.error("[Keywords] fetchAdminKeywords error:", e);
      setError(e?.response?.data?.detail || e?.message || "목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [q, page, pageSize]);

  React.useEffect(() => {
    load();
  }, [load]);

  const openDetailFor = (id) => {
    setSelectedId(id);
    setOpenDetail(true);
  };

  const openPreviewFor = (id) => {
    setSelectedId(id);
    setOpenPreview(true);
  };

  const handleSearch = () => {
    setPage(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div
      className="keywords-container"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* 헤더 */}
      <header className="keywords-header">
        <h1 className="keywords-title">🔑 Keywords Admin</h1>
        <p className="keywords-subtitle">
          관리자 전용 전체 키워드 목록 — 총 {nf(totalItems)}건
        </p>
      </header>

      {/* 검색/필터 */}
      <section className="keywords-search-section">
        <div className="keywords-search-card">
          <div className="keywords-search-form">
            <div className="keywords-search-row">
              <div className="keywords-search-input-group">
                <label className="keywords-search-label">🔍 키워드 검색</label>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="keywords-search-input"
                  placeholder="제목/카테고리 검색..."
                />
              </div>
              <div className="keywords-search-controls">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="keywords-search-select"
                >
                  {[10, 20, 30, 50].map((n) => (
                    <option key={n} value={n}>
                      {n}개씩 보기
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleSearch}
                  className="keywords-search-button"
                >
                  🔍 검색하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 목록 */}
      <main className="keywords-main">
        {error && (
          <div className="keywords-error">❌ {error}</div>
        )}

        {loading ? (
          <div className="keywords-loading">
            <div className="keywords-loading-spinner"></div>
            <span>키워드 목록을 불러오는 중...</span>
          </div>
        ) : list.length === 0 ? (
          <div className="keywords-empty">
            <span className="keywords-empty-icon">🔍</span>
            <div className="keywords-empty-text">조건에 맞는 키워드가 없습니다</div>
          </div>
        ) : (
          <div className="keywords-grid">
            {list.map((row, idx) => (
              <div key={row.id ?? idx} className="keywords-card">
                <div className="keywords-card-header">
                  <div className="keywords-card-content">
                    <div className="keywords-card-title">
                      {row.title || "(제목 없음)"}
                    </div>
                    <div className="keywords-card-meta">
                      <span className="keywords-card-id">ID {row.id}</span>
                      {row.category && (
                        <span className="keywords-card-category">{row.category}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="keywords-card-actions">
                  <button
                    onClick={() => openDetailFor(row.id)}
                    className="keywords-card-button keywords-card-button-detail"
                  >
                    📋 상세조회
                  </button>
                  <button
                    onClick={() => openPreviewFor(row.id)}
                    className="keywords-card-button keywords-card-button-preview"
                  >
                    👁️ Clova 미리보기
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        {totalItems > 0 && (
          <div className="keywords-pagination">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className={`keywords-pagination-button ${
                page <= 1
                  ? 'keywords-pagination-button-disabled'
                  : 'keywords-pagination-button-active'
              }`}
            >
              ← 이전 페이지
            </button>
            <div className="keywords-pagination-current">
              페이지 {nf(page)} / {nf(totalPages)}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className={`keywords-pagination-button ${
                page >= totalPages
                  ? 'keywords-pagination-button-disabled'
                  : 'keywords-pagination-button-active'
              }`}
            >
              다음 페이지 →
            </button>
          </div>
        )}
      </main>

      {/* 모달들: 부모가 열고 닫음 */}
      <KeywordDetailModal
        open={openDetail}
        keywordId={selectedId}
        onClose={() => setOpenDetail(false)}
      />
      <ClovaPreviewModal
        open={openPreview}
        keywordId={selectedId}
        onClose={() => setOpenPreview(false)}
      />
    </div>
  );
}
