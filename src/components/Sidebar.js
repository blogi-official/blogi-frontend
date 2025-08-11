import React from 'react';
import PopularKeywordsSidebar from './PriorityNews';

function Sidebar({ sortBy, setSortBy, page, setPage, totalPages }) {
  return (
    <>
      {/* 💡 사용 방법 위젯 */}
      <div className="card mb-4">
        <div className="card-header">💡 사용 방법</div>
        <div className="card-body">
          <ul className="mb-0">
            <li>키워드를 클릭하면 콘텐츠 생성 페이지로 이동합니다</li>
            <li>로그인이 필요한 서비스입니다</li>
            <li>관심사 기반으로 개인화된 키워드를 제공합니다</li>
          </ul>
        </div>
      </div>

      {/* 🔀 정렬 기준 */}
      <div className="card mb-4">
        <div className="card-header">🔀 정렬 기준</div>
        <div className="card-body d-flex justify-content-center gap-2">
          <button
            className={`btn btn-sm ${sortBy === 'latest' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSortBy('latest')}
          >
            최신순
          </button>
          <button
            className={`btn btn-sm ${sortBy === 'popular' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSortBy('popular')}
          >
            인기순
          </button>
        </div>
      </div>


      {/* 📄 페이지네이션 */}
      {totalPages > 1 && (
        <div className="card mb-4">
          <div className="card-header">📄 페이지 이동</div>
          <div className="card-body">
            <nav>
              <ul className="pagination justify-content-center mb-0">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    이전
                  </button>
                </li>
                {[...Array(totalPages)].map((_, idx) => (
                  <li key={idx + 1} className={`page-item ${page === idx + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setPage(idx + 1)}>
                      {idx + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    다음
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* 인기 키워드 위젯 */}
      <PopularKeywordsSidebar />

    </>
  );
}

export default Sidebar;
