import { NavLink } from 'react-router-dom';
import { getAdminAuth } from '../../api/exchangeApi';

const menuItems = [
  {
    id: 'dashboard',
    name: '대시보드',
    path: '/admin',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    roles: ['ceo', 'cs_manager'],
  },
  {
    id: 'users',
    name: '사용자 관리',
    path: '/admin/users',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    roles: ['ceo'],
  },
  {
    id: 'exchange',
    name: '교환 관리',
    path: '/admin/exchange',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    roles: ['ceo', 'cs_manager'],
  },
];

export default function AdminSidebar({ isOpen, onClose }) {
  const auth = getAdminAuth();
  const userRole = auth?.role || '';

  const filteredMenuItems = menuItems.filter(item =>
    item.roles.includes(userRole)
  );

  const handleNavClick = () => {
    // 모바일에서 메뉴 클릭 시 사이드바 닫기
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* 모바일 오버레이 */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* 사이드바 */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-dark-800 border-r border-dark-600
          transform transition-transform duration-300 ease-in-out
          lg:transform-none lg:min-h-[calc(100vh-73px)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* 모바일 헤더 */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-dark-600">
          <h2 className="text-lg font-bold text-white">
            Ruby<span className="text-ruby-500">Round</span>
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 네비게이션 */}
        <nav className="p-4">
          <ul className="space-y-2">
            {filteredMenuItems.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  end={item.path === '/admin'}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-ruby-600/20 text-ruby-400'
                        : 'text-gray-400 hover:bg-dark-700 hover:text-white'
                    }`
                  }
                >
                  {item.icon}
                  <span className="font-medium text-sm">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* 역할 정보 */}
        <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-dark-600">
          <div className="text-xs text-gray-500">
            {auth?.role === 'ceo' && (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rounded-full"></span>
                대표 권한: 상담확정 / 승인(차감)
              </div>
            )}
            {auth?.role === 'cs_manager' && (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                CS 권한: 상담확정
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
