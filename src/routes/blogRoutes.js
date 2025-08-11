import BlogList from '../pages/BlogList';
import BlogWrite from '../pages/BlogWrite';
import Home from '../pages/home';
import About from '../pages/About';

const routes = [
  { path: '/', element: <Home /> },
  { path: '/blogList', element: <BlogList /> },
  { path: '/blogWrite', element: <BlogWrite /> },
  { path: '/about', element: <About /> },
];

export default routes;