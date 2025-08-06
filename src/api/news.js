import axios from 'axios';

export async function fetchPriorityNews() {
  try {
    const response = await axios.get('/api/news/priority');
    return response.data;
  } catch (error) {
    return [
      { title: 'OpenAI, GPT-5 개발 소식', link: '#' },
      { title: '네이버 뉴스 요약 기능 출시', link: '#' },
    ];
  }
}