import { useState } from 'react';

const notices = [
  {
    id: 1,
    category: '공지',
    title: 'Ruby Round Season 1 오픈 안내',
    content: 'Ruby Round의 첫 번째 시즌이 시작되었습니다. 많은 참여 부탁드립니다. 시즌 1은 총 5개의 라운드로 구성되며, 다양한 루비 보석을 획득할 수 있는 기회가 주어집니다.',
    date: '2026-01-15',
    important: true,
  },
  {
    id: 2,
    category: '이벤트',
    title: 'Round 1 무료 체험 이벤트',
    content: '신규 회원을 위한 Round 1 무료 체험 이벤트를 진행합니다. 가입 후 첫 라운드에 무료로 참여하고 루비 보석을 받아보세요!',
    date: '2026-01-14',
    important: true,
  },
  {
    id: 3,
    category: '공지',
    title: '서비스 이용약관 개정 안내',
    content: '더 나은 서비스 제공을 위해 이용약관이 일부 개정되었습니다. 변경된 내용은 마이페이지에서 확인하실 수 있습니다.',
    date: '2026-01-10',
    important: false,
  },
  {
    id: 4,
    category: '업데이트',
    title: '앱 버전 1.0.1 업데이트 안내',
    content: '사용자 편의성 개선 및 버그 수정이 포함된 새로운 버전이 출시되었습니다.',
    date: '2026-01-08',
    important: false,
  },
  {
    id: 5,
    category: '공지',
    title: '고객센터 운영시간 안내',
    content: '고객센터는 평일 09:00 ~ 18:00 운영됩니다. 주말 및 공휴일은 휴무입니다.',
    date: '2026-01-05',
    important: false,
  },
];

function NoticeItem({ notice }) {
  const [isOpen, setIsOpen] = useState(false);

  const getCategoryStyle = (category) => {
    switch (category) {
      case '공지':
        return 'bg-ruby-600/20 text-ruby-400';
      case '이벤트':
        return 'bg-amber-600/20 text-amber-400';
      case '업데이트':
        return 'bg-blue-600/20 text-blue-400';
      default:
        return 'bg-gray-600/20 text-gray-400';
    }
  };

  return (
    <div className={`border-b border-dark-700 last:border-0 ${notice.important ? 'bg-ruby-950/20' : ''}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 sm:py-5 px-4 flex items-center justify-between text-left hover:bg-dark-800/50 transition-colors"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {notice.important && (
            <div className="w-2 h-2 bg-ruby-500 rounded-full animate-pulse flex-shrink-0" />
          )}
          <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${getCategoryStyle(notice.category)}`}>
            {notice.category}
          </span>
          <span className="font-medium text-sm sm:text-base truncate">{notice.title}</span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-3">
          <span className="text-gray-500 text-xs sm:text-sm hidden sm:block">{notice.date}</span>
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-ruby-500' : 'text-gray-500'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 sm:pb-5">
          <p className="text-gray-400 text-sm leading-relaxed mb-2">{notice.content}</p>
          <span className="text-gray-500 text-xs sm:hidden">{notice.date}</span>
        </div>
      </div>
    </div>
  );
}

export default function Notice() {
  const [filter, setFilter] = useState('전체');
  const categories = ['전체', '공지', '이벤트', '업데이트'];

  const filteredNotices = filter === '전체'
    ? notices
    : notices.filter(notice => notice.category === filter);

  return (
    <div className="py-12 sm:py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-ruby-600/5 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-ruby-500/5 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <span className="text-shimmer">공지사항</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            Ruby Round의 새로운 소식을 확인하세요.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                filter === category
                  ? 'bg-ruby-600 text-white'
                  : 'bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Notice List */}
        <div className="card overflow-hidden animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
          {filteredNotices.length > 0 ? (
            filteredNotices.map((notice) => (
              <NoticeItem key={notice.id} notice={notice} />
            ))
          ) : (
            <div className="py-12 text-center text-gray-500">
              해당 카테고리의 공지사항이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
