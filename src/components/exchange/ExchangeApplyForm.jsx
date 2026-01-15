import { useState, useEffect } from 'react';
import FormInput from '../common/FormInput';
import FormSelect from '../common/FormSelect';
import FormTextarea from '../common/FormTextarea';
import Checkbox from '../common/Checkbox';
import ConsultationSubmitModal from './ConsultationSubmitModal';
import {
  EXCHANGE_CATEGORIES,
  REQUIRED_AGREEMENTS,
  MIN_EXCHANGE_AMOUNT,
} from '../../constants/exchangeConstants';
import { getMyBalance, createApplication } from '../../api/exchangeApi';
import { formatAmount, initializeSampleData } from '../../utils/localStorage';

export default function ExchangeApplyForm({ onComplete, onCancel }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [balance, setBalance] = useState(null);
  const [errors, setErrors] = useState({});
  const [customSpecInput, setCustomSpecInput] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [formData, setFormData] = useState({
    requestedAmount: '',
    category: '',
    specifications: {},
    styleRequest: '',
    delivery: {
      recipientName: '',
      recipientPhone: '',
      postalCode: '',
      address: '',
      addressDetail: '',
    },
    agreements: {
      consultationProcess: false,
      budgetBasedProposal: false,
      cancelRestriction: false,
      exceptionHandling: false,
      privacyConsent: false,
    },
  });

  // 잔액 조회
  useEffect(() => {
    const fetchBalance = async () => {
      initializeSampleData();
      const userEmail = localStorage.getItem('userEmail') || 'test@ruby.com';
      const result = await getMyBalance(userEmail);
      if (result.success) {
        setBalance(result.data);
      }
      setLoading(false);
    };
    fetchBalance();
  }, []);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('agreement_')) {
      const agreementKey = name.replace('agreement_', '');
      setFormData((prev) => ({
        ...prev,
        agreements: {
          ...prev.agreements,
          [agreementKey]: checked,
        },
      }));
    } else if (name.startsWith('delivery_')) {
      const deliveryKey = name.replace('delivery_', '');
      setFormData((prev) => ({
        ...prev,
        delivery: {
          ...prev.delivery,
          [deliveryKey]: value,
        },
      }));
    } else if (name.startsWith('spec_')) {
      const specKey = name.replace('spec_', '');
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specKey]: value,
        },
      }));

      // "직접입력" 선택 시 커스텀 입력 상태 관리
      if (value === '직접입력') {
        setCustomSpecInput((prev) => ({ ...prev, [specKey]: true }));
      } else {
        setCustomSpecInput((prev) => ({ ...prev, [specKey]: false }));
      }
    } else if (name === 'customSpec_') {
      // 직접입력 값 처리는 별도로
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }

    // 에러 초기화
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // 직접입력 값 변경 핸들러
  const handleCustomSpecChange = (specKey, value) => {
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [specKey]: value,
      },
    }));
  };

  // 카테고리 변경 시 사양 초기화
  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      category: value,
      specifications: {},
    }));
    setCustomSpecInput({});
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: null }));
    }
  };

  // 유효성 검사
  const validate = () => {
    const newErrors = {};

    // 금액 검증
    const amount = parseInt(formData.requestedAmount);
    if (!formData.requestedAmount || isNaN(amount)) {
      newErrors.requestedAmount = '사용 예정 교환금을 입력해주세요.';
    } else if (amount < MIN_EXCHANGE_AMOUNT) {
      newErrors.requestedAmount = `최소 ${formatAmount(MIN_EXCHANGE_AMOUNT)} 이상 입력해주세요.`;
    } else if (balance && amount > balance.availableBalance) {
      newErrors.requestedAmount = `사용 가능 잔액(${formatAmount(balance.availableBalance)})을 초과했습니다.`;
    }

    // 카테고리 검증
    if (!formData.category) {
      newErrors.category = '카테고리를 선택해주세요.';
    }

    // 카테고리별 필수 사양 검증
    if (formData.category) {
      const category = EXCHANGE_CATEGORIES[formData.category];
      category.requiredFields.forEach((fieldKey) => {
        const spec = category.specifications[fieldKey];
        if (!formData.specifications[fieldKey]) {
          newErrors[`spec_${fieldKey}`] = `${spec.label}을(를) 입력해주세요.`;
        }
      });
    }

    // 배송 정보 검증
    if (!formData.delivery.recipientName) {
      newErrors.delivery_recipientName = '수령인 성명을 입력해주세요.';
    }
    if (!formData.delivery.recipientPhone) {
      newErrors.delivery_recipientPhone = '연락처를 입력해주세요.';
    }
    if (!formData.delivery.postalCode) {
      newErrors.delivery_postalCode = '우편번호를 입력해주세요.';
    }
    if (!formData.delivery.address) {
      newErrors.delivery_address = '주소를 입력해주세요.';
    }

    // 동의 항목 검증
    REQUIRED_AGREEMENTS.forEach((agreement) => {
      if (agreement.required && !formData.agreements[agreement.key]) {
        newErrors[`agreement_${agreement.key}`] = '필수 동의 항목입니다.';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 제출 버튼 클릭 - 모달 표시
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // 유효성 검사 통과 시 확인 모달 표시
    setShowConfirmModal(true);
  };

  // 모달 확인 - 실제 제출
  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    setSubmitting(true);

    try {
      const userEmail = localStorage.getItem('userEmail') || 'test@ruby.com';
      const userName = localStorage.getItem('userName') || '김루비';

      const applicationData = {
        userId: userEmail,
        userName: userName,
        userEmail: userEmail,
        requestedAmount: parseInt(formData.requestedAmount),
        category: formData.category,
        specifications: formData.specifications,
        styleRequest: formData.styleRequest,
        delivery: formData.delivery,
        agreements: formData.agreements,
      };

      const result = await createApplication(applicationData);

      if (result.success) {
        onComplete(result.data);
      } else {
        alert(result.error || '신청 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('신청 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  // 모달 취소
  const handleCancelModal = () => {
    setShowConfirmModal(false);
  };

  // 현재 선택된 카테고리 정보
  const selectedCategory = formData.category ? EXCHANGE_CATEGORIES[formData.category] : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-ruby-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 안내 배너 */}
      <div className="bg-ruby-600/10 border border-ruby-600/30 rounded-lg p-4">
        <p className="text-ruby-400 text-sm">
          본 신청은 <strong>'상담 접수'</strong>이며 제출 시 교환금은 차감되지 않습니다.
          CS 상담으로 최종 내용 확정 후 대표 승인 시 교환금이 차감되고 제작이 시작됩니다.
        </p>
      </div>

      {/* 교환금 잔액 표시 */}
      {balance && (
        <div className="bg-dark-700/50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">사용 가능 교환금</span>
            <span className="text-2xl font-bold text-ruby-400">
              {formatAmount(balance.availableBalance)}
            </span>
          </div>
        </div>
      )}

      {/* 섹션 1: 교환금 및 카테고리 */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-6 h-6 bg-ruby-600 rounded-full flex items-center justify-center text-sm">1</span>
          예산 및 카테고리
        </h3>

        <FormInput
          label="사용 예정 교환금 (예산)"
          name="requestedAmount"
          type="number"
          value={formData.requestedAmount}
          onChange={handleChange}
          placeholder={`최소 ${formatAmount(MIN_EXCHANGE_AMOUNT)}`}
          required
          error={errors.requestedAmount}
        />

        <FormSelect
          label="카테고리"
          name="category"
          value={formData.category}
          onChange={handleCategoryChange}
          options={Object.values(EXCHANGE_CATEGORIES).map((cat) => ({
            value: cat.key,
            label: `${cat.icon} ${cat.label}`,
          }))}
          placeholder="악세사리 종류를 선택해주세요"
          required
          error={errors.category}
        />
      </div>

      {/* 섹션 2: 카테고리별 필수 사양 */}
      {selectedCategory && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="w-6 h-6 bg-ruby-600 rounded-full flex items-center justify-center text-sm">2</span>
            {selectedCategory.label} 사양
          </h3>

          {Object.values(selectedCategory.specifications).map((spec) => (
            <div key={spec.key}>
              {spec.type === 'select' ? (
                <>
                  <FormSelect
                    label={spec.label}
                    name={`spec_${spec.key}`}
                    value={customSpecInput[spec.key] ? '직접입력' : formData.specifications[spec.key] || ''}
                    onChange={handleChange}
                    options={spec.options}
                    placeholder={spec.placeholder}
                    required={spec.required}
                    error={errors[`spec_${spec.key}`]}
                  />
                  {customSpecInput[spec.key] && (
                    <FormInput
                      label={`${spec.label} 직접 입력`}
                      name={`customSpec_${spec.key}`}
                      value={formData.specifications[spec.key] === '직접입력' ? '' : formData.specifications[spec.key]}
                      onChange={(e) => handleCustomSpecChange(spec.key, e.target.value)}
                      placeholder="직접 입력해주세요"
                      className="mt-2"
                    />
                  )}
                </>
              ) : (
                <FormTextarea
                  label={spec.label}
                  name={`spec_${spec.key}`}
                  value={formData.specifications[spec.key] || ''}
                  onChange={handleChange}
                  placeholder={spec.placeholder}
                  required={spec.required}
                  error={errors[`spec_${spec.key}`]}
                  rows={3}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* 섹션 3: 스타일/요청사항 */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-6 h-6 bg-ruby-600 rounded-full flex items-center justify-center text-sm">3</span>
          스타일/요청사항
        </h3>

        <FormTextarea
          label="원하시는 스타일 및 요청사항"
          name="styleRequest"
          value={formData.styleRequest}
          onChange={handleChange}
          placeholder="원하시는 디자인 스타일, 특별 요청사항 등을 자유롭게 작성해주세요."
          rows={5}
        />
      </div>

      {/* 섹션 4: 배송 정보 */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-6 h-6 bg-ruby-600 rounded-full flex items-center justify-center text-sm">4</span>
          배송 정보
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="수령인 성명"
            name="delivery_recipientName"
            value={formData.delivery.recipientName}
            onChange={handleChange}
            placeholder="실명을 입력해주세요"
            required
            error={errors.delivery_recipientName}
          />
          <FormInput
            label="연락처"
            name="delivery_recipientPhone"
            value={formData.delivery.recipientPhone}
            onChange={handleChange}
            placeholder="010-0000-0000"
            required
            error={errors.delivery_recipientPhone}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormInput
            label="우편번호"
            name="delivery_postalCode"
            value={formData.delivery.postalCode}
            onChange={handleChange}
            placeholder="우편번호"
            required
            error={errors.delivery_postalCode}
          />
          <div className="sm:col-span-2">
            <FormInput
              label="주소"
              name="delivery_address"
              value={formData.delivery.address}
              onChange={handleChange}
              placeholder="기본 주소"
              required
              error={errors.delivery_address}
            />
          </div>
        </div>

        <FormInput
          label="상세 주소"
          name="delivery_addressDetail"
          value={formData.delivery.addressDetail}
          onChange={handleChange}
          placeholder="상세 주소 (동/호수 등)"
        />
      </div>

      {/* 섹션 5: 필수 동의 */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-6 h-6 bg-ruby-600 rounded-full flex items-center justify-center text-sm">5</span>
          필수 동의 사항
        </h3>

        <div className="bg-dark-700/30 rounded-lg p-4 space-y-4">
          {REQUIRED_AGREEMENTS.map((agreement) => (
            <Checkbox
              key={agreement.key}
              label={agreement.title}
              description={agreement.description}
              name={`agreement_${agreement.key}`}
              checked={formData.agreements[agreement.key]}
              onChange={handleChange}
              required={agreement.required}
              error={errors[`agreement_${agreement.key}`]}
            />
          ))}
        </div>
      </div>

      {/* 제출 버튼 */}
      <div className="pt-4 space-y-3">
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 bg-ruby-600 hover:bg-ruby-700 text-white font-semibold rounded-lg
            transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              처리 중...
            </>
          ) : (
            '상담 접수하기'
          )}
        </button>

        <p className="text-center text-sm text-gray-500">
          접수 시 차감 없음 / 대표 승인 시 차감
        </p>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-3 bg-dark-700 hover:bg-dark-600 text-gray-300 font-medium rounded-lg
              transition-all duration-300"
          >
            취소
          </button>
        )}
      </div>

      {/* 상담 접수 확인 모달 */}
      <ConsultationSubmitModal
        isOpen={showConfirmModal}
        onConfirm={handleConfirmSubmit}
        onCancel={handleCancelModal}
      />
    </form>
  );
}
