import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

// CSS를 확실하게 주입
const injectStyles = () => {
  if (document.getElementById('about-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'about-styles';
  style.textContent = `
    /* 기본 리셋 */
    * {
      box-sizing: border-box;
    }
    
    /* 그라디언트 배경 */
    .gradient-bg {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    /* 카드 호버 효과 */
    .card-hover {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }
    .card-hover:hover {
      transform: translateY(-8px);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    
    /* 스텝 라인 */
    .step-line {
      background: linear-gradient(90deg, #667eea, #764ba2);
    }
    
    /* 기술 배지 */
    .tech-badge {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      transition: all 0.3s ease;
      cursor: pointer;
    }
    .tech-badge:hover {
      transform: scale(1.05);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
    }
    
    /* 플로팅 애니메이션 */
    .floating {
      animation: float 3s ease-in-out infinite;
    }
    .floating:nth-child(2) {
      animation-delay: 1s;
    }
    .floating:nth-child(3) {
      animation-delay: 2s;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    
    /* 반응형 그리드 강제 적용 */
    .grid-3 {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 2rem;
    }
    
    @media (min-width: 768px) {
      .grid-3 {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    
    .grid-5 {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 2rem;
    }
    
    @media (min-width: 768px) {
      .grid-5 {
        grid-template-columns: repeat(5, 1fr);
      }
    }
    
    .grid-features {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 2rem;
    }
    
    @media (min-width: 768px) {
      .grid-features {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (min-width: 1024px) {
      .grid-features {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    
    /* 컨테이너 */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    /* 섹션 패딩 */
    .section {
      padding: 5rem 0;
    }
    
    /* 텍스트 스타일 */
    .hero-title {
      font-size: 3rem;
      font-weight: 700;
      color: white;
      margin-bottom: 1.5rem;
      line-height: 1.1;
    }
    
    @media (min-width: 768px) {
      .hero-title {
        font-size: 4.5rem;
      }
    }
    
    .hero-subtitle {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 2rem;
      line-height: 1.6;
    }
    
    @media (min-width: 768px) {
      .hero-subtitle {
        font-size: 1.5rem;
      }
    }
    
    .section-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 1rem;
      text-align: center;
    }
    
    .section-desc {
      font-size: 1.25rem;
      color: #6b7280;
      text-align: center;
      margin-bottom: 4rem;
      max-width: 48rem;
      margin-left: auto;
      margin-right: auto;
    }
    
    /* 카드 스타일 */
    .card {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      border: 1px solid #e5e7eb;
      height: 100%;
    }
    
    .card-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      display: block;
    }
    
    .card-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 0.75rem;
    }
    
    .card-desc {
      color: #6b7280;
      line-height: 1.6;
    }
    
    /* 스텝 원 */
    .step-circle {
      width: 5rem;
      height: 5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      margin: 0 auto 1rem auto;
      transition: all 0.3s ease;
    }
    
    .step-circle.active {
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      color: white;
      box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
    }
    
    .step-circle.inactive {
      background: white;
      color: #6b7280;
      border: 2px solid #e5e7eb;
    }
    
    /* 버튼 */
    .btn-primary {
      background: white;
      color: #7c3aed;
      padding: 1rem 2rem;
      border-radius: 9999px;
      font-size: 1.125rem;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    
    .btn-primary:hover {
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }
    
    /* 배경 색상 */
    .bg-white { background-color: white; }
    .bg-gray-50 { background-color: #f9fafb; }
    .bg-blue-50 { background-color: #eff6ff; }
    .bg-purple-50 { background-color: #faf5ff; }
    .bg-pink-50 { background-color: #fdf2f8; }
    .bg-green-50 { background-color: #f0fdf4; }
    
    /* 그라디언트 배경 */
    .bg-gradient-blue { background: linear-gradient(135deg, #eff6ff, #faf5ff); }
    .bg-gradient-purple { background: linear-gradient(135deg, #faf5ff, #fdf2f8); }
    .bg-gradient-green { background: linear-gradient(135deg, #f0fdf4, #eff6ff); }
    
    /* 텍스트 중앙 정렬 */
    .text-center { text-align: center; }
    
    /* 상대/절대 위치 */
    .relative { position: relative; }
    .absolute { position: absolute; }
    
    /* z-index */
    .z-10 { z-index: 10; }
    
    /* 오버플로우 */
    .overflow-hidden { overflow: hidden; }
    
    /* 플렉스 */
    .flex { display: flex; }
    .items-center { align-items: center; }
    .justify-center { justify-content: center; }
    .flex-wrap { flex-wrap: wrap; }
    .gap-4 { gap: 1rem; }
    
    /* 마진/패딩 */
    .mb-4 { margin-bottom: 1rem; }
    .mb-8 { margin-bottom: 2rem; }
    .mb-16 { margin-bottom: 4rem; }
    .pt-8 { padding-top: 2rem; }
    
    /* 투명도 */
    .opacity-10 { opacity: 0.1; }
    .opacity-20 { opacity: 0.2; }
    .opacity-60 { opacity: 0.6; }
    .opacity-80 { opacity: 0.8; }
    .opacity-90 { opacity: 0.9; }
  `;
  
  document.head.appendChild(style);
};

// HeroSection 컴포넌트
const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="gradient-bg relative overflow-hidden section">
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden" style={{pointerEvents: 'none'}}>
        <div className="floating absolute opacity-10" style={{
          top: '5rem', left: '2.5rem', width: '5rem', height: '5rem', 
          background: 'white', borderRadius: '50%'
        }}></div>
        <div className="floating absolute opacity-10" style={{
          top: '10rem', right: '5rem', width: '4rem', height: '4rem', 
          background: 'white', borderRadius: '50%'
        }}></div>
        <div className="floating absolute opacity-10" style={{
          bottom: '10rem', left: '25%', width: '3rem', height: '3rem', 
          background: 'white', borderRadius: '50%'
        }}></div>
      </div>

      <div className="relative z-10 container text-center">
        <div className="flex items-center justify-center opacity-20 mb-8" style={{
          width: '6rem', height: '6rem', background: 'white', 
          borderRadius: '50%', margin: '0 auto 2rem auto'
        }}>
          <span style={{fontSize: '3rem'}}>🤖</span>
        </div>
        
        <h1 className="hero-title">
          블로기<span style={{color: '#fcd34d'}}>(Blogi)</span>란?
        </h1>
        
        <p className="hero-subtitle container" style={{maxWidth: '64rem'}}>
          키워드 하나면 끝! AI가 알아서 블로그 콘텐츠를 만들어주는 똑똑한 서비스
        </p>
        
        <button
          className="btn-primary"
          onClick={() => navigate('/')} // 🔁 원하는 경로
        >
          지금 시작하기 →
        </button>
      </div>
    </section>
  );
};

