// src/pages/admin/Generated.js
import React, { useEffect, useState } from "react";
import { listGenerated, manageGenerated } from "../../api/admin";
import GeneratedDetailModal from "../../components/admin/GeneratedDetailModal";

const nf = (n) => Number(n || 0).toLocaleString();

function parseGeneratedList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  for (const v of Object.values(payload || {})) if (Array.isArray(v)) return v;
  return [];
}

export default function Generated() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [onlyActive, setOnlyActive] = useState(false);

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // CSS 스타일 주입 (Users.js와 동일한 팔레트/토큰 사용)
  useEffect(() => {
    const styleId = "generated-page-styles";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

      /* ===== Design Tokens (Users.js 기준) ===== */
      :root {
        --primary-start: #6366f1;
        --primary-end: #8b5cf6;
        --title-grad-start: #667eea;
        --title-grad-end: #764ba2;
        --accent: #ec4899;

        --bg-start: #f8fafc;
        --bg-mid: #e0f2fe;
        --bg-end: #e0e7ff;

        --text-primary: #111827;
        --text-secondary: #6b7280;
        --border: #e5e7eb;
        --border-outer: #f3f4f6;
      }

      .generated-page {
        font-family: 'Inter', sans-serif;
        background: linear-gradient(135deg, var(--bg-start) 0%, var(--bg-mid) 50%, var(--bg-end) 100%);
        min-height: 100vh;
      }

      .mono { font-family: 'JetBrains Mono', monospace; }

      .glass {
        backdrop-filter: blur(20px);
        background: rgba(255, 255, 255, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .gradient-text {
        background: linear-gradient(135deg, var(--title-grad-start) 0%, var(--title-grad-end) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .card-hover {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
      }
      .card-hover:hover {
        transform: translateY(-12px) scale(1.03);
        box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.25);
      }

      .slide-in { animation: slideIn 0.6s ease-out forwards; }
      @keyframes slideIn {
        from { opacity: 0; transform: translateY(40px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .fade-in { animation: fadeIn 0.4s ease-out forwards; }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

      .pulse-ring { animation: pulseRing 2.5s infinite; }
      @keyframes pulseRing {
        0% { transform: scale(0.33); opacity: 1; }
        80%, 100% { opacity: 0; transform: scale(1.2); }
      }

      .floating { animation: floating 4s ease-in-out infinite; }
      @keyframes floating {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        25% { transform: translateY(-8px) rotate(1deg); }
        50% { transform: translateY(-4px) rotate(0deg); }
        75% { transform: translateY(-12px) rotate(-1deg); }
      }

      .spin { animation: spin 1s linear infinite; }
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

      .btn-primary {
        background: linear-gradient(90deg, var(--primary-start), var(--primary-end));
        color: white; border: none; font-weight: 600;
        transition: all 0.3s ease;
      }
      .btn-primary:hover {
        background: linear-gradient(90deg, #4f46e5, #7c3aed);
        transform: translateY(-2px);
      }
      .btn-danger {
        background: linear-gradient(90deg, #ef4444, #dc2626);
        color: white; border: none; font-weight: 600;
        transition: all 0.3s ease;
      }
      .btn-danger:hover {
        background: linear-gradient(90deg, #dc2626, #b91c1c);
        transform: translateY(-2px);
      }

      .chip-info {
        background: rgba(99,102,241,0.1);
        color: var(--primary-start);
        border-radius: 12px;
        font-weight: bold;
        font-size: 16px;
        padding: 12px 20px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) existingStyle.remove();
    };
  }, []);

  // 데이터 로드
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const params = { page, page_size: pageSize };
        if (email.trim()) params.email = email.trim();
        if (title.trim()) params.title = title.trim();
        if (onlyActive) params.is_active = true;
        const payload = await listGenerated(params);
        if (!alive) return;
        setList(parseGeneratedList(payload));
      } catch (e) {
        if (!alive) return;
        console.error("[Generated] listGenerated error:", e);
        setError(e?.response?.data?.detail || e?.message || "목록을 불러오지 못했습니다.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [page, pageSize, email, title, onlyActive]);

  // 유틸
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const getStatusColor = (isActive) => {
    // 의미 색상 유지(공개=초록, 비공개=호박)
    return isActive !== false
      ? "linear-gradient(135deg, #10b981, #059669)"
      : "linear-gradient(135deg, #f59e0b, #d97706)";
  };
  const getStatusText = (isActive) => (isActive !== false ? "🟢 공개" : "🟡 비공개");
  const getThumbnail = (row) => row.image_1_url || row.image_2_url || row.image_3_url || null;

  // 액션
  function openDetailFor(id) {
    setSelectedId(id);
    setOpenDetail(true);
  }
  function handleHidden(id) {
    setList((prev) => prev.map((row) => (row.id === id ? { ...row, is_active: false } : row)));
  }
  function handleDeleted(id) {
    setList((prev) => prev.filter((row) => row.id !== id));
  }
  const handleQuickHide = async (id) => {
    try {
      await manageGenerated(id, { is_active: false });
      handleHidden(id);
    } catch (e) {
      console.error("[Generated] quick hide error:", e);
      alert(e?.response?.data?.detail || e?.message || "비공개 처리 실패");
    }
  };

  // 통계
  const totalItems = list.length;
  const activeItems = list.filter((item) => item.is_active !== false).length;
  const totalCopies = list.reduce((sum, item) => sum + (item.copy_count || 0), 0);

  return (
    <div className="generated-page" style={{ minHeight: "100vh" }}>
      {/* 🎨 헤더 섹션 (Users.js와 동일한 톤) */}
      <header style={{ position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(99, 102, 241, 0.1), rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1))",
          }}
        ></div>
        <div style={{ position: "relative", maxWidth: "1280px", margin: "0 auto", padding: "48px 24px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ position: "relative" }}>
                <div
                  className="floating"
                  style={{
                    width: "64px",
                    height: "64px",
                    background: "linear-gradient(135deg, var(--primary-start), var(--primary-end))",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "32px",
                    fontWeight: "bold",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  📝
                </div>
                <div
                  className="pulse-ring"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "64px",
                    height: "64px",
                    background: "linear-gradient(135deg, var(--primary-start), var(--primary-end))",
                    borderRadius: "16px",
                  }}
                ></div>
              </div>
            </div>
            <h1
              className="gradient-text"
              style={{
                fontSize: "48px",
                fontWeight: "900",
                marginBottom: "16px",
              }}
            >
              Generated Content
            </h1>
            <p style={{ fontSize: "20px", color: "var(--text-secondary)", fontWeight: "300" }}>
              까리한 생성 콘텐츠 관리 시스템
            </p>

            {/* 통계 카드: Primary / Accent 통일 */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "24px",
                marginTop: "32px",
                flexWrap: "wrap",
              }}
            >
              <div className="glass" style={{ borderRadius: "16px", padding: "16px 24px" }}>
                <div style={{ fontSize: "32px", fontWeight: "bold", color: "var(--primary-start)" }}>{nf(totalItems)}</div>
                <div style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: "500" }}>Total Content</div>
              </div>
              <div className="glass" style={{ borderRadius: "16px", padding: "16px 24px" }}>
                <div style={{ fontSize: "32px", fontWeight: "bold", color: "var(--primary-end)" }}>{nf(activeItems)}</div>
                <div style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: "500" }}>Active Items</div>
              </div>
              <div className="glass" style={{ borderRadius: "16px", padding: "16px 24px" }}>
                <div style={{ fontSize: "32px", fontWeight: "bold", color: "var(--accent)" }}>{nf(totalCopies)}</div>
                <div style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: "500" }}>Total Copies</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 🔍 필터 섹션 */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px 32px" }}>
        <div
          className="glass"
          style={{
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div style={{ marginBottom: "24px" }}>
            <h3
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              🔍 필터 & 검색
            </h3>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: window.innerWidth < 768 ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              alignItems: "end",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                📧 이메일 검색
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "2px solid var(--border)",
                  borderRadius: "12px",
                  fontSize: "16px",
                  outline: "none",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary-start)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                📄 제목 검색
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="콘텐츠 제목..."
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "2px solid var(--border)",
                  borderRadius: "12px",
                  fontSize: "16px",
                  outline: "none",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary-start)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "#374151",
                  cursor: "pointer",
                  padding: "12px 16px",
                  background: onlyActive ? "rgba(16, 185, 129, 0.1)" : "rgba(255, 255, 255, 0.8)",
                  border: `2px solid ${onlyActive ? "#10b981" : "var(--border)"}`,
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                }}
              >
                <input
                  type="checkbox"
                  checked={onlyActive}
                  onChange={(e) => setOnlyActive(e.target.checked)}
                  style={{ width: "18px", height: "18px", accentColor: "#10b981" }}
                />
                🟢 활성만 보기
              </label>

              <button
                onClick={() => setPage(1)}
                className="btn-primary"
                style={{
                  padding: "12px 24px",
                  borderRadius: "12px",
                  whiteSpace: "nowrap",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
              >
                🔍 검색 적용
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 📝 콘텐츠 그리드 */}
      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px 48px" }}>
        {error && (
          <div
            className="fade-in"
            style={{
              padding: "24px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "2px solid rgba(239, 68, 68, 0.2)",
              borderRadius: "16px",
              color: "#dc2626",
              marginBottom: "32px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "32px" }}>⚠️</span>
              <div>
                <div style={{ fontWeight: "bold", marginBottom: "4px" }}>오류가 발생했습니다</div>
                <div>{error}</div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "16px", color: "var(--text-secondary)" }}>
              <div
                className="spin"
                style={{
                  width: "40px",
                  height: "40px",
                  border: "4px solid var(--border-outer)",
                  borderTop: "4px solid var(--primary-start)",
                  borderRadius: "50%",
                }}
              ></div>
              <span style={{ fontSize: "20px", fontWeight: "500" }}>까리한 콘텐츠들을 불러오는 중...</span>
            </div>
          </div>
        ) : list.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <div style={{ fontSize: "128px", marginBottom: "24px" }}>📝</div>
            <h3 style={{ fontSize: "32px", fontWeight: "bold", color: "var(--text-primary)", marginBottom: "16px" }}>
              콘텐츠가 없습니다
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "18px" }}>
              {email || title || onlyActive ? "검색 조건을 변경해보세요." : "아직 생성된 콘텐츠가 없어요."}
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
              gap: "32px",
            }}
          >
            {list.map((row, idx) => {
              const id = row.id ?? idx;
              const thumb = getThumbnail(row);
              const itemNumber = idx + 1 + (page - 1) * pageSize;

              return (
                <div
                  key={id}
                  className="card-hover slide-in"
                  style={{
                    background: "white",
                    borderRadius: "24px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    border: "1px solid var(--border-outer)",
                    overflow: "hidden",
                    animationDelay: `${idx * 0.1}s`,
                  }}
                >
                  {/* 카드 헤더 */}
                  <div
                    style={{
                      position: "relative",
                      height: "200px",
                      background: thumb
                        ? `url(${thumb})`
                        : "linear-gradient(135deg, rgba(99, 102, 241, 0.6), rgba(139, 92, 246, 0.6))",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {!thumb && (
                      <div
                        style={{
                          color: "white",
                          fontSize: "64px",
                          textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                        }}
                      >
                        📝
                      </div>
                    )}

                    {/* 순번 배지 */}
                    <div
                      style={{
                        position: "absolute",
                        top: "16px",
                        left: "16px",
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "rgba(0, 0, 0, 0.7)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                    >
                      {itemNumber}
                    </div>

                    {/* 상태 배지 */}
                    <div
                      style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        padding: "6px 12px",
                        background: getStatusColor(row.is_active),
                        color: "white",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      {getStatusText(row.is_active)}
                    </div>
                  </div>

                  {/* 카드 바디 */}
                  <div style={{ padding: "24px" }}>
                    <h3
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "var(--text-primary)",
                        marginBottom: "12px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.title || "(제목 없음)"}
                    </h3>

                    <div style={{ marginBottom: "20px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "8px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        <span style={{ fontSize: "16px" }}>📅</span>
                        <span style={{ fontSize: "14px", fontWeight: "500" }}>{formatDate(row.created_at)}</span>
                      </div>

                      {typeof row.copy_count !== "undefined" && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            color: "var(--text-secondary)",
                          }}
                        >
                          <span style={{ fontSize: "16px" }}>📋</span>
                          <span style={{ fontSize: "14px", fontWeight: "500" }}>복사 {nf(row.copy_count)}회</span>
                        </div>
                      )}
                    </div>

                    {/* 액션 버튼들 */}
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => openDetailFor(id)}
                        className="btn-primary"
                        style={{
                          flex: 1,
                          padding: "12px",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                        }}
                      >
                        👁️ 상세
                      </button>

                      <button
                        onClick={() => handleQuickHide(id)}
                        className="btn-primary"
                        style={{
                          padding: "12px",
                          borderRadius: "12px",
                        }}
                        title="비공개 처리"
                      >
                        🔒
                      </button>

                      <button
                        onClick={() => openDetailFor(id)}
                        className="btn-danger"
                        style={{
                          padding: "12px",
                          borderRadius: "12px",
                        }}
                        title="삭제(모달에서 확인)"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 🔄 페이지네이션 */}
        {list.length > 0 && (
          <div
            className="glass"
            style={{
              marginTop: "48px",
              borderRadius: "20px",
              padding: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="btn-primary"
                style={{
                  padding: "12px 20px",
                  borderRadius: "12px",
                  cursor: page <= 1 ? "not-allowed" : "pointer",
                  opacity: page <= 1 ? 0.6 : 1,
                }}
              >
                ← 이전
              </button>

              <div className="chip-info">페이지 {page}</div>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={list.length < pageSize}
                className="btn-primary"
                style={{
                  padding: "12px 20px",
                  borderRadius: "12px",
                  cursor: list.length < pageSize ? "not-allowed" : "pointer",
                  opacity: list.length < pageSize ? 0.6 : 1,
                }}
              >
                다음 →
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: "500" }}>페이지 크기</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                style={{
                  padding: "8px 12px",
                  background: "white",
                  border: "2px solid var(--border)",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: "500",
                  outline: "none",
                  cursor: "pointer",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary-start)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              >
                {[10, 20, 30, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}개씩
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </main>

      {/* 🎭 상세 모달 */}
      <GeneratedDetailModal
        open={openDetail}
        postId={selectedId}
        onClose={() => setOpenDetail(false)}
        onHidden={handleHidden}
        onDeleted={handleDeleted}
      />
    </div>
  );
}
