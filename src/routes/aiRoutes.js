import ChatBot from '../pages/ChatBot';
import NewsSummary from '../pages/NewsSummary';

const aiRoutes = [
  { path: '/chatBot', element: <ChatBot /> },
  { path: '/news-summary', element: <NewsSummary /> }
];

export default aiRoutes;