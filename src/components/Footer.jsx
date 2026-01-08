import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-dark-700 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-ruby-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-ruby-500/5 rounded-full blur-3xl" />

      {/* Floating gems */}
      <div className="absolute top-20 right-[10%] w-3 h-3 bg-gradient-to-br from-ruby-400 to-ruby-600 rotate-45 animate-ruby-rotate opacity-20" />
      <div className="absolute bottom-32 left-[5%] w-2 h-2 bg-gradient-to-br from-ruby-300 to-ruby-500 rotate-45 animate-ruby-rotate opacity-15" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-40 left-[15%] w-1.5 h-1.5 bg-ruby-400 rounded-full animate-sparkle opacity-20" style={{ animationDelay: '0.8s' }} />

      {/* Animated top border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-ruby-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center mb-4 group">
              <div className="relative">
                <img
                  src="/RUBY-ROUND/logo.png"
                  alt="Ruby Round"
                  className="h-8 transition-all duration-500 group-hover:scale-110 group-hover:brightness-125"
                />
                <div className="absolute inset-0 bg-ruby-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </Link>
            <p className="text-gray-400 text-sm max-w-md mb-4 leading-relaxed">
              Ruby Round는 실물 루비 및 보석을 기반으로 한 시즌제 라이브 보석 커머스입니다.
              모든 참여 금액은 시즌 종료 시 실물 보석으로 전환됩니다.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center text-gray-400 hover:text-ruby-500 hover:bg-dark-600 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-ruby-500/20 group"
              >
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.49.5.09.682-.218.682-.486 0-.24-.009-.875-.013-1.713-2.782.602-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.09-.647.349-1.086.635-1.337-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.683-.104-.253-.447-1.27.097-2.646 0 0 .84-.27 2.75 1.025A9.548 9.548 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.376.203 2.394.1 2.646.64.699 1.026 1.592 1.026 2.683 0 3.842-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .27.18.58.688.482C19.138 20.16 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center text-gray-400 hover:text-ruby-500 hover:bg-dark-600 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-ruby-500/20 group"
              >
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center text-gray-400 hover:text-ruby-500 hover:bg-dark-600 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-ruby-500/20 group"
              >
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links - 서비스 */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-ruby-500 rotate-45" />
              서비스
            </h3>
            <ul className="space-y-2">
              {[
                { name: '시즌 참여', href: '/season' },
                { name: '보상 티어', href: '/tiers' },
                { name: '참여 안내', href: '/guide' },
                { name: 'FAQ', href: '/faq' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-gray-400 hover:text-ruby-400 text-sm transition-all duration-300 inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 h-[1px] bg-ruby-500 group-hover:w-3 transition-all duration-300" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links - 법적 고지 */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-ruby-500 rotate-45" />
              법적 고지
            </h3>
            <ul className="space-y-2">
              {[
                { name: '이용약관', href: '#' },
                { name: '개인정보처리방침', href: '#' },
                { name: '사업자정보', href: '#' },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-ruby-400 text-sm transition-all duration-300 inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 h-[1px] bg-ruby-500 group-hover:w-3 transition-all duration-300" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-dark-700 relative">
          {/* Decorative line gradient */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-ruby-500/50 to-transparent" />

          <div className="text-center text-gray-500 text-xs">
            <p className="mb-2 leading-relaxed max-w-3xl mx-auto">
              본 서비스는 확률형 금융상품 또는 사행성 서비스가 아닙니다. 모든 참여비는 실물 보석 구매를 위한 예약금이며,
              시즌 종료 시 반드시 실물 보석 또는 이에 상응하는 적립금으로 제공됩니다.
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="w-1 h-1 bg-ruby-500/50 rounded-full" />
              &copy; {new Date().getFullYear()} Ruby Round. All rights reserved.
              <span className="w-1 h-1 bg-ruby-500/50 rounded-full" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
