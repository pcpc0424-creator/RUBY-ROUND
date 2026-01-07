import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // 실제 구현에서는 API 호출
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20">
      <div className="max-w-md w-full mx-auto px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 relative">
            <div className="absolute inset-0 bg-ruby-600 rounded-lg rotate-45" />
            <div className="absolute inset-1.5 bg-ruby-400/30 rounded-md rotate-45" />
          </div>
          <span className="text-2xl font-bold tracking-tight">
            Ruby <span className="text-ruby-500">Round</span>
          </span>
        </Link>

        {/* Tab */}
        <div className="flex bg-dark-800 rounded-xl p-1 mb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              isLogin ? 'bg-ruby-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              !isLogin ? 'bg-ruby-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            회원가입
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                이름
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-ruby-500 transition-colors"
                placeholder="이름을 입력하세요"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              이메일
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-ruby-500 transition-colors"
              placeholder="이메일을 입력하세요"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              비밀번호
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-ruby-500 transition-colors"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-ruby-500 transition-colors"
                  placeholder="비밀번호를 다시 입력하세요"
                  required
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  className="mt-1 w-4 h-4 bg-dark-800 border border-dark-600 rounded text-ruby-600 focus:ring-ruby-500"
                  required
                />
                <label htmlFor="agreeTerms" className="text-sm text-gray-400">
                  <a href="#" className="text-ruby-400 hover:underline">이용약관</a> 및{' '}
                  <a href="#" className="text-ruby-400 hover:underline">개인정보처리방침</a>에 동의합니다.
                </label>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full btn-primary py-4 text-lg"
          >
            {isLogin ? '로그인' : '회원가입'}
          </button>
        </form>

        {isLogin && (
          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-gray-400 hover:text-ruby-400 transition-colors">
              비밀번호를 잊으셨나요?
            </a>
          </div>
        )}

        {/* Social Login */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-dark-900 text-gray-500">또는</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg hover:border-dark-500 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
                <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
                <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7## 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
              </svg>
              <span className="text-sm text-gray-300">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-[#FEE500] rounded-lg hover:bg-[#FDD800] transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#000" d="M12,3c5.8,0,10.5,3.7,10.5,8.3c0,4.6-4.7,8.3-10.5,8.3c-1,0-2-0.1-2.9-0.4l-4.5,3l0.9-4.4C3.2,16,2,13.8,2,11.3C2,6.7,6.7,3,12,3z"/>
              </svg>
              <span className="text-sm text-dark-900 font-medium">카카오</span>
            </button>
          </div>
        </div>

        {/* Notice */}
        <p className="mt-8 text-center text-xs text-gray-500">
          Ruby Round 계정으로 시즌에 참여하고<br />
          실물 루비 보석을 받아보세요.
        </p>
      </div>
    </div>
  );
}
