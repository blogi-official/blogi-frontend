import React from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';

function BlogList() {
  const posts = [1, 2, 3, 4, 5, 6]; // 예시 데이터

  return (
    <div className="container my-5">
      {/* 상단 헤더 - 타이틀만 가운데 */}
      <div className="text-center mb-4">
        <h1>All Blog Posts</h1>
      </div>

      {/* 카드 리스트 */}
      <div className="row">
        {posts.map((post) => (
          <div className="col-lg-4 col-md-6 mb-4" key={post}>
            <BlogCard />
          </div>
        ))}
      </div>

      {/* 하단 - 왼쪽 비워두고 페이지네이션 가운데, 글쓰기 버튼 오른쪽 */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <div style={{ width: '75px' }} /> {/* 왼쪽 빈 공간 */}

        <nav aria-label="Page navigation example" className="mx-auto">
          <ul className="pagination mb-0 justify-content-center">
            <li className="page-item disabled">
              <a className="page-link" href="#!" tabIndex="-1" aria-disabled="true">Previous</a>
            </li>
            <li className="page-item active">
              <a className="page-link" href="#!">1</a>
            </li>
            <li className="page-item"><a className="page-link" href="#!">2</a></li>
            <li className="page-item"><a className="page-link" href="#!">3</a></li>
            <li className="page-item">
              <a className="page-link" href="#!">Next</a>
            </li>
          </ul>
        </nav>

         {/* Link로 감싸서 글쓰기 페이지로 이동 */}
         <Link to="/blogWrite" className="btn btn-primary">
          글쓰기
        </Link>
      </div>
    </div>
  );
}

export default BlogList;
