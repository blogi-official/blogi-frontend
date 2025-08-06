import React from 'react';

function ArticleCard({ title, summary, source }) {
  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{summary}</p>
        <a href={source} className="btn btn-sm btn-outline-primary" target="_blank" rel="noopener noreferrer">
          원문 보기
        </a>
      </div>
    </div>
  );
}

export default ArticleCard;
