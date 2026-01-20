import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NoticeBar from './NoticeBar';
import Header from './Header';
import Footer from './Footer';

// 페이지 이동 시 스크롤 상단으로 이동
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <NoticeBar />
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
