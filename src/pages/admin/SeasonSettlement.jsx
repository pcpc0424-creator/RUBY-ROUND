import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getSeasons,
  getRoundsBySeason,
  getSettlementPreview,
  executeSettlement,
  getSettlements,
} from '../../api/seasonApi';
import { getAdminAuth } from '../../api/exchangeApi';

export default function SeasonSettlement() {
  const [seasons, setSeasons] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [rounds, setRounds] = useState([]);
  const [settlementType, setSettlementType] = useState('with_winner');
  const [winningRoundId, setWinningRoundId] = useState('');
  const [winningValue, setWinningValue] = useState('');
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('settlement'); // 'settlement' | 'history'

  const auth = getAdminAuth();
  const isCeo = auth?.role === 'ceo';

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedSeason) {
      loadRounds(selectedSeason);
    }
  }, [selectedSeason]);

  const loadData = async () => {
    const [seasonsRes, settlementsRes] = await Promise.all([
      getSeasons(),
      getSettlements(),
    ]);
    if (seasonsRes.success) {
      setSeasons(seasonsRes.data);
    }
    if (settlementsRes.success) {
      setSettlements(settlementsRes.data);
    }
  };

  const loadRounds = async (seasonId) => {
    const res = await getRoundsBySeason(seasonId);
    if (res.success) {
      setRounds(res.data);
    }
  };

  const handlePreview = async () => {
    setError('');
    setPreview(null);

    if (!selectedSeason) {
      setError('시즌을 선택해주세요.');
      return;
    }

    if (settlementType === 'with_winner') {
      if (!winningRoundId) {
        setError('당첨 라운드를 선택해주세요.');
        return;
      }
      if (!winningValue || parseInt(winningValue) < 0) {
        setError('당첨가액을 입력해주세요. (0 이상)');
        return;
      }
    }

    setIsLoading(true);
    const res = await getSettlementPreview(
      selectedSeason,
      settlementType,
      settlementType === 'with_winner' ? winningRoundId : null,
      settlementType === 'with_winner' ? parseInt(winningValue) : 0
    );
    setIsLoading(false);

    if (res.success) {
      setPreview(res.data);
    } else {
      setError(res.error);
    }
  };

  const handleExecute = async () => {
    if (!preview) return;
    if (!isCeo) {
      setError('정산 확정은 대표 권한만 가능합니다.');
      return;
    }

    if (!window.confirm('정산을 확정하시겠습니까? 이 작업은 취소할 수 없습니다.')) {
      return;
    }

    setIsExecuting(true);
    setError('');

    const res = await executeSettlement(
      selectedSeason,
      settlementType,
      settlementType === 'with_winner' ? winningRoundId : null,
      settlementType === 'with_winner' ? parseInt(winningValue) : 0,
      auth?.name || 'admin'
    );

    setIsExecuting(false);

    if (res.success) {
      setResult(res.data);
      setPreview(null);
      loadData(); // 데이터 새로고침
    } else {
      setError(res.error);
    }
  };

  const resetForm = () => {
    setSelectedSeason('');
    setSettlementType('with_winner');
    setWinningRoundId('');
    setWinningValue('');
    setPreview(null);
    setResult(null);
    setError('');
  };

  const selectedSeasonData = seasons.find(s => s.id === selectedSeason);
  const isAlreadySettled = selectedSeasonData?.isSettled;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">시즌 정산</h1>
          <p className="text-gray-400 text-sm mt-1">시즌 종료 시 고객별 교환금을 자동 적립합니다.</p>
        </div>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 border-b border-dark-600">
        <button
          onClick={() => setActiveTab('settlement')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'settlement'
              ? 'border-ruby-500 text-ruby-400'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          정산 실행
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-ruby-500 text-ruby-400'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          정산 내역
        </button>
      </div>

      {activeTab === 'settlement' ? (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* 정산 설정 */}
          <div className="card p-6 space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <div className="w-2 h-2 bg-ruby-500 rotate-45" />
              정산 설정
            </h2>

            {/* 시즌 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">시즌 선택 *</label>
              <select
                value={selectedSeason}
                onChange={(e) => {
                  setSelectedSeason(e.target.value);
                  setPreview(null);
                  setResult(null);
                }}
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-ruby-500"
                disabled={isExecuting}
              >
                <option value="">시즌을 선택하세요</option>
                {seasons.map(season => (
                  <option key={season.id} value={season.id}>
                    {season.name} - {season.title} {season.isSettled ? '(정산완료)' : ''}
                  </option>
                ))}
              </select>
              {isAlreadySettled && (
                <p className="text-yellow-400 text-sm mt-2">
                  이 시즌은 이미 정산이 완료되었습니다.
                </p>
              )}
            </div>

            {/* 정산 유형 */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">정산 유형 *</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 bg-dark-700 rounded-lg cursor-pointer hover:bg-dark-600 transition-colors">
                  <input
                    type="radio"
                    value="with_winner"
                    checked={settlementType === 'with_winner'}
                    onChange={(e) => setSettlementType(e.target.value)}
                    className="text-ruby-500 focus:ring-ruby-500"
                    disabled={isExecuting || isAlreadySettled}
                  />
                  <div>
                    <p className="font-medium">당첨 라운드 있음</p>
                    <p className="text-sm text-gray-400">특정 라운드 참여자만 당첨 처리</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-dark-700 rounded-lg cursor-pointer hover:bg-dark-600 transition-colors">
                  <input
                    type="radio"
                    value="no_winner"
                    checked={settlementType === 'no_winner'}
                    onChange={(e) => setSettlementType(e.target.value)}
                    className="text-ruby-500 focus:ring-ruby-500"
                    disabled={isExecuting || isAlreadySettled}
                  />
                  <div>
                    <p className="font-medium">당첨 라운드 없음</p>
                    <p className="text-sm text-gray-400">전체 미당첨 - 누적 참여비 전액 적립</p>
                  </div>
                </label>
              </div>
            </div>

            {/* 당첨 라운드 선택 (조건부) */}
            {settlementType === 'with_winner' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">당첨 라운드 *</label>
                  <select
                    value={winningRoundId}
                    onChange={(e) => setWinningRoundId(e.target.value)}
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-ruby-500"
                    disabled={isExecuting || isAlreadySettled || !selectedSeason}
                  >
                    <option value="">라운드를 선택하세요</option>
                    {rounds.map(round => (
                      <option key={round.id} value={round.id}>
                        {round.number} - {round.title} (₩{round.price?.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">당첨가액 (원) *</label>
                  <input
                    type="number"
                    value={winningValue}
                    onChange={(e) => setWinningValue(e.target.value)}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-ruby-500"
                    disabled={isExecuting || isAlreadySettled}
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    당첨 라운드 참여자의 누적 참여비에서 차감할 금액
                  </p>
                </div>
              </>
            )}

            {error && (
              <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* 버튼 */}
            <div className="flex gap-3">
              <button
                onClick={handlePreview}
                disabled={isLoading || isExecuting || isAlreadySettled}
                className="flex-1 btn-secondary py-3"
              >
                {isLoading ? '계산 중...' : '정산 미리보기'}
              </button>
              {preview && (
                <button
                  onClick={resetForm}
                  className="px-4 py-3 text-gray-400 hover:text-white transition-colors"
                >
                  초기화
                </button>
              )}
            </div>
          </div>

          {/* 미리보기 / 결과 */}
          <div className="card p-6 space-y-6">
            {result ? (
              // 정산 완료 결과
              <>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-green-400">정산 완료</h2>
                    <p className="text-sm text-gray-400">교환금이 성공적으로 적립되었습니다.</p>
                  </div>
                </div>

                <div className="bg-dark-700 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">시즌</span>
                    <span>{result.summary.seasonId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">정산 유형</span>
                    <span>{result.summary.settlementType === 'with_winner' ? '당첨 라운드 있음' : '당첨 라운드 없음'}</span>
                  </div>
                  {result.summary.winningRoundId && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-400">당첨 라운드</span>
                        <span>{result.summary.winningRoundId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">당첨가액</span>
                        <span>₩{result.summary.winningValue?.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                  <div className="border-t border-dark-600 pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">총 참여 고객</span>
                      <span>{result.summary.totalCustomers}명</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">당첨 라운드 참여자</span>
                      <span className="text-ruby-400">{result.summary.winnerCount}명</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">미참여자 (전액 적립)</span>
                      <span className="text-blue-400">{result.summary.nonWinnerCount}명</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">적립 0원 고객</span>
                      <span>{result.summary.zeroAmountCount}명</span>
                    </div>
                  </div>
                  <div className="border-t border-dark-600 pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">총 누적 참여비</span>
                      <span>₩{result.summary.totalPaidAmount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span className="text-ruby-400">총 교환금 적립</span>
                      <span className="text-ruby-400">₩{result.summary.totalCreditAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button onClick={resetForm} className="w-full btn-primary py-3">
                  새 정산 진행
                </button>
              </>
            ) : preview ? (
              // 미리보기
              <>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <div className="w-2 h-2 bg-ruby-500 rotate-45" />
                  정산 미리보기
                </h2>

                <div className="bg-dark-700 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">시즌</span>
                    <span>{preview.seasonId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">정산 유형</span>
                    <span>{preview.settlementType === 'with_winner' ? '당첨 라운드 있음' : '당첨 라운드 없음'}</span>
                  </div>
                  {preview.winningRoundId && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-400">당첨 라운드</span>
                        <span>{preview.winningRoundId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">당첨가액</span>
                        <span>₩{preview.winningValue?.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                  <div className="border-t border-dark-600 pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">총 참여 고객</span>
                      <span>{preview.totalCustomers}명</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">당첨 라운드 참여자</span>
                      <span className="text-ruby-400">{preview.winnerCount}명</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">미참여자 (전액 적립)</span>
                      <span className="text-blue-400">{preview.nonWinnerCount}명</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">적립 0원 예상</span>
                      <span>{preview.zeroAmountCount}명</span>
                    </div>
                  </div>
                  <div className="border-t border-dark-600 pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">총 누적 참여비</span>
                      <span>₩{preview.totalPaidAmount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span className="text-ruby-400">총 교환금 적립 예상</span>
                      <span className="text-ruby-400">₩{preview.totalCreditAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* 고객별 상세 */}
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-3">고객별 상세</h3>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {preview.customerResults.map((customer, index) => (
                      <div key={index} className="bg-dark-700 rounded-lg p-3 text-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{customer.userName}</span>
                            {customer.isWinnerRoundParticipant ? (
                              <span className="px-2 py-0.5 text-xs rounded bg-ruby-600/20 text-ruby-400">당첨 라운드 참여</span>
                            ) : (
                              <span className="px-2 py-0.5 text-xs rounded bg-blue-600/20 text-blue-400">미참여 (전액 적립)</span>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between text-gray-400">
                          <span>누적 참여비</span>
                          <span>₩{customer.totalPaid?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>적립 예정</span>
                          <span className={customer.creditAmount > 0 ? 'text-green-400' : 'text-gray-500'}>
                            ₩{customer.creditAmount?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {isCeo ? (
                  <button
                    onClick={handleExecute}
                    disabled={isExecuting}
                    className="w-full btn-primary py-3"
                  >
                    {isExecuting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        정산 처리 중...
                      </span>
                    ) : (
                      '시즌 종료 확정 (정산 확정)'
                    )}
                  </button>
                ) : (
                  <div className="p-4 bg-yellow-900/20 border border-yellow-900/50 rounded-lg text-yellow-400 text-sm text-center">
                    정산 확정은 대표 권한만 가능합니다.
                  </div>
                )}
              </>
            ) : (
              // 초기 상태
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-400">시즌과 정산 조건을 선택한 후</p>
                <p className="text-gray-400">"정산 미리보기" 버튼을 클릭하세요.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // 정산 내역 탭
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">정산 ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">시즌</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">정산 유형</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">참여 고객</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">총 적립금</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">정산일시</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">처리자</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {settlements.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-12 text-center text-gray-400">
                      정산 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  settlements.map((settlement) => (
                    <tr key={settlement.id} className="hover:bg-dark-700/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono">{settlement.id}</td>
                      <td className="px-4 py-3 text-sm">{settlement.seasonId}</td>
                      <td className="px-4 py-3 text-sm">
                        {settlement.settlementType === 'with_winner' ? (
                          <span className="px-2 py-1 text-xs rounded bg-ruby-600/20 text-ruby-400">
                            당첨 라운드 있음
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded bg-blue-600/20 text-blue-400">
                            전체 미당첨
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">{settlement.totalCustomers}명</td>
                      <td className="px-4 py-3 text-sm text-right text-ruby-400 font-medium">
                        ₩{settlement.totalCreditAmount?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {new Date(settlement.createdAt).toLocaleString('ko-KR')}
                      </td>
                      <td className="px-4 py-3 text-sm">{settlement.createdBy}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 안내 박스 */}
      <div className="card bg-dark-800/50 border-yellow-900/30 p-6">
        <h3 className="font-bold text-yellow-500 flex items-center gap-2 mb-4">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          정산 규칙 안내
        </h3>
        <ul className="space-y-2 text-sm text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-yellow-500">1.</span>
            <span><strong className="text-white">당첨 라운드 참여자:</strong> 누적 참여비 - 당첨가액 = 교환금 적립 (음수면 0)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500">2.</span>
            <span><strong className="text-white">당첨 라운드 미참여자:</strong> 누적 참여비 전액 교환금 적립</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500">3.</span>
            <span><strong className="text-white">당첨 라운드 없음:</strong> 모든 고객 누적 참여비 전액 적립</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500">4.</span>
            <span>정산 확정 후에는 재실행이 불가능합니다.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
