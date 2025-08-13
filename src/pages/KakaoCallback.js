import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api, AUTH } from "../api/client";

const KakaoCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const query = new URLSearchParams(location.search);
    const code = query.get("code");
    console.log("카카오 인가 코드:", code);

    if (!code) {
      alert("카카오 인가 코드가 없습니다.");
      navigate("/login");
      return;
    }

    // URL 쿼리 파라미터 제거
    window.history.replaceState(null, "", "/auth/kakao/callback");

    api
      .post("/auth/kakao/callback/", { code })
      .then((res) => {
        const token = res.data.access;
        const isOnboarded = res.data.user?.is_onboarded;

        if (!token) {
          alert("토큰이 없습니다.");
          navigate("/login");
          return;
        }

        localStorage.setItem(AUTH.TOKEN_KEY, token);

        window.dispatchEvent(new Event("loginStateChange"));

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

  return null
};

export default KakaoCallback;

