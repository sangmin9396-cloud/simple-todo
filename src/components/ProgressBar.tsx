/**
 * 진행률 표시 컴포넌트
 * 전체 할일 대비 완료된 할일의 진행률을 표시합니다.
 */

interface ProgressBarProps {
  /** 전체 할일 수 */
  total: number;
  /** 완료된 할일 수 */
  completed: number;
  /** 남은 할일 수 */
  pending: number;
  /** 반복 할일 수 */
  recurring: number;
  /** 진행률 퍼센트 */
  percentage: number;
}

export function ProgressBar({ total, completed, pending, recurring, percentage }: ProgressBarProps) {
  // 진행률에 따른 색상 변경
  const getProgressColor = () => {
    if (percentage === 0) return 'from-gray-400 to-gray-500';
    if (percentage < 50) return 'from-yellow-400 to-orange-500';
    if (percentage < 100) return 'from-green-400 to-green-500';
    return 'from-indigo-400 to-purple-500';
  };

  // 완료 시 축하 메시지
  const getCompletionMessage = () => {
    if (total === 0) return '할일을 추가해보세요!';
    if (percentage === 100) return '모든 할일을 완료했습니다! 🎉';
    if (percentage >= 75) return '훌륭해요! 조금만 더 힘내요! 💪';
    if (percentage >= 50) return '잘하고 있어요! 계속하세요! 🌟';
    return '조금씩 진행해봐요! 🚀';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📊</span>
          <span className="text-lg font-bold text-gray-700">진행 상황</span>
        </div>
        <div className="text-right">
          <span className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {percentage}%
          </span>
        </div>
      </div>

      {/* 원형 프로그레스 바 */}
      <div className="relative w-32 h-32 mx-auto mb-6">
        {/* 배경 원 */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="#e5e7eb"
            strokeWidth="16"
            fill="none"
          />
          {/* 진행 원 */}
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="url(#progressGradient)"
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 3.52} 352`}
            className="transition-all duration-500 ease-out"
          />
          {/* 그라디언트 정의 */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
        {/* 중앙 텍스트 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-2xl font-bold text-gray-700">{completed}</span>
            <span className="text-gray-400 text-sm">/{total}</span>
          </div>
        </div>
      </div>

      {/* 진행률 바 */}
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden mb-4">
        <div
          className={`h-3 rounded-full bg-gradient-to-r ${getProgressColor()} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* 메시지 */}
      <p className="text-center text-gray-600 font-medium mb-4">
        {getCompletionMessage()}
      </p>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="text-center p-3 bg-gray-50 rounded-xl">
          <div className="text-2xl font-bold text-gray-700">{total}</div>
          <div className="text-xs text-gray-500 mt-1">전체</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-xl">
          <div className="text-2xl font-bold text-green-600">{completed}</div>
          <div className="text-xs text-green-600 mt-1">완료</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-xl">
          <div className="text-2xl font-bold text-orange-600">{pending}</div>
          <div className="text-xs text-orange-600 mt-1">남은 것</div>
        </div>
        <div className="text-center p-3 bg-indigo-50 rounded-xl">
          <div className="text-2xl font-bold text-indigo-600">{recurring}</div>
          <div className="text-xs text-indigo-600 mt-1">반복</div>
        </div>
      </div>
    </div>
  );
}
