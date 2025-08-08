import { useEffect, useRef } from 'react'; 
import { useNavigate, useLocation } from 'react-router-dom';

const KakaoCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const calledRef = useRef(false); //  중복 방지용

  useEffect(() => {
    if (calledRef.current) return;        //  중복 실행 방지
    calledRef.current = true;    

    const query = new URLSearchParams(location.search);
    const code = query.get('code');
    console.log('카카오 인가 코드:', code);

    if (!code) {
      alert('카카오 인가 코드가 없습니다.');
      navigate('/login');
      return;
    }

    // 쿼리 파라미터 제거 (URL 깔끔하게 정리)
    window.history.replaceState(null, '', '/auth/kakao/callback');

    fetch(`${process.env.REACT_APP_API_URL}/api/auth/kakao/callback/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('로그인 실패');
        return res.json();
      })
      .then((data) => {
        const token = data.access;
        const isOnboarded = data.user?.is_onboarded;

        if (!token) {
          alert('토큰이 없습니다.');
          navigate('/login');
          return;
        }

        localStorage.setItem('accessToken', token);

        if (isOnboarded) {
          navigate('/');
        } else {
          navigate('/onboarding');
        }
      })
      .catch((err) => {
        console.error(err);
        alert('로그인 중 오류가 발생했습니다.');
        navigate('/login');
      });
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-xl text-gray-700">
      로그인 처리 중입니다...
    </div>
  );
};

export default KakaoCallback;
