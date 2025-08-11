import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api, AUTH } from "../api/client";

const NaverCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get("code");
    const state = query.get("state");

    if (!code || !state) {
      alert("네이버 인가 코드 또는 state가 없습니다.");
      navigate("/login");
      return;
    }

    api
      .post("/auth/naver/callback/", { code, state })
      .then((res) => {
        const token = res.data.access;
        const isOnboarded = res.data.user?.is_onboarded;

        if (!token) {
          alert("토큰이 없습니다.");
          navigate("/login");
          return;
        }

        localStorage.setItem(AUTH.TOKEN_KEY, token);

        if (isOnboarded) {
          navigate("/");
        } else {
          navigate("/onboarding");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("로그인 중 오류가 발생했습니다.");
        navigate("/login");
      });
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-xl text-gray-700">
      로그인 처리 중입니다...
    </div>
  );
};

export default NaverCallback;

