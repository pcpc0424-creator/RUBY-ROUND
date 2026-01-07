import { useState } from 'react';
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
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-dark-900/95 backdrop-blur-md border-b border-dark-700">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/RUBY-ROUND/logo.png" alt="Ruby Round" className="h-8 sm:h-10" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === item.href
                    ? 'text-ruby-500 bg-ruby-600/10'
                    : 'text-gray-300 hover:text-white hover:bg-dark-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
              로그인
            </Link>
            <Link to="/season" className="btn-primary text-sm">
              시즌 참여하기
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-dark-700">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === item.href
                      ? 'text-ruby-500 bg-ruby-600/10'
                      : 'text-gray-300 hover:text-white hover:bg-dark-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-dark-700 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-center text-gray-300 hover:text-white transition-colors"
                >
                  로그인 / 회원가입
                </Link>
                <Link
                  to="/season"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary text-sm text-center"
                >
                  시즌 참여하기
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
