/**
 * 할일 상세 정보 모달 컴포넌트
 */

import { useEffect } from 'react';
import type { Todo } from '../types';
import { CATEGORIES, PRIORITIES, REPEAT_UNITS, getRepeatDisplayText } from '../types';

interface TodoDetailModalProps {
  todo: Todo;
  onClose: () => void;
  repeatDisplayFormat?: 'simple' | 'detailed';
}

export function TodoDetailModal({ todo, onClose, repeatDisplayFormat = 'detailed' }: TodoDetailModalProps) {
  const category = CATEGORIES[todo.category];
  const priority = PRIORITIES[todo.priority];
  const repeatInfo = todo.repeatUnit ? REPEAT_UNITS[todo.repeatUnit] : null;
  const repeatText = getRepeatDisplayText(todo, repeatDisplayFormat);

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // 배경 클릭 시 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
            <span>📝</span>
            <span>할일 상세 정보</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 내용 */}
        <div className="space-y-4">
          {/* 제목 */}
          <div>
            <label className="text-sm text-gray-500 font-medium">제목</label>
            <p className="text-base font-semibold text-gray-800 mt-1 break-words">{todo.title}</p>
          </div>

          {/* 카테고리 & 우선순위 */}
          <div className="flex gap-2">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${category.bgColor} ${category.color}`}>
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${priority.bgColor} ${priority.color}`}>
              <span>🚩</span>
              <span>{priority.name}</span>
            </span>
          </div>

          {/* 마감일 & 시간 */}
          {todo.dueDate && (
            <div>
              <label className="text-sm text-gray-500 font-medium">마감</label>
              <p className="text-sm text-gray-700 mt-1">
                📅 {new Date(todo.dueDate).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long'
                })}
                {todo.dueTime && <span> @ {todo.dueTime}</span>}
              </p>
            </div>
          )}

          {/* 반복 정보 */}
          {todo.isRecurring && repeatInfo && (
            <div>
              <label className="text-sm text-gray-500 font-medium">반복</label>
              <p className="text-sm text-indigo-600 font-medium mt-1">
                🔁 {repeatText}
              </p>
            </div>
          )}

          {/* 메모 */}
          {todo.note && (
            <div>
              <label className="text-sm text-gray-500 font-medium">메모</label>
              <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap break-words">{todo.note}</p>
            </div>
          )}

          {/* 완료 상태 */}
          <div>
            <label className="text-sm text-gray-500 font-medium">상태</label>
            <p className={`text-sm font-medium mt-1 ${todo.completed ? 'text-green-600' : 'text-gray-700'}`}>
              {todo.completed ? '✓ 완료' : '진행중'}
            </p>
          </div>

          {/* 생성일 */}
          <div>
            <label className="text-sm text-gray-500 font-medium">생성일</label>
            <p className="text-sm text-gray-600 mt-1">
              {new Date(todo.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        {/* 푸터 */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
