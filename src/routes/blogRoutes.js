import BlogList from '../pages/BlogList';
import BlogWrite from '../pages/BlogWrite';
import Home from '../pages/home';

const routes = [
  { path: '/', element: <Home /> },
  { path: '/blogList', element: <BlogList /> },
  { path: '/blogWrite', element: <BlogWrite /> },
];

export default routes;