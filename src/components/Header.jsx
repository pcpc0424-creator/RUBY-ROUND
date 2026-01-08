import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navigation = [
  { name: '시즌 진행 중', href: '/season' },
  { name: '서비스 소개', href: '/about' },
  { name: '보상 티어', href: '/tiers' },
  { name: '참여 안내', href: '/guide' },
  { name: 'FAQ', href: '/faq' },
  { name: '마이페이지', href: '/mypage' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-dark-900/98 backdrop-blur-xl shadow-lg shadow-ruby-900/10'
        : 'bg-dark-900/95 backdrop-blur-md'
    } border-b border-dark-700`}>
      {/* Animated top border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-ruby-500/50 to-transparent animate-shimmer" />

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center group"
          >
            <div className="relative">
              <img
                src="/RUBY-ROUND/logo.png"
                alt="Ruby Round"
                className="h-8 sm:h-10 transition-all duration-500 group-hover:scale-110 group-hover:brightness-125"
              />
              <div className="absolute inset-0 bg-ruby-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 group overflow-hidden ${
                  location.pathname === item.href
                    ? 'text-ruby-500'
                    : 'text-gray-300 hover:text-white'
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Background hover effect */}
                <span className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                  location.pathname === item.href
                    ? 'bg-ruby-600/10'
                    : 'bg-dark-700/0 group-hover:bg-dark-700/50'
                }`} />

                {/* Text */}
                <span className="relative z-10">{item.name}</span>

                {/* Active indicator */}
                {location.pathname === item.href && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-ruby-500 rounded-full animate-pulse" />
                )}

                {/* Hover underline effect */}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-ruby-600 to-ruby-400 group-hover:w-3/4 transition-all duration-300 rounded-full" />
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/login"
              className="relative px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 group"
            >
              <span className="relative z-10">로그인</span>
              <span className="absolute inset-0 rounded-lg bg-dark-700/0 group-hover:bg-dark-700/50 transition-all duration-300" />
            </Link>
            <Link
              to="/season"
              className="btn-primary text-sm relative overflow-hidden group"
            >
              <span className="relative z-10">시즌 참여하기</span>
              <div className="absolute inset-0 bg-gradient-to-r from-ruby-700 to-ruby-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 animate-shimmer opacity-30" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors relative group"
          >
            <div className="absolute inset-0 bg-ruby-600/0 group-hover:bg-ruby-600/10 rounded-lg transition-all duration-300" />
            <svg className="w-6 h-6 relative z-10 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                  className="animate-fade-in-scale"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${
          mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 border-t border-dark-700">
            <div className="flex flex-col gap-1">
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 transform ${
                    mobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                  } ${
                    location.pathname === item.href
                      ? 'text-ruby-500 bg-ruby-600/10'
                      : 'text-gray-300 hover:text-white hover:bg-dark-700'
                  }`}
                  style={{ transitionDelay: `${index * 0.05}s` }}
                >
                  <span className="flex items-center gap-2">
                    {location.pathname === item.href && (
                      <span className="w-1.5 h-1.5 bg-ruby-500 rounded-full animate-pulse" />
                    )}
                    {item.name}
                  </span>
                </Link>
              ))}
              <div className={`mt-4 pt-4 border-t border-dark-700 flex flex-col gap-2 transition-all duration-500 ${
                mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`} style={{ transitionDelay: '0.3s' }}>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-center text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-dark-700"
                >
                  로그인 / 회원가입
                </Link>
                <Link
                  to="/season"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary text-sm text-center relative overflow-hidden group"
                >
                  <span className="relative z-10">시즌 참여하기</span>
                  <div className="absolute inset-0 animate-shimmer opacity-30" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
