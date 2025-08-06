import React, { useState } from 'react';
import ArticleCard from '../components/ArticleCard';

function NewsSummary() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const mockArticles = [
    {
      title: 'AI 기술이 바꾼 세상',
      summary: 'AI 기술은 의료, 교육, 교통 등 다양한 산업에 혁신을 가져왔습니다...',
      source: 'https://news.example.com/ai-impact',
    },
    {
      title: '챗봇, 사람과 대화하다',
      summary: '생성형 AI 챗봇이 고객 서비스에 도입되며 상담 효율이 크게 향상되고 있습니다...',
      source: 'https://news.example.com/chatbot-rise',
    },
  ];

  const handleSummarize = () => {
    setLoading(true);

    // 🔽 실제로는 API로 기사 스크래핑 + 요약 호출
    setTimeout(() => {
      setArticles(mockArticles);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">📰 AI 뉴스 요약</h2>
        <button className="btn btn-outline-primary" onClick={handleSummarize}>
          요약 시작
        </button>
      </div>

      {loading && <p>요약 중입니다... ⏳</p>}

      {!loading && articles.length > 0 && (
        <div>
          {articles.map((article, index) => (
            <ArticleCard
              key={index}
              title={article.title}
              summary={article.summary}
              source={article.source}
            />
          ))}
        </div>
      )}

      {!loading && articles.length === 0 && (
        <p className="text-muted">뉴스 요약 결과가 없습니다. 버튼을 눌러 요약을 시작하세요.</p>
      )}
    </div>
  );
}

export default NewsSummary;
