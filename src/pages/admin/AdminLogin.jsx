import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { adminLogin, getAdminAuth } from '../../api/exchangeApi';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 이미 로그인되어 있으면 대시보드로
  const auth = getAdminAuth();
  if (auth) {
    return <Navigate to="/admin" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await adminLogin(formData.email, formData.password);

    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 로고 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Ruby<span className="text-ruby-500">Round</span>
          </h1>
          <p className="text-gray-400 mt-2">관리자 로그인</p>
        </div>

        {/* 로그인 폼 */}
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                이메일
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg
                  text-white placeholder-gray-500
                  focus:outline-none focus:border-ruby-500 transition-colors"
                placeholder="admin@rubyround.net"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                비밀번호
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg
                  text-white placeholder-gray-500
                  focus:outline-none focus:border-ruby-500 transition-colors"
                placeholder="********"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-ruby-600 hover:bg-ruby-700 text-white font-semibold rounded-lg
                transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  로그인 중...
                </>
              ) : (
                '로그인'
              )}
            </button>
          </form>

          {/* 테스트 계정 안내 */}
          <div className="mt-6 pt-6 border-t border-dark-600">
            <p className="text-gray-500 text-sm mb-3">테스트 계정</p>
            <div className="space-y-2 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>대표 (승인 권한)</span>
                <span className="font-mono">admin@rubyround.net / admin1234</span>
              </div>
              <div className="flex justify-between">
                <span>CS 매니저</span>
                <span className="font-mono">cs@rubyround.net / cs1234</span>
              </div>
            </div>
          </div>
        </div>

        {/* 고객 사이트 링크 */}
        <div className="text-center mt-6">
          <a href="/" className="text-gray-400 hover:text-ruby-400 text-sm transition-colors">
            고객 사이트로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
}
