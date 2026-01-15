import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const navigation = [
  {
    name: '이용안내',
    children: [
      { name: '시즌/라운드', href: '/season' },
      { name: '보상(티어)', href: '/tiers' },
      { name: '교환/배송', href: '/exchange' },
    ],
  },
  { name: '참여하기', href: '/participate' },
  { name: '공지사항', href: '/notice' },
  {
    name: '고객센터',
    children: [
      { name: 'FAQ', href: '/faq' },
      { name: '문의하기', href: '/contact' },
      { name: '공지사항', href: '/notice' },
    ],
  },
];

function DropdownMenu({ item, location, closeMenu }) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const isActive = item.children?.some(child => location.pathname === child.href);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`relative px-5 py-2 text-sm font-medium rounded-lg transition-all duration-300 group overflow-hidden flex items-center gap-1.5 ${
          isActive ? 'text-ruby-500' : 'text-gray-300 hover:text-white'
        }`}
      >
        <span className={`absolute inset-0 rounded-lg transition-all duration-300 ${
          isActive ? 'bg-ruby-600/10' : isOpen ? 'bg-dark-700/50' : 'bg-dark-700/0 group-hover:bg-dark-700/50'
        }`} />
        <span className="relative z-10">{item.name}</span>
        <svg
          className={`relative z-10 w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        {isActive && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-ruby-500 rounded-full animate-pulse" />
        )}
      </button>

      {/* Dropdown */}
      <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200 ${
        isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1 pointer-events-none'
      }`}>
        <div className="w-44 bg-dark-800/95 backdrop-blur-sm border border-dark-600 rounded-xl shadow-xl shadow-black/30 overflow-hidden">
          {item.children.map((child, index) => (
            <Link
              key={child.name}
              to={child.href}
              onClick={() => {
                setIsOpen(false);
                closeMenu?.();
              }}
              className={`block px-4 py-3 text-sm font-medium transition-all duration-200 ${
                index !== item.children.length - 1 ? 'border-b border-dark-700/50' : ''
              } ${
                location.pathname === child.href
                  ? 'text-ruby-400 bg-ruby-600/10'
                  : 'text-gray-300 hover:text-white hover:bg-dark-700/50'
              }`}
            >
              {child.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState({});
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  // localStorage에서 로그인 상태 확인
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  // 로그인 상태 변경 감지
  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    };
    window.addEventListener('storage', checkLogin);
    // 페이지 이동 시에도 체크
    checkLogin();
    return () => window.removeEventListener('storage', checkLogin);
  }, [location]);

  // 사용자 메뉴 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setUserMenuOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileDropdown = (name) => {
    setMobileDropdowns(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

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
          <div className="hidden lg:flex items-center gap-6">
            {navigation.map((item, index) => (
              item.children ? (
                <DropdownMenu key={item.name} item={item} location={location} />
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-5 py-2 text-sm font-medium rounded-lg transition-all duration-300 group overflow-hidden ${
                    location.pathname === item.href
                      ? 'text-ruby-500'
                      : 'text-gray-300 hover:text-white'
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <span className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                    location.pathname === item.href
                      ? 'bg-ruby-600/10'
                      : 'bg-dark-700/0 group-hover:bg-dark-700/50'
                  }`} />
                  <span className="relative z-10">{item.name}</span>
                  {location.pathname === item.href && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-ruby-500 rounded-full animate-pulse" />
                  )}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-ruby-600 to-ruby-400 group-hover:w-3/4 transition-all duration-300 rounded-full" />
                </Link>
              )
            ))}
          </div>

          {/* CTA Buttons - 로그인/마이페이지 */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="relative px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 group flex items-center gap-2"
                >
                  <span className={`absolute inset-0 rounded-lg transition-all duration-300 ${userMenuOpen ? 'bg-dark-700/50' : 'bg-dark-700/0 group-hover:bg-dark-700/50'}`} />
                  <svg className="relative z-10 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="relative z-10">{localStorage.getItem('userName') || '마이페이지'}</span>
                  <svg className={`relative z-10 w-3.5 h-3.5 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {/* User Dropdown */}
                <div className={`absolute top-full right-0 mt-2 w-40 bg-dark-800/95 backdrop-blur-sm border border-dark-600 rounded-xl shadow-xl shadow-black/30 overflow-hidden transition-all duration-200 ${
                  userMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'
                }`}>
                  <Link
                    to="/mypage"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-dark-700/50 transition-colors border-b border-dark-700/50"
                  >
                    마이페이지
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-dark-700/50 transition-colors"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="relative px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 group"
              >
                <span className="relative z-10">로그인/회원가입</span>
                <span className="absolute inset-0 rounded-lg bg-dark-700/0 group-hover:bg-dark-700/50 transition-all duration-300" />
              </Link>
            )}
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
          mobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 border-t border-dark-700">
            <div className="flex flex-col gap-1">
              {navigation.map((item, index) => (
                item.children ? (
                  <div key={item.name}>
                    <button
                      onClick={() => toggleMobileDropdown(item.name)}
                      className={`w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 flex items-center justify-between ${
                        mobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                      } ${
                        item.children.some(child => location.pathname === child.href)
                          ? 'text-ruby-500 bg-ruby-600/10'
                          : 'text-gray-300 hover:text-white hover:bg-dark-700'
                      }`}
                      style={{ transitionDelay: `${index * 0.05}s` }}
                    >
                      <span>{item.name}</span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 ${mobileDropdowns[item.name] ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${
                      mobileDropdowns[item.name] ? 'max-h-48' : 'max-h-0'
                    }`}>
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block pl-8 pr-4 py-2 text-sm font-medium transition-all duration-300 ${
                            location.pathname === child.href
                              ? 'text-ruby-500'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
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
                )
              ))}
              <div className={`mt-4 pt-4 border-t border-dark-700 flex flex-col gap-2 transition-all duration-500 ${
                mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`} style={{ transitionDelay: '0.3s' }}>
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/mypage"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 text-sm font-medium text-center text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-dark-700 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      마이페이지
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="px-4 py-3 text-sm font-medium text-center text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-dark-700"
                    >
                      로그아웃
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-medium text-center text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-dark-700"
                  >
                    로그인 / 회원가입
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
