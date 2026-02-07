import { useState } from 'react';
import { publicApi } from '../api/apiClient';

export default function Contact() {
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    email: '',
    phone: '',
    title: '',
    content: '',
    agreePrivacy: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    '서비스 이용 문의',
    '결제/환불 문의',
    '배송 문의',
    '제휴/협력 문의',
    '기타 문의',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // API를 통해 문의 저장
      await publicApi.submitInquiry({
        category: formData.category,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        title: formData.title,
        content: formData.content,
      });

      setSubmitted(true);
      setFormData({
        category: '',
        name: '',
        email: '',
        phone: '',
        title: '',
        content: '',
        agreePrivacy: false,
      });
    } catch (error) {
      console.error('문의 제출 오류:', error);
      alert('문의 접수 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="py-12 sm:py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-ruby-600/5 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-ruby-500/5 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <span className="text-shimmer">문의하기</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            궁금한 점이나 건의사항을 남겨주세요.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="card p-4 sm:p-5 hover-glow animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-ruby-600/20 rounded-lg text-ruby-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="font-bold">전화 문의</h3>
              </div>
              <p className="text-gray-400 text-sm">1551-7827</p>
              <p className="text-gray-500 text-xs mt-1">평일 09:00 ~ 18:00</p>
            </div>

            <div className="card p-4 sm:p-5 hover-glow animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-ruby-600/20 rounded-lg text-ruby-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-bold">이메일 문의</h3>
              </div>
              <p className="text-gray-400 text-sm">support@rubyround.net</p>
              <p className="text-gray-500 text-xs mt-1">24시간 접수 가능</p>
            </div>

          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="card p-6 sm:p-10 animate-fade-in-up text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">문의가 접수되었습니다</h3>
                <p className="text-gray-400 text-sm sm:text-base mb-2">
                  빠른 시일 내에 답변드리겠습니다.
                </p>
                <p className="text-gray-500 text-xs sm:text-sm mb-6">
                  입력하신 이메일로 답변을 보내드립니다.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-primary px-6 py-2.5 text-sm"
                >
                  추가 문의하기
                </button>
              </div>
            ) : (
            <form onSubmit={handleSubmit} className="card p-4 sm:p-6 animate-fade-in-up opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
              <div className="space-y-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    문의 유형 <span className="text-ruby-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-ruby-500 focus:ring-2 focus:ring-ruby-500/20 transition-all"
                    required
                  >
                    <option value="">선택해주세요</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Name & Email */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      이름 <span className="text-ruby-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-ruby-500 focus:ring-2 focus:ring-ruby-500/20 transition-all"
                      placeholder="이름을 입력하세요"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      이메일 <span className="text-ruby-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-ruby-500 focus:ring-2 focus:ring-ruby-500/20 transition-all"
                      placeholder="이메일을 입력하세요"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    연락처
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-ruby-500 focus:ring-2 focus:ring-ruby-500/20 transition-all"
                    placeholder="연락처를 입력하세요 (선택)"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    제목 <span className="text-ruby-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-ruby-500 focus:ring-2 focus:ring-ruby-500/20 transition-all"
                    placeholder="문의 제목을 입력하세요"
                    required
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    문의 내용 <span className="text-ruby-500">*</span>
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-ruby-500 focus:ring-2 focus:ring-ruby-500/20 transition-all resize-none"
                    placeholder="문의 내용을 상세히 입력해주세요"
                    required
                  />
                </div>

                {/* Privacy Agreement */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="agreePrivacy"
                    checked={formData.agreePrivacy}
                    onChange={(e) => setFormData({ ...formData, agreePrivacy: e.target.checked })}
                    className="mt-1 w-4 h-4 bg-dark-800 border border-dark-600 rounded text-ruby-600 focus:ring-ruby-500"
                    required
                  />
                  <label htmlFor="agreePrivacy" className="text-sm text-gray-400">
                    <span className="text-ruby-500">[필수]</span> 개인정보 수집 및 이용에 동의합니다.
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full btn-primary py-3 sm:py-4 text-sm sm:text-base"
                >
                  문의 접수하기
                </button>
              </div>
            </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
