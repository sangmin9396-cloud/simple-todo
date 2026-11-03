/**
 * SimpleTodo - 메인 앱 컴포넌트
 */

import { useState } from 'react';
import { useTodos } from './hooks/useTodos';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { ProgressBar } from './components/ProgressBar';
import type { Category, Priority, RepeatUnit, RepeatDisplayFormat, Todo } from './types';

function App() {
  const {
    filteredTodos,
    isLoading,
    filters,
    setFilters,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    createNextOccurrence,
    stats,
  } = useTodos();

  const [showRecurringOnly, setShowRecurringOnly] = useState(false);
  const [repeatDisplayFormat, setRepeatDisplayFormat] = useState<RepeatDisplayFormat>('detailed');

  const handleAddTodo = (
    title: string,
    category: Category,
    priority: Priority,
    dueDate?: string,
    dueTime?: string,
    note?: string,
    isRecurring?: boolean,
    repeatUnit?: RepeatUnit,
    repeatDayOfWeek?: number[]
  ) => {
    addTodo(title, category, priority, dueDate, dueTime, note, isRecurring, repeatUnit, repeatDayOfWeek);
  };

  const handleToggleRecurringFilter = () => {
    setShowRecurringOnly(!showRecurringOnly);
    if (!showRecurringOnly) {
      setFilters({ category: 'all', status: 'all', sortBy: 'newest' });
    }
  };

  const handleUpdateTodo = (id: string, updates: Partial<Todo>) => {
    updateTodo(id, updates);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-indigo-50/30">
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white py-8 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-2xl mx-auto px-4 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-5xl animate-bounce">📋</span>
          </div>
          <h1 className="text-4xl font-extrabold text-center tracking-tight">
            정상민이 만든 업무일정관리
          </h1>
          <p className="mt-2 text-indigo-100 text-center text-lg font-medium">
            효율적인 업무 관리를 위한 할일 목록
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="animate-fade-in">
          <TodoInput onAdd={handleAddTodo} />
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <TodoList
            todos={showRecurringOnly ? filteredTodos.filter(t => t.isRecurring) : filteredTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onUpdate={handleUpdateTodo}
            onNextOccurrence={createNextOccurrence}
            filters={filters}
            onFilterChange={setFilters}
            showRecurringOnly={showRecurringOnly}
            onToggleRecurringFilter={handleToggleRecurringFilter}
            repeatDisplayFormat={repeatDisplayFormat}
            setRepeatDisplayFormat={setRepeatDisplayFormat}
          />
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <ProgressBar
            total={stats.total}
            completed={stats.completed}
            pending={stats.pending}
            recurring={stats.recurring}
            percentage={stats.percentage}
          />
        </div>
      </main>

      <footer className="text-center py-6 text-sm text-gray-500 border-t border-gray-200 mt-8">
        <p className="flex items-center justify-center gap-2">
          <span>✨</span>
          정상민이 만든 업무일정관리 - 효율적인 업무 관리를 응원합니다
          <span>✨</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
