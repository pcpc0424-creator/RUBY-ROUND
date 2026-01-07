import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center mb-4">
              <img src="/RUBY-ROUND/logo.png" alt="Ruby Round" className="h-8" />
            </Link>
            <p className="text-gray-400 text-sm max-w-md mb-4">
              Ruby Round는 실물 루비 및 보석을 기반으로 한 시즌제 라이브 보석 커머스입니다.
              모든 참여 금액은 시즌 종료 시 실물 보석으로 전환됩니다.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-ruby-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.49.5.09.682-.218.682-.486 0-.24-.009-.875-.013-1.713-2.782.602-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.09-.647.349-1.086.635-1.337-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.683-.104-.253-.447-1.27.097-2.646 0 0 .84-.27 2.75 1.025A9.548 9.548 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.376.203 2.394.1 2.646.64.699 1.026 1.592 1.026 2.683 0 3.842-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .27.18.58.688.482C19.138 20.16 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-ruby-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">서비스</h3>
            <ul className="space-y-2">
              <li><Link to="/season" className="text-gray-400 hover:text-white text-sm transition-colors">시즌 참여</Link></li>
              <li><Link to="/tiers" className="text-gray-400 hover:text-white text-sm transition-colors">보상 티어</Link></li>
              <li><Link to="/guide" className="text-gray-400 hover:text-white text-sm transition-colors">참여 안내</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white text-sm transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">법적 고지</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">이용약관</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">개인정보처리방침</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">사업자정보</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-dark-700">
          <div className="text-center text-gray-500 text-xs">
            <p className="mb-2">
              본 서비스는 확률형 금융상품 또는 사행성 서비스가 아닙니다. 모든 참여비는 실물 보석 구매를 위한 예약금이며,
              시즌 종료 시 반드시 실물 보석 또는 이에 상응하는 적립금으로 제공됩니다.
            </p>
            <p>&copy; {new Date().getFullYear()} Ruby Round. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
