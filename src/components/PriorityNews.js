import React, { useEffect, useState } from 'react';
import { fetchTop3Keywords } from '../api/news';

function PopularKeywordsSidebar() {
  const [keywords, setKeywords] = useState([]);

  useEffect(() => {
    fetchTop3Keywords().then(setKeywords);
  }, []);

  return (
    <div className="card mb-4">
      <div className="card-header">🔥 블로기 인기 키워드 TOP 3</div>
      <div className="card-body">
        <ul className="list-unstyled mb-0">
          {keywords.map((item, idx) => (
            <li key={idx} className="mb-2">
              <a
                href={`/generate?keyword=${encodeURIComponent(item.title)}`}
                className="text-dark"
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PopularKeywordsSidebar;