// ServiceOverview 컴포넌트
const ServiceOverview = () => {
  const overviewCards = [
    {
      icon: "🎯",
      title: "대상 사용자",
      desc: "시간 부족한 블로거, 콘텐츠 마케터, 개인 브랜딩을 원하는 모든 분들",
      bgClass: "bg-gradient-blue"
    },
    {
      icon: "⚡",
      title: "핵심 가치",
      desc: "5분이면 완성되는 고품질 블로그 콘텐츠. 더 이상 빈 화면을 바라보지 마세요",
      bgClass: "bg-gradient-purple"
    },
    {
      icon: "🚀",
      title: "차별점",
      desc: "뉴스 요약, 이미지 추천, 상품 링크까지 모든 것을 자동으로 처리",
      bgClass: "bg-gradient-green"
    }
  ];

  return (
    <section className="section bg-white">
      <div className="container">
        <h2 className="section-title">서비스 개요</h2>
        <p className="section-desc">
          블로거, 마케터, 콘텐츠 크리에이터를 위한 AI 기반 자동 블로그 생성 플랫폼
        </p>

        <div className="grid-3">
          {overviewCards.map((card, index) => (
            <div key={index} className={`card card-hover ${card.bgClass}`}>
              <div className="card-icon">{card.icon}</div>
              <h3 className="card-title">{card.title}</h3>
              <p className="card-desc">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// UserFlow 컴포넌트
const UserFlow = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { icon: "🔍", title: "키워드 입력", desc: "관심 있는 주제나 키워드를 입력하세요" },
    { icon: "📰", title: "뉴스 요약", desc: "최신 뉴스를 AI가 자동으로 수집하고 요약해요" },
    { icon: "🖼️", title: "이미지 추천", desc: "콘텐츠에 어울리는 이미지를 자동으로 찾아줘요" },
    { icon: "✍️", title: "글 생성", desc: "AI가 완성도 높은 블로그 글을 작성해요" },
    { icon: "📋", title: "복사 & 업로드", desc: "완성된 글을 복사하거나 바로 업로드하세요" }
  ];

  return (
    <section className="section bg-gray-50">
      <div className="container">
        <h2 className="section-title">사용자 플로우</h2>
        <p className="section-desc">
          단 5단계로 완성되는 블로그 콘텐츠 생성 과정
        </p>

        <div className="relative">
          {/* Timeline line - 데스크톱에서만 표시 */}
          <div className="step-line absolute" style={{
            top: '50%', left: '0', right: '0', height: '4px', 
            borderRadius: '2px', transform: 'translateY(-50%)',
            display: window.innerWidth >= 768 ? 'block' : 'none'
          }}></div>
          
          <div className="grid-5 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="text-center"
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: activeStep === index ? 'scale(1.05)' : 'scale(1)'
                }}
                onMouseEnter={() => setActiveStep(index)}
              >
                <div className={`step-circle ${activeStep === index ? 'active' : 'inactive'}`}>
                  {step.icon}
                </div>
                <h3 style={{
                  fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem'
                }}>{step.title}</h3>
                <p style={{
                  fontSize: '0.875rem', color: '#6b7280'
                }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Features 컴포넌트
const Features = () => {
  const features = [
    {
      icon: "🤖",
      title: "AI 콘텐츠 생성",
      desc: "GPT 기반으로 자연스럽고 완성도 높은 블로그 글을 자동 생성해요"
    },
    {
      icon: "🖼️",
      title: "이미지 자동 추천",
      desc: "Unsplash API를 통해 콘텐츠에 딱 맞는 고품질 이미지를 추천해드려요"
    },
    {
      icon: "🛒",
      title: "상품 링크 삽입",
      desc: "관련 상품을 자동으로 찾아 자연스럽게 링크를 삽입해드려요"
    },
    {
      icon: "📱",
      title: "원클릭 복사",
      desc: "완성된 글을 클릭 한 번으로 복사하고 어디든 붙여넣기 하세요"
    },
    {
      icon: "🔄",
      title: "무제한 재생성",
      desc: "마음에 들지 않으면 언제든 다시 생성할 수 있어요"
    },
    {
      icon: "📊",
      title: "트렌드 분석",
      desc: "실시간 트렌드를 분석해 더 매력적인 콘텐츠를 만들어요"
    }
  ];

  return (
    <section className="section bg-white">
      <div className="container">
        <h2 className="section-title">주요 기능</h2>
        <p className="section-desc">
          블로기가 제공하는 강력한 AI 기능들을 만나보세요
        </p>

        <div className="grid-features">
          {features.map((feature, index) => (
            <div key={index} className="card card-hover" style={{boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
              <div className="card-icon">{feature.icon}</div>
              <h3 className="card-title">{feature.title}</h3>
              <p className="card-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Team 컴포넌트
const Team = () => {
  const team = [
    {
      name: "구은재",
      role: "CEO",
      emoji: "🧠",
      desc: "아이디어 머신. 매일 10개 제안, 야근담당",
      specialty: "기획 & 비전"
    },
    {
      name: "이상인",
      role: "CTO",
      emoji: "🛠️",
      desc: "현실 조율자. '그건 내일은 못 만들어요' 전문",
      specialty: "개발 & 기술"
    }
  ];

  return (
    <section className="section bg-gray-50">
      <div className="container">
        <h2 className="section-title">팀 소개</h2>
        <p className="section-desc">
          블로기를 만들어가는 사람들 (아직은 둘뿐이지만 열정만큼은 100명 몫!)
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '64rem',
          margin: '0 auto'
        }}>
          {team.map((member, index) => (
            <div key={index} className="card card-hover text-center">
              <div style={{fontSize: '4rem', marginBottom: '1rem'}}>{member.emoji}</div>
              <h3 style={{
                fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem'
              }}>{member.name}</h3>
              <div style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                color: 'white',
                padding: '0.25rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '600',
                marginBottom: '1rem'
              }}>
                {member.role}
              </div>
              <p style={{
                color: '#6b7280', marginBottom: '0.75rem', fontStyle: 'italic'
              }}>"{member.desc}"</p>
              <p style={{
                fontSize: '0.875rem', color: '#9ca3af'
              }}>{member.specialty}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// TechStack 컴포넌트
const TechStack = () => {
  const techStack = [
    { name: "React", color: "#3B82F6" },
    { name: "FastAPI", color: "#10B981" },
    { name: "Django", color: "#059669" },
    { name: "GPT-4", color: "#8B5CF6" },
    { name: "Vercel", color: "#000000" },
    { name: "Unsplash", color: "#6B7280" },
    { name: "PostgreSQL", color: "#2563EB" },
    { name: "Tailwind", color: "#06B6D4" }
  ];

  return (
    <section className="section bg-white">
      <div className="container">
        <h2 className="section-title">기술 스택</h2>
        <p className="section-desc">
          최신 기술로 안정적이고 빠른 서비스를 제공합니다
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {techStack.map((tech, index) => (
            <div 
              key={index} 
              className="tech-badge"
              style={{
                backgroundColor: tech.color,
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                fontWeight: '600'
              }}
            >
              {tech.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// FuturePlans 컴포넌트
const FuturePlans = () => {
  const futureFeatures = [
    { icon: "📝", title: "Tistory API 연동", desc: "티스토리에 바로 포스팅할 수 있어요" },
    { icon: "🎥", title: "유튜브 스크립트", desc: "영상 스크립트도 자동으로 생성해드려요" },
    { icon: "🔊", title: "TTS 기능", desc: "글을 음성으로 변환해서 들을 수 있어요" },
    { icon: "👥", title: "커뮤니티", desc: "다른 블로거들과 소통하고 팁을 공유해요" },
    { icon: "💎", title: "프리미엄 플랜", desc: "더 많은 기능과 무제한 생성을 제공해요" }
  ];

  return (
    <section className="section bg-gray-50">
      <div className="container">
        <h2 className="section-title">향후 확장 계획</h2>
        <p className="section-desc">
          더 나은 서비스를 위해 계속 발전해나가겠습니다
        </p>

        <div className="grid-features">
          {futureFeatures.map((feature, index) => (
            <div key={index} className="card card-hover">
              <div style={{fontSize: '2rem', marginBottom: '0.75rem'}}>{feature.icon}</div>
              <h3 style={{
                fontSize: '1.125rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem'
              }}>{feature.title}</h3>
              <p style={{
                color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem'
              }}>{feature.desc}</p>
              <div>
                <span style={{
                  display: 'inline-block',
                  background: '#fef3c7',
                  color: '#92400e',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  Coming Soon
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Footer 컴포넌트
const Footer = () => {
  const navigate = useNavigate();
  
  return (
    <footer className="gradient-bg" style={{padding: '3rem 0'}}>
      <div className="container text-center">
        <div style={{fontSize: '2.5rem', marginBottom: '1rem'}}>🤖</div>
        <h3 style={{
          fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '1rem'
        }}>블로기와 함께 시작하세요</h3>
        <p style={{
          color: 'rgba(255, 255, 255, 0.8)', marginBottom: '2rem'
        }}>
          더 이상 빈 화면을 바라보며 고민하지 마세요. AI가 도와드릴게요!
        </p>
        <button
          className="btn-primary"
          onClick={() => navigate('/')} 
        >
          무료로 시작하기기 →
        </button>
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.2)', 
          paddingTop: '2rem'
        }}>
          <p style={{color: 'rgba(255, 255, 255, 0.6)'}}>
            © 2025 Blogi. All rights reserved. Made with  by 구은재 & 이상인
          </p>
        </div>
      </div>
    </footer>
  );
};

// 메인 About 컴포넌트
const About = () => {
  useEffect(() => {
    injectStyles();
  }, []);

  return (
    <div style={{minHeight: '100vh', background: '#f9fafb'}}>
      <HeroSection />
      <ServiceOverview />
      <UserFlow />
      <Features />
      <Team />
      <TechStack />
      <FuturePlans />
      <Footer />
    </div>
  );
};

export default About;