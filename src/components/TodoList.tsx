/**
 * 할일 목록 컴포넌트
 */

import { useState } from 'react';
import type { Todo, Category, RepeatDisplayFormat } from '../types';
import { CATEGORIES, getRepeatDisplayText } from '../types';
import { TodoItem } from './TodoItem';
import { WeeklyMonthlyView } from './WeeklyMonthlyView';
import { TodoDetailModal } from './TodoDetailModal';
import { ExportButton } from './ExportButton';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onNextOccurrence: (id: string) => void;
  filters: {
    category: Category | 'all';
    status: 'all' | 'active' | 'completed';
    sortBy: 'newest' | 'oldest' | 'dueDate';
  };
  onFilterChange: (filters: TodoListProps['filters']) => void;
  showRecurringOnly: boolean;
  onToggleRecurringFilter: () => void;
  repeatDisplayFormat: RepeatDisplayFormat;
  setRepeatDisplayFormat: (format: RepeatDisplayFormat) => void;
}

function TodoListEmpty({ message = '할일이 없습니다. 위의 입력란에 할일을 추가해보세요!' }: { message?: string }) {
  return (
    <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="text-7xl mb-4 animate-bounce">📝</div>
      <p className="text-gray-500 text-lg font-medium">{message}</p>
      <p className="text-gray-400 text-sm mt-2">할일을 추가하면 여기에 표시됩니다</p>
    </div>
  );
}

