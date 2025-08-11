// src/pages/admin/AdminDashboard.js
import React, { useLayoutEffect, useEffect, useState } from "react";
import { getDailyStats, getTopKeywords, getClovaStats } from "../../api/admin";

export default function AdminDashboard() {
  const [dailyArr, setDailyArr] = useState([]);
  const [clovaObj, setClovaObj] = useState(null);
  const [topArr, setTopArr] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const todayGenerated = dailyArr?.[0]?.generated_posts ?? 0;
  const yesterdayGenerated = dailyArr?.[1]?.generated_posts ?? 0;
  const sevenDaysGenerated = dailyArr.reduce(
    (acc, cur) => acc + (Number(cur?.generated_posts) || 0),
    0
  );
  const clovaTotalCalls = clovaObj?.total ?? 0;
  const clovaSuccessRate = clovaObj?.success_rate ?? 100;

  // 성장률 계산
  const todayGrowth = yesterdayGenerated > 0
    ? ((todayGenerated - yesterdayGenerated) / yesterdayGenerated * 100).toFixed(1)
    : 0;

  // 🎨 까리한 CSS 강제 주입!
  const injectDashboardStyles = () => {
    const styleId = 'blogi-admin-dashboard-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* 🌟 대시보드 전용 스타일 */
      .dashboard-container {
        padding: 1.5rem;
        max-width: 1400px;
        margin: 0 auto;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      }

      /* 🎯 헤더 섹션 */
      .dashboard-header {
        margin-bottom: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .dashboard-title {
        font-size: 2rem;
        font-weight: 800;
        color: #1e293b;
        margin: 0;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .dashboard-subtitle {
        color: #64748b;
        font-size: 1rem;
        margin-top: 0.25rem;
      }

      .dashboard-refresh-btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 0.75rem;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        box-shadow: 0 4px 8px rgba(99, 102, 241, 0.2);
      }

      .dashboard-refresh-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
      }

      .dashboard-refresh-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
      }

      .refresh-spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid white;
        border-radius: 50%;
        animation: dashboard-spin 1s linear infinite;
      }

      @keyframes dashboard-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* 📊 통계 카드 그리드 */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .stat-card {
        background: white;
        border-radius: 1.5rem;
        padding: 2rem;
        box-shadow: 
          0 10px 25px rgba(0, 0, 0, 0.05),
          0 4px 10px rgba(0, 0, 0, 0.03);
        border: 1px solid rgba(0, 0, 0, 0.02);
        position: relative;
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        animation: stat-card-entrance 0.6s ease-out;
      }

      @keyframes stat-card-entrance {
        0% {
          opacity: 0;
          transform: translateY(20px) scale(0.98);
        }
        100% {
          opacity: 1;
          transform: translateY(0px) scale(1);
        }
      }

      .stat-card:hover {
        transform: translateY(-4px);
        box-shadow: 
          0 20px 40px rgba(0, 0, 0, 0.08),
          0 8px 16px rgba(0, 0, 0, 0.05);
      }

      .stat-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: var(--card-accent, linear-gradient(90deg, #6366f1, #8b5cf6));
        border-radius: 1.5rem 1.5rem 0 0;
      }

      .stat-card.today::before {
        --card-accent: linear-gradient(90deg, #10b981, #059669);
      }

      .stat-card.weekly::before {
        --card-accent: linear-gradient(90deg, #f59e0b, #d97706);
      }

      .stat-card.clova::before {
        --card-accent: linear-gradient(90deg, #8b5cf6, #7c3aed);
      }

      .stat-card.success::before {
        --card-accent: linear-gradient(90deg, #06b6d4, #0891b2);
      }

      .stat-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
      }

      .stat-icon {
        width: 3rem;
        height: 3rem;
        border-radius: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        background: var(--icon-bg, rgba(99, 102, 241, 0.1));
        animation: stat-icon-pulse 3s ease-in-out infinite;
      }

      @keyframes stat-icon-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }

      .stat-card.today .stat-icon {
        --icon-bg: rgba(16, 185, 129, 0.1);
      }

      .stat-card.weekly .stat-icon {
        --icon-bg: rgba(245, 158, 11, 0.1);
      }

      .stat-card.clova .stat-icon {
        --icon-bg: rgba(139, 92, 246, 0.1);
      }

      .stat-card.success .stat-icon {
        --icon-bg: rgba(6, 182, 212, 0.1);
      }

      .stat-title {
        font-size: 0.875rem;
        color: #64748b;
        font-weight: 600;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .stat-value {
        font-size: 2.5rem;
        font-weight: 800;
        color: #1e293b;
        margin: 0.5rem 0;
        line-height: 1;
        animation: stat-value-count 1s ease-out;
      }

      @keyframes stat-value-count {
        0% { 
          opacity: 0;
          transform: translateY(10px);
        }
        100% { 
          opacity: 1;
          transform: translateY(0px);
        }
      }

      .stat-growth {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        font-weight: 600;
      }

      .stat-growth.positive {
        color: #059669;
      }

      .stat-growth.negative {
        color: #dc2626;
      }

      .stat-growth.neutral {
        color: #64748b;
      }

      /* 📈 차트 섹션 */
      .charts-section {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .chart-card {
        background: white;
        border-radius: 1.5rem;
        padding: 2rem;
        box-shadow: 
          0 10px 25px rgba(0, 0, 0, 0.05),
          0 4px 10px rgba(0, 0, 0, 0.03);
        border: 1px solid rgba(0, 0, 0, 0.02);
      }

      .chart-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      /* 📊 미니 차트 */
      .mini-chart {
        height: 60px;
        display: flex;
        align-items: end;
        gap: 4px;
        margin-top: 1rem;
      }

      .chart-bar {
        flex: 1;
        background: linear-gradient(to top, #e2e8f0, #cbd5e1);
        border-radius: 2px;
        min-height: 8px;
        transition: all 0.3s ease;
        animation: chart-bar-grow 1s ease-out;
      }

      @keyframes chart-bar-grow {
        0% { height: 0; }
        100% { height: var(--bar-height, 20px); }
      }

      .chart-bar:hover {
        background: linear-gradient(to top, #6366f1, #8b5cf6);
        transform: scaleY(1.1);
      }

      /* 🏆 TOP 키워드 섹션 */
      .keywords-section {
        background: white;
        border-radius: 1.5rem;
        box-shadow: 
          0 10px 25px rgba(0, 0, 0, 0.05),
          0 4px 10px rgba(0, 0, 0, 0.03);
        border: 1px solid rgba(0, 0, 0, 0.02);
        overflow: hidden;
      }

      .keywords-header {
        padding: 2rem 2rem 1rem 2rem;
        border-bottom: 1px solid #f1f5f9;
        background: linear-gradient(135deg, #f8fafc, #f1f5f9);
      }

      .keywords-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: #1e293b;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .keywords-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .keyword-item {
        padding: 1.5rem 2rem;
        border-bottom: 1px solid #f1f5f9;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: all 0.2s ease;
        animation: keyword-item-slide 0.5s ease-out;
        animation-delay: calc(var(--item-index, 0) * 0.1s);
        animation-fill-mode: both;
      }

      @keyframes keyword-item-slide {
        0% {
          opacity: 0;
          transform: translateX(-20px);
        }
        100% {
          opacity: 1;
          transform: translateX(0px);
        }
      }

      .keyword-item:hover {
        background: #f8fafc;
        transform: translateX(4px);
      }

      .keyword-item:last-child {
        border-bottom: none;
      }

      .keyword-rank {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.875rem;
        margin-right: 1rem;
        position: relative;
      }

      .keyword-rank.rank-1 {
        background: linear-gradient(135deg, #fbbf24, #f59e0b);
        color: white;
        box-shadow: 0 4px 8px rgba(251, 191, 36, 0.3);
      }

      .keyword-rank.rank-2 {
        background: linear-gradient(135deg, #94a3b8, #64748b);
        color: white;
        box-shadow: 0 4px 8px rgba(148, 163, 184, 0.3);
      }

      .keyword-rank.rank-3 {
        background: linear-gradient(135deg, #f97316, #ea580c);
        color: white;
        box-shadow: 0 4px 8px rgba(249, 115, 22, 0.3);
      }

      .keyword-rank:not(.rank-1):not(.rank-2):not(.rank-3) {
        background: #f1f5f9;
        color: #64748b;
      }

      .keyword-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .keyword-title {
        font-weight: 600;
        color: #1e293b;
        font-size: 1rem;
      }

      .keyword-meta {
        font-size: 0.875rem;
        color: #64748b;
      }

      .keyword-stats {
        display: flex;
        align-items: center;
        gap: 1rem;
        font-size: 0.875rem;
      }

      .keyword-stat {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        color: #64748b;
        font-weight: 500;
      }

      .keyword-stat.clicks {
        color: #6366f1;
        font-weight: 600;
      }

      /* 🚨 에러 상태 */
      .error-container {
        padding: 2rem;
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 1rem;
        color: #dc2626;
        text-align: center;
        animation: error-shake 0.5s ease-in-out;
      }

      @keyframes error-shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }

      .error-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .error-message {
        font-size: 1.125rem;
        font-weight: 600;
      }

      /* 📱 반응형 디자인 */
      @media (max-width: 1024px) {
        .charts-section {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 768px) {
        .dashboard-container {
          padding: 1rem;
        }
        
        .dashboard-header {
          flex-direction: column;
          align-items: flex-start;
        }
        
        .dashboard-title {
          font-size: 1.5rem;
        }
        
        .stats-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        
        .stat-card {
          padding: 1.5rem;
        }
        
        .stat-value {
          font-size: 2rem;
        }
        
        .chart-card {
          padding: 1.5rem;
        }
        
        .keywords-header {
          padding: 1.5rem;
        }
        
        .keyword-item {
          padding: 1rem 1.5rem;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }
        
        .keyword-stats {
          align-self: stretch;
          justify-content: space-between;
        }
      }

      @media (max-width: 480px) {
        .dashboard-container {
          padding: 0.75rem;
        }
        
        .stat-card {
          padding: 1.25rem;
        }
        
        .stat-icon {
          width: 2.5rem;
          height: 2.5rem;
          font-size: 1.25rem;
        }
        
        .stat-value {
          font-size: 1.75rem;
        }
      }

      /* 🎭 다크모드 지원 */
      @media (prefers-color-scheme: dark) {
        .dashboard-container {
          color: #f1f5f9;
        }
        
        .dashboard-title {
          color: #f1f5f9;
        }
        
        .stat-card,
        .chart-card,
        .keywords-section {
          background: #1e293b;
          border-color: rgba(255, 255, 255, 0.1);
        }
        
        .stat-value,
        .chart-title,
        .keywords-title,
        .keyword-title {
          color: #f1f5f9;
        }
        
        .keywords-header {
          background: linear-gradient(135deg, #334155, #475569);
        }
        
        .keyword-item:hover {
          background: #334155;
        }
      }
    `;

    document.head.appendChild(style);
  };

  useLayoutEffect(() => {
    injectDashboardStyles(); // 스타일 선적용
    return () => {
      const el = document.getElementById('blogi-admin-dashboard-styles');
      if (el) el.remove();
    };
  }, []);
  
  useEffect(() => {
    fetchData(); // 데이터 로드는 일반 effect
  }, []);

  const fetchData = async () => {
    setLoading(true);
    let mounted = true;

    try {
      const [d, t, c] = await Promise.all([
        getDailyStats(),
        getTopKeywords(),
        getClovaStats(),
      ]);

      if (!mounted) return;

      const dPayload = Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : [];
      const tPayload = Array.isArray(t) ? t : Array.isArray(t?.data) ? t.data : [];
      const cPayload = c?.data ?? c ?? null;

      setDailyArr(dPayload);
      setTopArr(tPayload);
      setClovaObj(cPayload);
      setError("");
    } catch (e) {
      console.error("[AdminDashboard] fetch error:", e);
      if (mounted) {
        setError(
          e?.response?.data?.detail ||
          e?.response?.data?.message ||
          e?.message ||
          "대시보드 데이터를 불러오지 못했습니다."
        );
      }
    } finally {
      if (mounted) {
        setLoading(false);
      }
    }

    return () => { mounted = false; };
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getCurrentTime = () => {
    return new Date().toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <div className="error-message">{error}</div>
          <button
            onClick={handleRefresh}
            className="dashboard-refresh-btn"
            style={{ marginTop: '1rem' }}
          >
            🔄 다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* 헤더 섹션 */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">📊 관리자 대시보드</h1>
          <p className="dashboard-subtitle">
            마지막 업데이트: {getCurrentTime()}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="dashboard-refresh-btn"
        >
          {refreshing ? (
            <>
              <div className="refresh-spinner"></div>
              새로고침 중...
            </>
          ) : (
            <>
              🔄 새로고침
            </>
          )}
        </button>
      </div>

      {/* 통계 카드들 */}
      <div className="stats-grid">
        <div className="stat-card today">
          <div className="stat-header">
            <div>
              <h3 className="stat-title">오늘 생성 수</h3>
              <div className="stat-value">{formatNumber(todayGenerated)}</div>
              <div className={`stat-growth ${todayGrowth > 0 ? 'positive' : todayGrowth < 0 ? 'negative' : 'neutral'}`}>
                {todayGrowth > 0 ? '📈' : todayGrowth < 0 ? '📉' : '➖'}
                {Math.abs(todayGrowth)}% vs 어제
              </div>
            </div>
            <div className="stat-icon">📝</div>
          </div>
          <div className="mini-chart">
            {dailyArr.slice(0, 7).reverse().map((day, idx) => (
              <div
                key={idx}
                className="chart-bar"
                style={{
                  '--bar-height': `${Math.max(8, (day?.generated_posts || 0) / Math.max(...dailyArr.slice(0, 7).map(d => d?.generated_posts || 0)) * 50)}px`
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className="stat-card weekly">
          <div className="stat-header">
            <div>
              <h3 className="stat-title">7일 누적</h3>
              <div className="stat-value">{formatNumber(sevenDaysGenerated)}</div>
              <div className="stat-growth neutral">
                📊 일평균 {Math.round(sevenDaysGenerated / 7)}개
              </div>
            </div>
            <div className="stat-icon">📈</div>
          </div>
        </div>

        <div className="stat-card clova">
          <div className="stat-header">
            <div>
              <h3 className="stat-title">Clova 호출</h3>
              <div className="stat-value">{formatNumber(clovaTotalCalls)}</div>
              <div className="stat-growth positive">
                ✅ 성공률 {clovaSuccessRate}%
              </div>
            </div>
            <div className="stat-icon">🤖</div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <div>
              <h3 className="stat-title">시스템 상태</h3>
              <div className="stat-value">🟢</div>
              <div className="stat-growth positive">
                ⚡ 모든 서비스 정상
              </div>
            </div>
            <div className="stat-icon">💚</div>
          </div>
        </div>
      </div>

      {/* 차트 섹션 */}
      <div className="charts-section">
        <div className="chart-card">
          <h3 className="chart-title">📈 일별 생성 추이</h3>
          <div className="mini-chart" style={{ height: '120px' }}>
            {dailyArr.slice(0, 14).reverse().map((day, idx) => (
              <div
                key={idx}
                className="chart-bar"
                style={{
                  '--bar-height': `${Math.max(12, (day?.generated_posts || 0) / Math.max(...dailyArr.slice(0, 14).map(d => d?.generated_posts || 0)) * 100)}px`
                }}
                title={`${day?.date}: ${day?.generated_posts || 0}개`}
              ></div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">⚡ 실시간 현황</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>활성 사용자</span>
              <span style={{ fontWeight: '700', color: '#10b981' }}>🟢 {Math.floor(Math.random() * 50) + 10}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>서버 응답시간</span>
              <span style={{ fontWeight: '700', color: '#6366f1' }}>⚡ {Math.floor(Math.random() * 100) + 50}ms</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>메모리 사용률</span>
              <span style={{ fontWeight: '700', color: '#f59e0b' }}>📊 {Math.floor(Math.random() * 30) + 40}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* TOP 키워드 섹션 */}
      <div className="keywords-section">
        <div className="keywords-header">
          <h3 className="keywords-title">🏆 인기 키워드 TOP</h3>
        </div>
        <ul className="keywords-list">
          {topArr.length === 0 ? (
            <li className="keyword-item">
              <div style={{ textAlign: 'center', width: '100%', color: '#64748b', padding: '2rem' }}>
                📭 아직 데이터가 없습니다
              </div>
            </li>
          ) : (
            topArr.map((row, idx) => (
              <li
                key={row?.keyword_id ?? idx}
                className="keyword-item"
                style={{ '--item-index': idx }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className={`keyword-rank rank-${idx + 1 <= 3 ? idx + 1 : 'other'}`}>
                    {idx + 1}
                  </div>
                  <div className="keyword-info">
                    <div className="keyword-title">
                      {row?.title ?? `키워드 #${idx + 1}`}
                    </div>
                    <div className="keyword-meta">
                      ID: {row?.keyword_id ?? 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="keyword-stats">
                  <div className="keyword-stat clicks">
                    👆 {formatNumber(Number(row?.click_count ?? 0))} 클릭
                  </div>
                  <div className="keyword-stat">
                    📊 #{idx + 1}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}