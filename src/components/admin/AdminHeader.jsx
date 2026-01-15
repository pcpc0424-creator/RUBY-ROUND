import { useNavigate } from 'react-router-dom';
import { adminLogout, getAdminAuth } from '../../api/exchangeApi';

export default function AdminHeader({ onMenuClick }) {
  const navigate = useNavigate();
  const auth = getAdminAuth();

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  return (
    <header className="bg-dark-800 border-b border-dark-600 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* 모바일 햄버거 메뉴 */}
          <button
            onClick={onMenuClick}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <h1 className="text-lg sm:text-xl font-bold text-white">
            Ruby<span className="text-ruby-500">Round</span>
            <span className="text-gray-500 text-xs sm:text-sm font-normal ml-1 sm:ml-2">Admin</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {auth && (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-white font-medium">{auth.name}</p>
                <p className="text-xs text-gray-400">
                  {auth.role === 'ceo' ? '대표' : 'CS 매니저'}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-ruby-600/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-ruby-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
          >
            <span className="hidden sm:inline">로그아웃</span>
            <svg className="w-5 h-5 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
