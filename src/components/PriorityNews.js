import React, { useEffect, useState } from 'react';
import { fetchPriorityNews } from '../api/news';

function PriorityNewsSidebar() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetchPriorityNews().then(setNews);
  }, []);

  return (
    <div className="card mb-4">
      <div className="card-header">🔥 실시간 뉴스</div>
      <div className="card-body">
        <ul className="list-unstyled mb-0">
          {news.map((item, idx) => (
            <li key={idx} className="mb-2">
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-dark">
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PriorityNewsSidebar;
