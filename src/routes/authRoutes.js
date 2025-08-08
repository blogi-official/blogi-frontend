import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Onboarding from '../pages/Onboarding';
import KakaoCallback from '../pages/KakaoCallback';
import NaverCallback from '../pages/NaverCallback';
import MyPage from '../pages/MyPage'; 

const routes = [
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/onboarding', element: <Onboarding /> },
  { path: '/auth/kakao/callback', element: <KakaoCallback /> },
  { path: '/auth/naver/callback', element: <NaverCallback /> },
  { path: '/mypage', element: <MyPage /> },

];

export default routes;