function FilterControls({ filters, onFilterChange, showRecurringOnly, onToggleRecurringFilter, repeatDisplayFormat, setRepeatDisplayFormat }: { filters: TodoListProps['filters']; onFilterChange: (filters: TodoListProps['filters']) => void; showRecurringOnly: boolean; onToggleRecurringFilter: () => void; repeatDisplayFormat: RepeatDisplayFormat; setRepeatDisplayFormat: (format: RepeatDisplayFormat) => void }) {
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, category: e.target.value as Category | 'all' });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, status: e.target.value as 'all' | 'active' | 'completed' });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, sortBy: e.target.value as 'newest' | 'oldest' | 'dueDate' });
  };

  const handleReset = () => {
    onFilterChange({ category: 'all', status: 'all', sortBy: 'newest' });
  };

  const hasActiveFilters = filters.category !== 'all' || filters.status !== 'all' || filters.sortBy !== 'newest' || showRecurringOnly;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 mb-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 flex-1 min-w-[100px]">
          <span className="text-xs text-gray-500 font-medium">카테고리:</span>
          <select value={filters.category} onChange={handleCategoryChange} className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
            <option value="all">전체</option>
            {Object.values(CATEGORIES).map((cat) => (<option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 flex-1 min-w-[100px]">
          <span className="text-xs text-gray-500 font-medium">상태:</span>
          <select value={filters.status} onChange={handleStatusChange} className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
            <option value="all">전체</option>
            <option value="active">진행중</option>
            <option value="completed">완료</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 flex-1 min-w-[100px]">
          <span className="text-xs text-gray-500 font-medium">정렬:</span>
          <select value={filters.sortBy} onChange={handleSortChange} className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
            <option value="newest">최신순</option>
            <option value="oldest">오래된순</option>
            <option value="dueDate">마감기한순</option>
          </select>
        </div>

        <button onClick={onToggleRecurringFilter} className={`px-2 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${showRecurringOnly ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          <span>🔁</span>
          <span className="hidden sm:inline">반복할일</span>
        </button>

        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => setRepeatDisplayFormat('simple')}
            className={`px-2 py-1 rounded text-xs ${repeatDisplayFormat === 'simple' ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            간단
          </button>
          <button
            onClick={() => setRepeatDisplayFormat('detailed')}
            className={`px-2 py-1 rounded text-xs ${repeatDisplayFormat === 'detailed' ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            상세
          </button>
        </div>

        {hasActiveFilters && (
          <button onClick={handleReset} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded hover:bg-indigo-50">
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

function RecurringSidebar({ todos, onToggle, repeatDisplayFormat }: { todos: Todo[]; onToggle: (id: string) => void; repeatDisplayFormat: RepeatDisplayFormat }) {
  const recurringTodos = todos.filter(t => t.isRecurring && !t.completed);

  if (recurringTodos.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-4 sticky top-4">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
        <span className="text-xl">🔁</span>
        <h3 className="text-base font-bold text-gray-700">반복 할일</h3>
        <span className="ml-auto bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">{recurringTodos.length}</span>
      </div>
      <ul className="space-y-2">
        {recurringTodos.map((todo) => {
          const repeatText = getRepeatDisplayText(todo, repeatDisplayFormat);
          return (
            <li key={todo.id} className="bg-indigo-50 rounded-lg p-2.5 border border-indigo-100">
              <div className="flex items-start gap-2">
                <button onClick={() => onToggle(todo.id)} className="flex-shrink-0 w-4 h-4 rounded-full border-2 border-indigo-300 flex items-center justify-center mt-0.5">
                  {todo.completed && <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{todo.title}</p>
                  <p className="text-xs text-indigo-600 mt-0.5">{repeatText}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function TodoList({ todos, onToggle, onDelete, onUpdate, onNextOccurrence, filters, onFilterChange, showRecurringOnly, onToggleRecurringFilter, repeatDisplayFormat, setRepeatDisplayFormat }: TodoListProps) {
  const [viewMode, setViewMode] = useState<'list' | 'weekly' | 'monthly'>('list');
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const showFilters = todos.length > 0;

  const handleTodoClick = (todo: Todo) => {
    setSelectedTodo(todo);
  };

  const handleCloseModal = () => {
    setSelectedTodo(null);
  };

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="animate-fade-in">
          <FilterControls filters={filters} onFilterChange={onFilterChange} showRecurringOnly={showRecurringOnly} onToggleRecurringFilter={onToggleRecurringFilter} repeatDisplayFormat={repeatDisplayFormat} setRepeatDisplayFormat={setRepeatDisplayFormat} />
        </div>
      )}

      {/* 내보내기 버튼 - 필터 옆에 배치 */}
      {showFilters && (
        <div className="flex justify-end animate-fade-in">
          <ExportButton todos={todos} />
        </div>
      )}

      {/* 뷰 전환 탭 - 필터 아래에 배치 */}
      <div className="flex gap-2">
        <button onClick={() => setViewMode('list')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>
          📋 목록
        </button>
        <button onClick={() => setViewMode('weekly')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'weekly' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>
          📅 주간
        </button>
        <button onClick={() => setViewMode('monthly')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'monthly' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>
          🗓️ 월간
        </button>
      </div>

      {viewMode === 'list' ? (
        <div id="todo-list-container" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ul className="space-y-3" role="list" aria-label="할일 목록">
              {todos.map((todo, index) => (
                <div key={todo.id} className="animate-slide-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} onUpdate={onUpdate} onNextOccurrence={onNextOccurrence} repeatDisplayFormat={repeatDisplayFormat} onShowDetail={handleTodoClick} />
                </div>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-1">
            <RecurringSidebar todos={todos} onToggle={onToggle} repeatDisplayFormat={repeatDisplayFormat} />
          </div>
        </div>
      ) : (
        <div id="todo-list-container">
          <WeeklyMonthlyView
            todos={todos}
            viewMode={viewMode === 'weekly' ? 'weekly' : 'monthly'}
            onTodoClick={handleTodoClick}
          />
        </div>
      )}

      {/* 할일 상세 모달 */}
      {selectedTodo && (
        <TodoDetailModal
          todo={selectedTodo}
          onClose={handleCloseModal}
          repeatDisplayFormat={repeatDisplayFormat}
        />
      )}
    </div>
  );
}

TodoList.Empty = TodoListEmpty;
