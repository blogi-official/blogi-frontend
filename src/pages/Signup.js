import React, { useState } from 'react';

function Signup() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기에 회원가입 로직 추가
    if (form.password !== form.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    alert(`회원가입 완료!\n아이디: ${form.username}\n이메일: ${form.email}`);
    // 실제 서버 연결 시 API 호출 위치
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">아이디</label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">이메일</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">비밀번호</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">비밀번호 확인</label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">회원가입</button>
      </form>
    </div>
  );
}

export default Signup;