/**
 * SimpleTodo 타입 정의
 */

/** 카테고리 타입 */
export type Category = 'work' | 'personal' | 'learning' | 'health' | 'other';

/** 우선순위 타입 */
export type Priority = 'low' | 'medium' | 'high';

/** 카테고리 정보 */
export interface CategoryInfo {
  id: Category;
  name: string;
  color: string;
  bgColor: string;
  icon: string;
}

/** 카테고리 목록 */
export const CATEGORIES: Record<Category, CategoryInfo> = {
  work: {
    id: 'work',
    name: '업무',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    icon: '💼',
  },
  personal: {
    id: 'personal',
    name: '개인',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    icon: '👤',
  },
  learning: {
    id: 'learning',
    name: '학습',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    icon: '📚',
  },
  health: {
    id: 'health',
    name: '건강',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: '💪',
  },
  other: {
    id: 'other',
    name: '기타',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    icon: '📌',
  },
};

/** 우선순위 정보 */
export interface PriorityInfo {
  id: Priority;
  name: string;
  color: string;
  bgColor: string;
}

/** 우선순위 목록 */
export const PRIORITIES: Record<Priority, PriorityInfo> = {
  low: {
    id: 'low',
    name: '낮음',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
  medium: {
    id: 'medium',
    name: '보통',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
  },
  high: {
    id: 'high',
    name: '높음',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
  },
};

/** 반복 주기 타입 */
export type RepeatUnit = 'daily' | 'weekly' | 'monthly';

/** 반복 정보 */
export interface RepeatInfo {
  id: RepeatUnit;
  name: string;
  icon: string;
}

/** 반복 주기 목록 */
export const REPEAT_UNITS: Record<RepeatUnit, RepeatInfo> = {
  daily: { id: 'daily', name: '매일', icon: '🔄' },
  weekly: { id: 'weekly', name: '매주', icon: '📅' },
  monthly: { id: 'monthly', name: '매월', icon: '🗓️' },
};

/** 반복 표시 형식 */
export type RepeatDisplayFormat = 'simple' | 'detailed';

/** 할일 인터페이스 */
export interface Todo {
  id: string;           // UUID
  title: string;        // 할일 제목
  category: Category;   // 카테고리
  priority: Priority;   // 우선순위
  dueDate?: string;     // 마감일 (YYYY-MM-DD)
  dueTime?: string;     // 마감시간 (HH:MM)
  note?: string;        // 메모
  completed: boolean;   // 완료 상태
  isRecurring: boolean; // 반복 여부
  repeatUnit?: RepeatUnit; // 반복 주기
  repeatDayOfWeek?: number[]; // 매주 요일 (0=일요일, 1=월요일, ...)
  createdAt: string;    // 생성일 (ISO string)
  completedAt?: string; // 완료일 (ISO string)
}

/** 필터 타입 */
export interface TodoFilters {
  category: Category | 'all';
  status: 'all' | 'active' | 'completed';
  sortBy: 'newest' | 'oldest' | 'dueDate';
}

/** localStorage 저장 키 */
export const STORAGE_KEY = 'simple-todo-todos';

/** 요일 이름 */
export const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'];

/** 반복 표시 형식 텍스트 */
export function getRepeatDisplayText(todo: Todo, format: RepeatDisplayFormat = 'detailed'): string {
  if (!todo.isRecurring || !todo.repeatUnit) return '';

  const timeText = todo.dueTime ? ` ${todo.dueTime}` : '';

  switch (todo.repeatUnit) {
    case 'daily':
      if (format === 'simple') return '매일';
      return todo.dueTime ? `매일${timeText}` : '매일';
    case 'weekly':
      if (todo.repeatDayOfWeek && todo.repeatDayOfWeek.length > 0) {
        const days = todo.repeatDayOfWeek.map(d => DAYS_OF_WEEK[d]).join('');
        return `매주 ${days}요일${timeText}`;
      }
      return format === 'simple' ? '매주' : `매주${timeText}`;
    case 'monthly':
      return format === 'simple' ? '매월' : `매월${timeText}`;
    default:
      return '';
  }
}
