/**
 * 할일 목록 내보내기 버튼 컴포넌트
 */

import { useState } from 'react';
import type { Todo } from '../types';
import { CATEGORIES } from '../types';
import domtoimage from 'dom-to-image-more';

interface ExportButtonProps {
  todos: Todo[];
}

export function ExportButton({ todos }: ExportButtonProps) {
  const [showMenu, setShowMenu] = useState(false);

  // 텍스트 파일 내보내기
  const exportAsText = () => {
    if (todos.length === 0) {
      alert('내보낼 할일이 없습니다.');
      return;
    }

    const today = new Date();
    const dateStr = today.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });

    // 날짜별 그룹화
    const todosByDate = todos.reduce((acc, todo) => {
      const date = todo.dueDate || '미정';
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(todo);
      return acc;
    }, {} as Record<string, Todo[]>);

    // 텍스트 내용 생성
    let content = `정상민 업무일정관리\n`;
    content += `════════════════════\n\n`;
    content += `📅 ${dateStr}\n`;
    content += `════════════════════\n\n`;

    for (const [date, dateTodos] of Object.entries(todosByDate)) {
      content += `📌 ${date}\n`;
      content += `────────────────────\n`;

      for (const todo of dateTodos) {
        const category = CATEGORIES[todo.category];
        const status = todo.completed ? '✓ 완료' : '진행중';
        const timeStr = todo.dueTime ? ` @ ${todo.dueTime}` : '';

        content += `  ${status} [${category.name}] ${todo.title}${timeStr}\n`;
      }
      content += '\n';
    }

    // 파일 다운로드
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `할일목록_${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setShowMenu(false);
  };

  // 이미지 파일 내보내기
  const exportAsImage = async () => {
    if (todos.length === 0) {
      alert('내보낼 할일이 없습니다.');
      return;
    }

    try {
      // 캡처할 요소 찾기
      const element = document.querySelector('#todo-list-container') as HTMLElement | null;
      if (!element) {
        alert('캡처할 요소를 찾을 수 없습니다. 페이지를 새로고침 후 다시 시도해주세요.');
        return;
      }

      // dom-to-image-more 로 이미지 생성
      const dataUrl = await domtoimage.toPng(element, {
        quality: 1.0,
        bgcolor: '#ffffff',
        width: element.offsetWidth * 2,
        height: element.offsetHeight * 2,
        style: {
          transform: 'scale(2)',
          transformOrigin: 'top left',
          width: element.offsetWidth + 'px',
          height: element.offsetHeight + 'px'
        }
      });

      const link = document.createElement('a');
      const today = new Date();
      link.download = `할일목록_${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}.png`;
      link.href = dataUrl;
      link.click();

      setShowMenu(false);
    } catch (error) {
      console.error('이미지 내보내기 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      alert(`이미지 내보내기 중 오류가 발생했습니다:\n${errorMessage}\n\n콘솔을 확인해주세요.`);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="px-3 py-1.5 bg-white text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 border border-gray-200 transition-colors flex items-center gap-1"
      >
        <span>💾</span>
        <span className="hidden sm:inline">내보내기</span>
      </button>

      {showMenu && (
        <>
          {/* 배경 클릭 시 닫기 */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />

          {/* 메뉴 팝업 */}
          <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 min-w-[140px] animate-fade-in">
            <button
              onClick={exportAsText}
              className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <span>📄</span>
              <span>텍스트 파일 (.txt)</span>
            </button>
            <button
              onClick={exportAsImage}
              className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <span>🖼️</span>
              <span>이미지 파일 (.png)</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
