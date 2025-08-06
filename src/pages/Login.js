import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기에 로그인 처리 로직 추가 (API 호출 등)
    alert(`이메일: ${email}, 비밀번호: ${password}`);
  };

   // 소셜 로그인 클릭 핸들러 예시
   const handleSocialLogin = (provider) => {
    alert(`${provider} 로그인 버튼 클릭됨`);
    // 여기에 실제 OAuth 로직 또는 리다이렉트 구현
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '80px' }}>
      <h2 className="mb-4 text-center">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

      </form>
      
      <div className="d-grid gap-2">
        <button type="submit" className="btn btn-primary w-100">Login</button>
        <button
          className="btn btn-danger"
          onClick={() => handleSocialLogin('Google')}
          type="button"
        >
          {/* 구글 아이콘 넣고 싶으면 여기에 추가 */}
          Google 로그인
        </button>

        <button
          className="btn btn-warning text-white"
          onClick={() => handleSocialLogin('Kakao')}
          type="button"
        >
          {/* 카카오 아이콘 추가 가능 */}
          Kakao 로그인
        </button>

        <button
          className="btn btn-success"
          onClick={() => handleSocialLogin('Naver')}
          type="button"
        >
          {/* 네이버 아이콘 추가 가능 */}
          Naver 로그인
        </button>
      </div>
    </div>
  );
}

export default Login;
