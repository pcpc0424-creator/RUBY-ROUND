export default function SocialSidebar() {
  return (
    <div className="fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50">
      <div className="relative bg-dark-800/90 backdrop-blur-xl border border-dark-600/60 rounded-2xl p-2.5 sm:p-4 shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
        {/* 상단 루비 장식 라인 */}
        <div className="absolute -top-px left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-ruby-500/60 to-transparent rounded-full" />

        {/* SNS 타이틀 */}
        <p className="text-[8px] sm:text-[10px] text-gray-500 text-center tracking-widest uppercase mb-2 sm:mb-3">Follow</p>

        <div className="flex flex-col items-center gap-2 sm:gap-3">
          {/* 카카오톡 */}
          <a
            href="http://pf.kakao.com/_xiJqhX/chat"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="카카오톡 채널"
            className="group flex flex-col items-center gap-1 sm:gap-1.5"
          >
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-dark-700/80 border border-dark-600/40 flex items-center justify-center transition-all duration-300 group-hover:bg-[#FEE500]/15 group-hover:border-[#FEE500]/30 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(254,229,0,0.15)]">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-all duration-300 group-hover:text-[#FEE500]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12,3c5.8,0,10.5,3.7,10.5,8.3c0,4.6-4.7,8.3-10.5,8.3c-1,0-2-0.1-2.9-0.4l-4.5,3l0.9-4.4C3.2,16,2,13.8,2,11.3C2,6.7,6.7,3,12,3z" />
              </svg>
            </div>
            <span className="text-[8px] sm:text-[10px] text-gray-500 transition-colors duration-300 group-hover:text-[#FEE500]">카카오톡</span>
          </a>

          {/* 구분선 */}
          <div className="w-4 sm:w-6 h-px bg-gradient-to-r from-transparent via-dark-500 to-transparent" />

          {/* 인스타그램 */}
          <a
            href="https://www.instagram.com/rubyround_7827"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="인스타그램"
            className="group flex flex-col items-center gap-1 sm:gap-1.5"
          >
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-dark-700/80 border border-dark-600/40 flex items-center justify-center transition-all duration-300 group-hover:bg-[#E4405F]/15 group-hover:border-[#E4405F]/30 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(228,64,95,0.15)]">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-all duration-300 group-hover:text-[#E4405F]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </div>
            <span className="text-[8px] sm:text-[10px] text-gray-500 transition-colors duration-300 group-hover:text-[#E4405F]">인스타그램</span>
          </a>

          {/* 구분선 */}
          <div className="w-4 sm:w-6 h-px bg-gradient-to-r from-transparent via-dark-500 to-transparent" />

          {/* 페이스북 */}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="페이스북"
            className="group flex flex-col items-center gap-1 sm:gap-1.5"
          >
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-dark-700/80 border border-dark-600/40 flex items-center justify-center transition-all duration-300 group-hover:bg-[#1877F2]/15 group-hover:border-[#1877F2]/30 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(24,119,242,0.15)]">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-all duration-300 group-hover:text-[#1877F2]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <span className="text-[8px] sm:text-[10px] text-gray-500 transition-colors duration-300 group-hover:text-[#1877F2]">페이스북</span>
          </a>
        </div>

        {/* 하단 루비 장식 라인 */}
        <div className="absolute -bottom-px left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-ruby-500/40 to-transparent rounded-full" />
      </div>
    </div>
  );
}
