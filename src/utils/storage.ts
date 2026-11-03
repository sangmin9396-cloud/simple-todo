/**
 * localStorage 유틸리티 함수
 * 할일 데이터를 브라우저에 저장하고 불러옵니다.
 */

import type { Todo } from '../types';
import { STORAGE_KEY } from '../types';

/**
 * localStorage 에 할일 목록 저장
 * @param todos 저장할 할일 목록
 */
export function saveTodos(todos: Todo[]): void {
  try {
    const serialized = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save todos:', error);
  }
}

/**
 * localStorage 에서 할일 목록 로드
 * @param 로드된 할일 목록 (없으면 빈 배열)
 */
export function loadTodos(): Todo[] {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized === null) {
      return [];
    }
    const parsed = JSON.parse(serialized) as Todo[];
    return parsed;
  } catch (error) {
    console.error('Failed to load todos:', error);
    return [];
  }
}

/**
 * localStorage 의 모든 할일 삭제
 */
export function removeTodos(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to remove todos:', error);
  }
}
