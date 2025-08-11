import { useEffect, useState } from "react";
import { ADMIN_TOKEN_KEY, setAdminAuthToken } from "../api/client";

const AUTH_EVENT = "blogi:admin-auth-changed";

export default function useAdminAuth() {
  // ✅ 1) 첫 렌더 전에 동기 초기화: 가드가 즉시 올바른 값 사용
  const initialToken = localStorage.getItem(ADMIN_TOKEN_KEY);
  const [isAuthed, setIsAuthed] = useState(!!initialToken);
  const [ready, setReady] = useState(true); // 동기 초기화로 바로 true

  // 마운트 시 axios 헤더 정합성만 보정
  useEffect(() => {
    if (initialToken) setAdminAuthToken(initialToken);
    else setAdminAuthToken(null);

    // 동일 탭 동기화
    const onAuthEvent = () => {
      const t = localStorage.getItem(ADMIN_TOKEN_KEY);
      setIsAuthed(!!t);
      setAdminAuthToken(t || null);
    };
    window.addEventListener(AUTH_EVENT, onAuthEvent);

    // 다른 탭 동기화
    const onStorage = (e) => {
      if (e.key !== ADMIN_TOKEN_KEY) return;
      const t = localStorage.getItem(ADMIN_TOKEN_KEY);
      setIsAuthed(!!t);
      setAdminAuthToken(t || null);
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(AUTH_EVENT, onAuthEvent);
      window.removeEventListener("storage", onStorage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ 로그인 성공 시: LS + axios + 동일 탭 브로드캐스트
  const save = (accessToken) => {
    localStorage.setItem(ADMIN_TOKEN_KEY, accessToken);
    setAdminAuthToken(accessToken);
    setIsAuthed(true);
    window.dispatchEvent(new Event(AUTH_EVENT));
  };

  const clear = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setAdminAuthToken(null);
    setIsAuthed(false);
    window.dispatchEvent(new Event(AUTH_EVENT));
  };

  return { ready, isAuthed, save, clear };
}


