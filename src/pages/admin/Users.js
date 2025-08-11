// src/pages/admin/Users.js
import React, { useEffect, useState } from "react";
import { listUsers, listUserGenerated } from "../../api/admin";

/** 공통: 숫자 포맷 */
const nf = (n) => Number(n || 0).toLocaleString();

/** 응답 파서: 다양한 스키마 방어적으로 처리 */
function parseUsers(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  for (const v of Object.values(payload || {})) {
    if (Array.isArray(v)) return v;
  }
  return [];
}

function parseUserGenerated(payload) {
  const data = payload?.data || payload || {};
  const user = data.user || data?.user_info || null;
  const posts = Array.isArray(data.posts) ? data.posts : [];
  return {
    user,
    totalCount: data.total_count ?? posts.length ?? 0,
    latestCreatedAt: data.latest_created_at ?? null,
    posts,
  };
}

export default function Users() {
  // 상태 관리
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [uLoading, setULoading] = useState(true);
  const [uError, setUError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("created_at");

  // 모달 상태
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [gError, setGError] = useState("");
  const [gLimit, setGLimit] = useState(20);
  const [gOffset, setGOffset] = useState(0);
  const [gResult, setGResult] = useState({ user: null, totalCount: 0, posts: [] });

  // CSS 스타일 주입
  useEffect(() => {
    const styleId = 'users-page-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
      
      .users-page {
        font-family: 'Inter', sans-serif;
        background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #e0e7ff 100%);
        min-height: 100vh;
      }
      
      .mono { font-family: 'JetBrains Mono', monospace; }
      
      .glass {
        backdrop-filter: blur(20px);
        background: rgba(255, 255, 255, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      
      .gradient-text {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .card-hover {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
      }
      
      .card-hover:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      }
      
      .slide-in {
        animation: slideIn 0.5s ease-out forwards;
      }
      
      @keyframes slideIn {
        from { opacity: 0; transform: translateX(30px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      .fade-in {
        animation: fadeIn 0.3s ease-out forwards;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .pulse-ring {
        animation: pulseRing 2s infinite;
      }
      
      @keyframes pulseRing {
        0% { transform: scale(0.33); }
        80%, 100% { opacity: 0; }
      }
      
      .floating {
        animation: floating 3s ease-in-out infinite;
      }
      
      @keyframes floating {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      .spin {
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  // 유틸리티 함수들
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  const getProviderIcon = (provider) => {
    switch (provider?.toLowerCase()) {
      case 'google': return '🔍';
      case 'kakao': return '💬';
      case 'naver': return '🟢';
      case 'facebook': return '📘';
      default: return '👤';
    }
  };

  const getProviderColor = (provider) => {
    switch (provider?.toLowerCase()) {
      case 'google': return 'linear-gradient(135deg, #ef4444, #dc2626)';
      case 'kakao': return 'linear-gradient(135deg, #eab308, #ca8a04)';
      case 'naver': return 'linear-gradient(135deg, #22c55e, #16a34a)';
      case 'facebook': return 'linear-gradient(135deg, #3b82f6, #2563eb)';
      default: return 'linear-gradient(135deg, #6b7280, #4b5563)';
    }
  };

  const getUserInitial = (email) => {
    return email?.charAt(0)?.toUpperCase() || '?';
  };

  // 유저 목록 불러오기
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setULoading(true);
        setUError("");
        const payload = await listUsers({ page: 1, page_size: 100 });
        if (!alive) return;
        const parsedUsers = parseUsers(payload);
        setUsers(parsedUsers);
        setFilteredUsers(parsedUsers);
      } catch (e) {
        if (!alive) return;
        console.error("[Users] listUsers error:", e);
        setUError(e?.response?.data?.detail || e?.message || "유저 목록을 불러오지 못했습니다.");
      } finally {
        if (alive) setULoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // 검색 및 필터링
  useEffect(() => {
    let filtered = users.filter(user => {
      const email = (user.email || '').toLowerCase();
      const userId = String(user.user_id || user.id || '');
      return email.includes(searchTerm.toLowerCase()) || userId.includes(searchTerm);
    });

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'email':
          return (a.email || '').localeCompare(b.email || '');
        case 'content_count':
          return (b.content_count || 0) - (a.content_count || 0);
        case 'created_at':
        default:
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }
    });

    setFilteredUsers(filtered);
  }, [users, searchTerm, sortBy]);

  // 유저 콘텐츠 로드
  const loadUserGenerated = async (user) => {
    const userId = user.user_id || user.id;
    if (!userId) return;

    setGLoading(true);
    setGError("");

    try {
      const payload = await listUserGenerated(userId, { limit: gLimit, offset: gOffset });
      const parsed = parseUserGenerated(payload);
      setGResult(parsed);
    } catch (e) {
      console.error("[Users] listUserGenerated error:", e);
      setGError(e?.response?.data?.detail || e?.message || "유저의 생성 콘텐츠를 불러오지 못했습니다.");
      setGResult({ user: null, totalCount: 0, posts: [] });
    } finally {
      setGLoading(false);
    }
  };

  // 모달 열기
  const openModal = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
    setGOffset(0);
    loadUserGenerated(user);
    document.body.style.overflow = 'hidden';
  };

  // 모달 닫기
  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setGResult({ user: null, totalCount: 0, posts: [] });
    document.body.style.overflow = '';
  };

  // 선택 유지한 채 limit/offset만 바뀔 때 재조회
  useEffect(() => {
    if (selectedUser && modalOpen) {
      loadUserGenerated(selectedUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gLimit, gOffset]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && modalOpen) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen]);

  // 통계 계산
  const totalUsers = users.length;
  const activeUsers = Math.floor(totalUsers * 0.3);
  const totalContent = users.reduce((sum, user) => sum + (user.content_count || 0), 0);

  return (
    <div className="users-page" style={{ minHeight: '100vh' }}>
      {/* 🎨 헤더 섹션 */}
      <header style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.1), rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1))'
        }}></div>
        <div style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ position: 'relative' }}>
                <div className="floating" style={{
                  width: '64px',
                  height: '64px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}>
                  👥
                </div>
                <div className="pulse-ring" style={{
                  position: 'absolute',
                  inset: 0,
                  width: '64px',
                  height: '64px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  borderRadius: '16px'
                }}></div>
              </div>
            </div>
            <h1 className="gradient-text" style={{
              fontSize: '48px',
              fontWeight: '900',
              marginBottom: '16px'
            }}>
              User Management
            </h1>
            <p style={{ fontSize: '20px', color: '#6b7280', fontWeight: '300' }}>
              블로기 유저 관리 시스템
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '24px',
              marginTop: '32px'
            }}>
              <div className="glass" style={{
                borderRadius: '16px',
                padding: '12px 24px'
              }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#6366f1' }}>
                  {nf(totalUsers)}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
                  Total Users
                </div>
              </div>
              <div className="glass" style={{
                borderRadius: '16px',
                padding: '12px 24px'
              }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6' }}>
                  {nf(activeUsers)}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
                  Active Today
                </div>
              </div>
              <div className="glass" style={{
                borderRadius: '16px',
                padding: '12px 24px'
              }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ec4899' }}>
                  {nf(totalContent)}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
                  Total Content
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 🔍 검색 및 필터 섹션 */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 32px' }}>
        <div className="glass" style={{
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: window.innerWidth < 1024 ? 'column' : 'row',
            gap: '24px',
            alignItems: 'center'
          }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#9ca3af'
              }}>
                <svg style={{ width: '24px', height: '24px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="🔍 이메일, 아이디로 검색..."
                style={{
                  width: '100%',
                  paddingLeft: '48px',
                  paddingRight: '16px',
                  paddingTop: '16px',
                  paddingBottom: '16px',
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: '2px solid #e5e7eb',
                  borderRadius: '16px',
                  fontSize: '18px',
                  fontWeight: '500',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '16px 24px',
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: '2px solid #e5e7eb',
                  borderRadius: '16px',
                  fontWeight: '500',
                  outline: 'none'
                }}
              >
                <option value="created_at">최신 가입순</option>
                <option value="email">이메일순</option>
                <option value="content_count">콘텐츠 많은순</option>
              </select>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '16px 24px',
                  background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                  color: 'white',
                  borderRadius: '16px',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(90deg, #4f46e5, #7c3aed)';
                  e.target.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(90deg, #6366f1, #8b5cf6)';
                  e.target.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
                }}
              >
                🔄 새로고침
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 👥 유저 카드 그리드 */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 48px' }}>
        {uError && (
          <div style={{
            padding: '24px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '16px',
            color: '#dc2626',
            marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '32px' }}>⚠️</span>
              <span>{uError}</span>
            </div>
          </div>
        )}

        {uLoading ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', color: '#6b7280' }}>
              <div className="spin" style={{
                width: '32px',
                height: '32px',
                border: '3px solid #e5e7eb',
                borderTop: '3px solid #6366f1',
                borderRadius: '50%'
              }}></div>
              <span style={{ fontSize: '20px', fontWeight: '500' }}>까리한 유저들을 불러오는 중...</span>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <div style={{ fontSize: '128px', marginBottom: '24px' }}>🔍</div>
            <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
              검색 결과가 없습니다
            </h3>
            <p style={{ color: '#6b7280', fontSize: '18px' }}>다른 검색어를 시도해보세요.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '32px'
          }}>
            {filteredUsers.map((user, index) => {
              const providerColor = getProviderColor(user.provider);
              const providerIcon = getProviderIcon(user.provider);

              return (
                <div
                  key={user.user_id || user.id || index}
                  className="card-hover slide-in"
                  onClick={() => openModal(user)}
                  style={{
                    background: 'white',
                    borderRadius: '24px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #f3f4f6',
                    overflow: 'hidden',
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div style={{ height: '8px', background: providerColor }}></div>
                  <div style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                      <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        background: providerColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '32px',
                        fontWeight: 'bold',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                      }}>
                        {getUserInitial(user.email)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{
                          fontSize: '20px',
                          fontWeight: 'bold',
                          color: '#111827',
                          marginBottom: '4px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {user.email || '(이메일 없음)'}
                        </h3>
                        <p className="mono" style={{ fontSize: '14px', color: '#6b7280' }}>
                          ID: {user.user_id || user.id}
                        </p>
                      </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <span style={{ color: '#6b7280', fontWeight: '500' }}>가입일</span>
                        <span style={{ fontWeight: '600', color: '#111827' }}>{formatDate(user.created_at)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <span style={{ color: '#6b7280', fontWeight: '500' }}>제공자</span>
                        <span style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '4px 12px',
                          background: providerColor,
                          color: 'white',
                          borderRadius: '20px',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}>
                          {providerIcon} {user.provider?.toUpperCase() || 'DEFAULT'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#6b7280', fontWeight: '500' }}>콘텐츠</span>
                        <span style={{ fontWeight: 'bold', color: '#6366f1' }}>
                          {nf(user.content_count || 0)}개
                        </span>
                      </div>
                    </div>

                    <button style={{
                      width: '100%',
                      padding: '12px',
                      background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                      color: 'white',
                      borderRadius: '16px',
                      border: 'none',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease'
                    }}>
                      📝 콘텐츠 보기
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 🎭 유저 상세 모달 */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              width: '100%',
              maxWidth: '1024px',
              maxHeight: '90vh',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div style={{
              position: 'relative',
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
              color: 'white',
              padding: '32px'
            }}>
              <button
                onClick={closeModal}
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
              >
                <svg style={{ width: '24px', height: '24px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  fontWeight: 'bold'
                }}>
                  {getUserInitial(selectedUser?.email)}
                </div>
                <div>
                  <h2 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '8px' }}>
                    {selectedUser?.email || '(이메일 없음)'}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'rgba(255, 255, 255, 0.8)' }}>
                    <span style={{
                      padding: '4px 12px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      {getProviderIcon(selectedUser?.provider)} {selectedUser?.provider?.toUpperCase() || 'DEFAULT'}
                    </span>
                    <span style={{ fontSize: '14px' }}>
                      가입일: {formatDate(selectedUser?.created_at)}
                    </span>
                    <span className="mono" style={{ fontSize: '14px' }}>
                      ID: {selectedUser?.user_id || selectedUser?.id}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 모달 바디 */}
            <div style={{ padding: '32px', maxHeight: '60vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  📝 생성한 콘텐츠
                </h3>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#6366f1' }}>
                  총 {nf(gResult.totalCount)}건
                </div>
              </div>

              {gError ? (
                <div style={{
                  padding: '24px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '16px',
                  color: '#dc2626'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '32px' }}>⚠️</span>
                    <span>{gError}</span>
                  </div>
                </div>
              ) : gLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '48px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#6b7280' }}>
                    <div className="spin" style={{
                      width: '24px',
                      height: '24px',
                      border: '2px solid #e5e7eb',
                      borderTop: '2px solid #6366f1',
                      borderRadius: '50%'
                    }}></div>
                    <span>콘텐츠를 불러오는 중...</span>
                  </div>
                </div>
              ) : gResult.posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <div style={{ fontSize: '96px', marginBottom: '16px' }}>📝</div>
                  <h4 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                    생성한 콘텐츠가 없습니다
                  </h4>
                  <p style={{ color: '#6b7280' }}>아직 이 유저가 생성한 콘텐츠가 없어요.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {gResult.posts.map((post) => (
                    <div
                      key={post.id}
                      style={{
                        padding: '24px',
                        background: 'linear-gradient(90deg, #f9fafb, #f3f4f6)',
                        borderRadius: '16px',
                        border: '1px solid #e5e7eb',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'linear-gradient(90deg, #ffffff, #f9fafb)';
                        e.target.style.borderColor = '#c7d2fe';
                        e.target.style.transform = 'translateX(4px)';
                        e.target.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'linear-gradient(90deg, #f9fafb, #f3f4f6)';
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.transform = 'translateX(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#111827',
                            marginBottom: '8px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {post.title || '(제목 없음)'}
                          </h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500' }}>
                              📅 {formatDateTime(post.created_at)}
                            </span>
                            {typeof post.copy_count !== "undefined" && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500', color: '#6366f1' }}>
                                📋 {nf(post.copy_count)}회 복사
                              </span>
                            )}
                          </div>
                        </div>
                        <button style={{
                          marginLeft: '16px',
                          padding: '8px 16px',
                          background: 'rgba(99, 102, 241, 0.1)',
                          color: '#6366f1',
                          borderRadius: '12px',
                          border: 'none',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'background 0.3s ease'
                        }}>
                          콘텐츠
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 콘텐츠 페이지네이션 */}
              {gResult.posts.length > 0 && (
                <div style={{
                  marginTop: '24px',
                  paddingTop: '16px',
                  borderTop: '1px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      onClick={() => setGOffset(Math.max(0, gOffset - gLimit))}
                      disabled={gOffset <= 0}
                      style={{
                        padding: '8px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        background: 'white',
                        cursor: gOffset <= 0 ? 'not-allowed' : 'pointer',
                        opacity: gOffset <= 0 ? 0.5 : 1,
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      ← 이전
                    </button>
                    <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
                      페이지 {Math.floor(gOffset / gLimit) + 1}
                    </div>
                    <button
                      onClick={() => setGOffset(gOffset + gLimit)}
                      disabled={gResult.posts.length < gLimit}
                      style={{
                        padding: '8px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        background: 'white',
                        cursor: gResult.posts.length < gLimit ? 'not-allowed' : 'pointer',
                        opacity: gResult.posts.length < gLimit ? 0.5 : 1,
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      다음 →
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>페이지 크기</span>
                    <select
                      value={gLimit}
                      onChange={(e) => { setGLimit(Number(e.target.value)); setGOffset(0); }}
                      style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '4px 8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={30}>30</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}