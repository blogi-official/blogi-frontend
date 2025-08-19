import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { updatePostStatus } from '../api/posts';
import logo from "../assets/bloigi-logo.png"; 


// 분리해둔 훅과 드로어 컴포넌트
import useGenerateFlow from "../hooks/useGenerateFlow";
import GenerateResultDrawer from "../components/GenerateResultDrawer";


// CSS 강제 주입 
const injectStyles = () => {
  if (document.getElementById('home-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'home-styles';
  style.textContent = `
    /* 기본 리셋 */
    * {
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      color: #1e293b;
      line-height: 1.6;
      min-height: 100vh;
    }
    
    /* 마법같은 배경 애니메이션 */
    body::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(240, 147, 251, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 40% 40%, rgba(118, 75, 162, 0.1) 0%, transparent 50%);
      animation: bg-shift 15s ease-in-out infinite;
      pointer-events: none;
      z-index: -1;
    }
    
    @keyframes bg-shift {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.1); }
    }
    
    /* 컨테이너 */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    /* 헤더 - 완전히 새로운 마법 */
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      padding: 4rem 0;
      text-align: center;
      color: white;
      margin-bottom: 3rem;
      position: relative;
      overflow: hidden;
    }
    
    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 20% 80%, rgba(255,255,255,0.15) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%);
      animation: pulse-bg 4s ease-in-out infinite;
    }
    
    .header::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: conic-gradient(from 0deg, transparent, rgba(255,255,255,0.05), transparent);
      animation: rotate 20s linear infinite;
    }
    
    @keyframes pulse-bg {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    
    @keyframes rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .floating-elements {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
    }
    
    .floating-element {
      position: absolute;
      background: rgba(255,255,255,0.15);
      border-radius: 50%;
      animation: float-up 8s ease-in-out infinite;
    }
    
    .floating-element:nth-child(1) {
      width: 60px;
      height: 60px;
      top: 80%;
      left: 10%;
      animation-delay: 0s;
    }
    
    .floating-element:nth-child(2) {
      width: 40px;
      height: 40px;
      top: 60%;
      right: 15%;
      animation-delay: 2s;
    }
    
    .floating-element:nth-child(3) {
      width: 80px;
      height: 80px;
      top: 70%;
      left: 70%;
      animation-delay: 4s;
    }
    
    .floating-element:nth-child(4) {
      width: 30px;
      height: 30px;
      top: 40%;
      left: 20%;
      animation-delay: 6s;
    }
    
    @keyframes float-up {
      0%, 100% { 
        transform: translateY(0px) rotate(0deg);
        opacity: 0.3;
      }
      50% { 
        transform: translateY(-20px) rotate(180deg);
        opacity: 0.8;
      }
    }
    
    .header-content {
      position: relative;
      z-index: 2;
    }
    
    .header h1 {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      text-shadow: 0 4px 8px rgba(0,0,0,0.2);
      background: linear-gradient(45deg, #ffffff, #f0f4ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: text-glow 3s ease-in-out infinite;
    }
    
    @keyframes text-glow {
      0%, 100% { filter: drop-shadow(0 0 5px rgba(255,255,255,0.5)); }
      50% { filter: drop-shadow(0 0 20px rgba(255,255,255,0.8)); }
    }
    
    @media (min-width: 768px) {
      .header h1 {
        font-size: 3.5rem;
      }
    }
    
    .header p {
      font-size: 1.2rem;
      opacity: 0.95;
      max-width: 600px;
      margin: 0 auto;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    /* 메인 레이아웃 */
    .main-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      margin-bottom: 3rem;
    }
    
    @media (min-width: 1024px) {
      .main-layout {
        grid-template-columns: 1fr 320px;
      }
    }
    
    /* 키워드 그리드 */
    .keywords-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    
    @media (min-width: 640px) {
      .keywords-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (min-width: 1024px) {
      .keywords-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    /* 키워드 카드 - 완전히 새로운 마법 효과 */
    .keyword-card {
      background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
      border-radius: 24px;
      padding: 2.5rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 
                  0 4px 16px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(255,255,255,0.8);
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      height: 100%;
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(10px);
    }
    
    .keyword-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 5px;
      background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
      transform: scaleX(0);
      transition: transform 0.4s ease;
      border-radius: 24px 24px 0 0;
    }
    
    .keyword-card::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: conic-gradient(from 0deg, transparent, rgba(102, 126, 234, 0.08), transparent);
      opacity: 0;
      transition: opacity 0.4s ease;
      animation: card-rotate 12s linear infinite;
    }
    
    @keyframes card-rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .keyword-card:hover {
      transform: translateY(-16px) scale(1.03);
      box-shadow: 0 32px 64px rgba(102, 126, 234, 0.25),
                  0 16px 32px rgba(118, 75, 162, 0.15),
                  0 0 0 1px rgba(102, 126, 234, 0.1);
      border-color: transparent;
      background: linear-gradient(145deg, #ffffff 0%, #f0f4ff 100%);
    }
    
    .keyword-card:hover::before {
      transform: scaleX(1);
    }
    
    .keyword-card:hover::after {
      opacity: 1;
    }
    
    .keyword-card:active {
      transform: translateY(-12px) scale(0.98);
    }
    
    .keyword-title {
      font-size: 1.4rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 1.5rem;
      line-height: 1.3;
      position: relative;
      z-index: 2;
    }
    
    .keyword-category {
      display: inline-flex;
      align-items: center;
      background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 30px;
      font-size: 0.875rem;
      font-weight: 600;
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
      position: relative;
      z-index: 2;
      transition: all 0.3s ease;
    }
    
    .keyword-category::before {
      content: '🏷️';
      margin-right: 0.5rem;
      font-size: 1rem;
    }
    
    .keyword-card:hover .keyword-category {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    .generate-cache-badge { 
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 0.5rem;
      font-size: 0.75rem; 
      color: #4338ca; 
      background: rgba(99,102,241,0.1); 
      border: 1px solid rgba(99,102,241,0.3); 
      padding: 0.25rem 0.55rem; 
      border-radius: 999px; 
      font-weight: 600; 
    }
    
    /* 사이드바 - 글래스모피즘 효과 */
    .sidebar {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 2.5rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255,255,255,0.8);
      height: fit-content;
      position: sticky;
      top: 2rem;
    }
    
    .sidebar-title {
      font-size: 1.4rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 3px solid transparent; 
      border-image: linear-gradient(90deg,rgb(237, 239, 245),rgb(243, 241, 245)) 1;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .sort-section {
      margin-bottom: 2.5rem;
    }
    
    .sort-label {
      display: block;
      font-weight: 600;
      color: #374151;
      margin-bottom: 1rem;
      font-size: 1rem;
    }
    
    .sort-select {
      width: 100%;
      padding: 1rem 1.25rem;
      border: 2px solid #e2e8f0;
      border-radius: 16px;
      font-size: 0.95rem;
      background: rgba(255,255,255,0.9);
      backdrop-filter: blur(10px);
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
    }
    
    .sort-select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
      background: white;
    }
    
    .sort-select:hover {
      border-color: #cbd5e1;
      background: white;
    }
    
    /* 페이지네이션 - 더 세련되게 */
    .pagination-section {
      margin-top: 2rem;
    }
    
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }
    
    .pagination-btn {
      padding: 1rem 1.25rem;
      border: 2px solid #e2e8f0;
      background: rgba(255,255,255,0.9);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      min-width: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .pagination-btn:hover:not(:disabled) {
      border-color: #667eea;
      color: #667eea;
      background: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
    }
    
    .pagination-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    
    .current-page {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border-color: transparent;
      font-weight: 700;
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
    }
    
    .current-page:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
    
    /* 로딩 상태 - 더 매력적으로 */
    .loading {
      text-align: center;
      padding: 5rem 2rem;
      color: #64748b;
    }
    
    .loading-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      animation: loading-bounce 2s ease-in-out infinite;
    }
    
    @keyframes loading-bounce {
      0%, 100% { 
        transform: translateY(0px) scale(1);
        opacity: 1;
      }
      50% { 
        transform: translateY(-20px) scale(1.1);
        opacity: 0.7;
      }
    }
    
    .loading-text {
      font-size: 1.2rem;
      font-weight: 600;
      background: linear-gradient(45deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    /* 빈 상태 - 더 친근하게 */
    .empty-state {
      text-align: center;
      padding: 5rem 2rem;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255,255,255,0.8);
    }
    
    .empty-icon {
      font-size: 5rem;
      margin-bottom: 1.5rem;
      opacity: 0.8;
      animation: empty-float 3s ease-in-out infinite;
    }
    
    @keyframes empty-float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    
    .empty-title {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: #374151;
    }
    
    .empty-desc {
      color: #64748b;
      font-size: 1.1rem;
    }
    
    /* 반응형 */
    @media (max-width: 1023px) {
      .sidebar {
        position: static;
        order: -1;
      }
      
      .main-layout {
        gap: 2rem;
      }
    }
    
    @media (max-width: 639px) {
      .header {
        padding: 3rem 0;
      }
      
      .header h1 {
        font-size: 2.2rem;
      }
      
      .header p {
        font-size: 1rem;
      }
      
      .keyword-card {
        padding: 2rem;
      }
      
      .sidebar {
        padding: 2rem;
      }
    }
  `;
  
  document.head.appendChild(style);
};

// Sidebar 컴포넌트 (변경 없음)
const Sidebar = ({ sortBy, setSortBy, page, setPage, totalPages }) => {
  return (
    <div className="sidebar">
      <h3 className="sidebar-title">
        <span>🎯</span>
        필터 & 정렬
      </h3>

      <div className="sort-section">
        <label htmlFor="sort-select" className="sort-label">
          📊 정렬 기준
        </label>
        <select
          id="sort-select"
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="latest">🕐 최신순</option>
          <option value="popular">🔥 인기순</option>
          <option value="trending">📈 트렌딩</option>
        </select>
      </div>

      {totalPages > 1 && (
        <div className="pagination-section">
          <label className="sort-label">📄 페이지</label>
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
            >
              ←
            </button>
            <span className="pagination-btn current-page">
              {page} / {totalPages}
            </span>
            <button
              className="pagination-btn"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// 메인 Home 컴포넌트
function Home() {
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("latest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error] = useState("");

  // ★ 추가: 생성/상세/복사/PDF은 훅이 담당, Home은 호출만
  const {
    generatingId,     // 현재 생성 중인 keyword id (UI 비활성화 용)
    detail,           // 상세 데이터
    fromCache,        // 캐시여부 뱃지
    loadingDetail,    // 상세 로딩 상태
    downloadingPdf,   // PDF 로딩 상태
    open,             // 드로어 열림
    error: flowError, // 훅 내부 에러 메시지
    generateByKeyword,
    copyCurrent,
    downloadPdf,
    close,

  } = useGenerateFlow();

  useEffect(() => {
    injectStyles();
  }, []);

  useEffect(() => {
    const fetchKeywords = async () => {
      setLoading(true);
      try {
        // 🔁 백엔드 호환: trending은 popular로 매핑
        const safeSort = sortBy === "trending" ? "popular" : sortBy;

        const response = await api.get("/keywords/", {
          params: { sort: safeSort, page, page_size: 12 },
        });

        let dataList = response.data.data || response.data.results || [];

        // localStorage 반영
        //const storedIds = JSON.parse(localStorage.getItem("generatedKeywords") || "[]");
        dataList = dataList.map(k => ({
          ...k,
          is_generated: k.is_generated
        }));

        setKeywords(dataList);

        if (response.data.pagination) {
          setTotalPages(response.data.pagination.total_pages || 1);
        }
      } catch (err) {
        console.error("키워드 불러오기 실패", err);
      } finally {
        setLoading(false);
      }
    };

    fetchKeywords();
  }, [sortBy, page]);

  // ✅ 최소 수정: 클릭 시 훅 호출 + UI 반영
  const handleKeywordClick = async (clickedKeyword) => {
    // 로그인 체크는 훅 내부에서 처리
    const postId = await generateByKeyword(clickedKeyword);
    if (!postId) return;

    // 서버에도 PATCH 요청: 생성 상태 true 업데이트
    try {
      await updatePostStatus(postId);
    } catch (err) {
      console.error("상태 업데이트 실패", err);
    }

    // UI에 바로 반영: 클릭한 키워드 is_generated true
    setKeywords((prev) =>
      prev.map((k) =>
        k.id === clickedKeyword.id ? { ...k, is_generated: true } : k
      )
    );

    // localStorage에 저장
    const storedIds = JSON.parse(localStorage.getItem("generatedKeywords") || "[]");
    if (!storedIds.includes(clickedKeyword.id)) {
      storedIds.push(clickedKeyword.id);
      localStorage.setItem("generatedKeywords", JSON.stringify(storedIds));
    }
  };

  return (
    <>
      {/* 헤더 (기존 유지) */}
      <header className="header bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4">
        <div className="header-content">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3">
              {/* 로고 */}
              <img
                src={logo}
                alt="Blogi Logo"
                style={{ width: "300px", height: "auto" }} // 👈 px 단위로 강제
                className="drop-shadow-md"
              />
              {/* 타이틀 */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Blogi 추천 키워드
                </h1>
                <p className="text-sm sm:text-base text-gray-100 mt-1">
                  관심사 기반으로 맞춤 키워드를 추천해드려요
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="container">
        <div className="main-layout">
          {/* 키워드 섹션 */}
          <div>
            {loading ? (
              <div className="loading">
                <div className="loading-icon">⏳</div>
                <p className="loading-text">키워드를 불러오는 중...</p>
              </div>
            ) : keywords.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3 className="empty-title">키워드가 없습니다</h3>
                <p className="empty-desc">관심사를 먼저 설정해주세요.</p>
              </div>
            ) : (
              <div className="keywords-grid">
                {keywords.map((keyword) => {
                  const disabled = !!generatingId;
                  const isThisGenerating = generatingId === keyword.id;
                  return (
                    <div
                      key={keyword.id}
                      className="keyword-card"
                      onClick={() => !disabled && handleKeywordClick(keyword)}
                      style={disabled ? { pointerEvents: "none", opacity: 0.6 } : {}}
                    >
                      <h3 className="keyword-title">{keyword.title}</h3>
                      <div className="keyword-category">{keyword.category}</div> 
                      {keyword.is_generated && (
                        <div className="generate-cache-badge">⚡ 생성 완료</div>
                      )}
                      {isThisGenerating && (
                        <div style={{ position: "absolute", right: 16, top: 16, fontSize: 18 }}>
                          ⏳
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {(error || flowError) && (
              <div style={{ marginTop: 16, color: "#dc2626", fontWeight: 600 }}>
                {flowError || error}
              </div>
            )}
          </div>

          {/* 사이드바 */}
          <Sidebar
            sortBy={sortBy}
            setSortBy={setSortBy}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </div>
      </div>

      {/* ★ 추가: 생성 결과 드로어 (컴포넌트 분리) */}
      <GenerateResultDrawer
        open={open}
        loading={loadingDetail}
        detail={detail}
        fromCache={fromCache}
        onCopy={copyCurrent}
        onDownloadPdf={downloadPdf}
        onClose={close}
        downloadingPdf={downloadingPdf}
      />
    </>
  );
}

export default Home;
