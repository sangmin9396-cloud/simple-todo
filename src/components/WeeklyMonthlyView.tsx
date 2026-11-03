/**
 * 주간/월간 일정표 컴포넌트
 */

import { useState } from 'react';
import { CATEGORIES, DAYS_OF_WEEK } from '../types';
import type { Todo } from '../types';

interface WeeklyMonthlyViewProps {
  todos: Todo[];
  viewMode: 'weekly' | 'monthly';
  onTodoClick: (todo: Todo) => void;
}

export function WeeklyMonthlyView({ todos, viewMode, onTodoClick }: WeeklyMonthlyViewProps) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const today = new Date();

  // 로컬 날짜 문자열 생성 (YYYY-MM-DD)
  const getLocalDateStr = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0=일요일, 1=월요일, ..., 6=토요일
    d.setDate(d.getDate() - day);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const getWeekEnd = (date: Date) => {
    const start = getWeekStart(date);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
  };

  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  void new Date(currentYear, currentMonth, 1).getDay(); // 월간 뷰에서 필요시 사용

  const getTodosForDate = (date: Date) => {
    const dateStr = getLocalDateStr(date);
    return todos.filter(todo => todo.dueDate === dateStr);
  };

  const renderWeeklyView = () => {
    const weekStart = getWeekStart(today);
    const weekEnd = getWeekEnd(today);
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });

    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span>📅</span>
            <span>주간 일정</span>
          </h3>
          <p className="text-sm text-indigo-100 mt-1">
            {weekStart.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })} ~ {weekEnd.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
          </p>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {DAYS_OF_WEEK.map((day, idx) => (
            <div key={idx} className="bg-gray-50 p-2 text-center">
              <span className="text-xs font-semibold text-gray-500">{day}</span>
            </div>
          ))}

          {weekDays.map((date, idx) => {
            const dateTodos = getTodosForDate(date);
            const isToday = date.getDate() === today.getDate() &&
                           date.getMonth() === today.getMonth() &&
                           date.getFullYear() === today.getFullYear();
            const dateStr = date.getDate();
            const dateKey = getLocalDateStr(date);
            const isHovered = hoveredDate === dateKey;

            return (
              <div
                key={idx}
                className={`bg-white p-2 min-h-[120px] ${isToday ? 'bg-indigo-50' : ''} ${isHovered ? 'ring-2 ring-indigo-300' : ''}`}
                onMouseEnter={() => setHoveredDate(dateKey)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                <div className={`text-sm font-medium text-center mb-2 ${isToday ? 'text-indigo-600' : 'text-gray-700'}`}>
                  {dateStr}
                </div>
                {isHovered && dateTodos.length > 0 ? (
                  <div className="space-y-1 max-h-[100px] overflow-y-auto">
                    {dateTodos.map(todo => {
                      const category = CATEGORIES[todo.category];
                      return (
                        <button
                          key={todo.id}
                          onClick={() => onTodoClick(todo)}
                          className={`w-full text-left text-xs px-2 py-1 rounded ${category.bgColor} ${category.color} hover:opacity-80 transition-opacity break-words`}
                        >
                          {todo.completed && <span className="line-through opacity-60">✓ </span>}
                          {todo.title}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {dateTodos.slice(0, 3).map(todo => {
                      const category = CATEGORIES[todo.category];
                      return (
                        <div
                          key={todo.id}
                          className={`w-full text-left text-xs px-2 py-1 rounded truncate ${category.bgColor} ${category.color} cursor-default`}
                        >
                          {todo.completed && <span className="line-through opacity-60">✓ </span>}
                          {todo.title}
                        </div>
                      );
                    })}
                    {dateTodos.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dateTodos.length - 3}개
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthlyView = () => {
    const weeks = [];
    // 월간 뷰도 주간 뷰와 같이 일요일부터 시작하도록 맞춤
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();

    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        const dayOffset = week * 7 + day;
        const actualDay = dayOffset - firstDay + 1;

        if (actualDay < 1 || actualDay > daysInMonth) {
          weekDays.push(null);
        } else {
          weekDays.push(actualDay);
        }
      }
      // 마지막 주에 빈 날짜만 있으면 제외
      if (week === 5 && weekDays.every(d => d === null)) {
        continue;
      }
      weeks.push(weekDays);
    }

    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span>🗓️</span>
            <span>월간 일정</span>
          </h3>
          <p className="text-sm text-indigo-100 mt-1">
            {currentYear}년 {currentMonth + 1}월
          </p>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {DAYS_OF_WEEK.map((day, idx) => (
            <div key={idx} className="bg-gray-50 p-2 text-center">
              <span className="text-xs font-semibold text-gray-500">{day}</span>
            </div>
          ))}

          {weeks.map((week, weekIdx) =>
            week.map((day, dayIdx) => {
              if (day === null) {
                return <div key={`${weekIdx}-${dayIdx}`} className="bg-gray-50 min-h-[80px]" />;
              }

              const date = new Date(currentYear, currentMonth, day);
              const dateKey = getLocalDateStr(date);
              const dateTodos = todos.filter(todo => todo.dueDate === dateKey);
              const isToday = day === today.getDate() &&
                             currentMonth === today.getMonth() &&
                             currentYear === today.getFullYear();
              const isHovered = hoveredDate === dateKey;

              return (
                <div
                  key={`${weekIdx}-${dayIdx}`}
                  className={`bg-white p-1 min-h-[80px] ${isToday ? 'bg-indigo-50' : ''} ${isHovered ? 'ring-2 ring-indigo-300' : ''}`}
                  onMouseEnter={() => setHoveredDate(dateKey)}
                  onMouseLeave={() => setHoveredDate(null)}
                >
                  <div className={`text-xs font-medium text-right mb-1 ${isToday ? 'text-indigo-600' : 'text-gray-700'}`}>
                    {day}
                  </div>
                  {isHovered && dateTodos.length > 0 ? (
                    <div className="space-y-0.5 max-h-[100px] overflow-y-auto">
                      {dateTodos.map(todo => {
                        const category = CATEGORIES[todo.category];
                        return (
                          <button
                            key={todo.id}
                            onClick={() => onTodoClick(todo)}
                            className={`w-full text-left text-xs px-2 py-1 rounded ${category.bgColor} ${category.color} hover:opacity-80 transition-opacity break-words`}
                          >
                            {todo.completed && <span className="line-through opacity-60">✓ </span>}
                            {todo.title}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      {dateTodos.slice(0, 2).map(todo => {
                        const category = CATEGORIES[todo.category];
                        return (
                          <div
                            key={todo.id}
                            className={`w-full text-left text-[10px] px-1 py-0.5 rounded truncate ${category.bgColor} ${category.color} cursor-default`}
                          >
                            {todo.completed && <span className="line-through opacity-60">✓ </span>}
                            {todo.title}
                          </div>
                        );
                      })}
                      {dateTodos.length > 2 && (
                        <div className="text-[10px] text-gray-500 text-center">
                          +{dateTodos.length - 2}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-6">
      {viewMode === 'weekly' ? renderWeeklyView() : renderMonthlyView()}
    </div>
  );
}
