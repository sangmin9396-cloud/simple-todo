/**
 * 단일 할일 항목 컴포넌트
 */

import { useState } from 'react';
import type { Todo, RepeatUnit, RepeatDisplayFormat } from '../types';
import { CATEGORIES, PRIORITIES, REPEAT_UNITS, DAYS_OF_WEEK, getRepeatDisplayText } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onNextOccurrence: (id: string) => void;
  repeatDisplayFormat?: RepeatDisplayFormat;
  onShowDetail?: (todo: Todo) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onUpdate, onNextOccurrence, repeatDisplayFormat = 'detailed', onShowDetail: _onShowDetail }: TodoItemProps) {
  const category = CATEGORIES[todo.category];
  const priority = PRIORITIES[todo.priority];
  const repeatInfo = todo.repeatUnit ? REPEAT_UNITS[todo.repeatUnit] : null;
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editCategory, setEditCategory] = useState<Todo['category']>(todo.category);
  const [editPriority, setEditPriority] = useState<Todo['priority']>(todo.priority);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate || '');
  const [editDueTime, setEditDueTime] = useState(todo.dueTime || '');
  const [editNote, setEditNote] = useState(todo.note || '');
  const [editIsRecurring, setEditIsRecurring] = useState(todo.isRecurring);
  const [editRepeatUnit, setEditRepeatUnit] = useState<RepeatUnit>(todo.repeatUnit || 'daily');
  const [editRepeatDayOfWeek, setEditRepeatDayOfWeek] = useState<number[]>(todo.repeatDayOfWeek || []);

  const handleDeleteClick = () => {
    if (window.confirm('정말 이 할일을 삭제하시겠습니까?')) {
      setIsDeleting(true);
      onDelete(todo.id);
    }
  };

  const handleSave = () => {
    if (!editTitle.trim()) return;
    onUpdate(todo.id, {
      title: editTitle.trim(),
      category: editCategory,
      priority: editPriority,
      dueDate: editDueDate || undefined,
      dueTime: editDueTime || undefined,
      note: editNote || undefined,
      isRecurring: editIsRecurring,
      repeatUnit: editIsRecurring ? editRepeatUnit : undefined,
      repeatDayOfWeek: editIsRecurring && editRepeatUnit === 'weekly' ? editRepeatDayOfWeek : undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditCategory(todo.category);
    setEditPriority(todo.priority);
    setEditDueDate(todo.dueDate || '');
    setEditDueTime(todo.dueTime || '');
    setEditNote(todo.note || '');
    setEditIsRecurring(todo.isRecurring);
    setEditRepeatUnit(todo.repeatUnit || 'daily');
    setEditRepeatDayOfWeek(todo.repeatDayOfWeek || []);
    setIsEditing(false);
  };

  const handleToggle = () => {
    onToggle(todo.id);
  };

  const isDueSoon = () => {
    if (!todo.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(todo.dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 1;
  };

  const isOverdue = () => {
    if (!todo.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(todo.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  const overdue = isOverdue();
  const dueSoon = isDueSoon();
  const repeatText = getRepeatDisplayText(todo, repeatDisplayFormat);

  if (isEditing) {
    return (
      <li className="bg-white rounded-xl shadow-lg border border-indigo-200 p-4 animate-fade-in">
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-500 font-medium">제목</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1"
              placeholder="할일 제목을 입력하세요"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-500 font-medium">카테고리</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value as Todo['category'])}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1"
              >
                {Object.values(CATEGORIES).map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-500 font-medium">우선순위</label>
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value as Todo['priority'])}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1"
              >
                {Object.values(PRIORITIES).map((p) => (
                  <option key={p.id} value={p.id}>🚩 {p.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-500 font-medium">마감일</label>
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 font-medium">마감시간</label>
              <input
                type="time"
                value={editDueTime}
                onChange={(e) => setEditDueTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-500 font-medium">메모</label>
            <textarea
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
              placeholder="추가 메모를 입력하세요 (선택사항)"
              rows={3}
              maxLength={500}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1 resize-none"
            />
            {editNote && (
              <div className="text-right mt-1">
                <span className="text-xs text-gray-400">{editNote.length}/500</span>
              </div>
            )}
          </div>
          <div>
            <label className="text-sm text-gray-500 font-medium">반복 설정</label>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <button
                onClick={() => { setEditIsRecurring(!editIsRecurring); if (editIsRecurring) { setEditRepeatUnit('daily'); setEditRepeatDayOfWeek([]); }}}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  editIsRecurring
                    ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🔁 반복
              </button>
              {editIsRecurring && (
                <>
                  <div className="flex gap-1">
                    {Object.values(REPEAT_UNITS).map((unit) => (
                      <button
                        key={unit.id}
                        onClick={() => { setEditRepeatUnit(unit.id); if (unit.id !== 'weekly') setEditRepeatDayOfWeek([]); }}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          editRepeatUnit === unit.id
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-gray-600 border border-gray-200'
                        }`}
                      >
                        {unit.icon} {unit.name}
                      </button>
                    ))}
                  </div>
                  {editRepeatUnit === 'weekly' && (
                    <div className="flex gap-1">
                      {DAYS_OF_WEEK.map((day, idx) => (
                        <button
                          key={idx}
                          onClick={() => setEditRepeatDayOfWeek(prev => prev.includes(idx) ? prev.filter(d => d !== idx) : [...prev, idx])}
                          className={`w-7 h-7 rounded text-xs font-medium ${
                            editRepeatDayOfWeek.includes(idx)
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white text-gray-600 border border-gray-200'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">저장</button>
            <button onClick={handleCancel} className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">취소</button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className={`group bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 hover:shadow-lg hover:border-indigo-100 transition-all duration-300 ${todo.completed ? 'opacity-60' : ''} ${isDeleting ? 'animate-fade-in' : ''}`}>
      <button
        onClick={handleToggle}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          todo.completed ? 'bg-gradient-to-br from-green-400 to-green-500 border-green-500' : 'border-gray-300 hover:border-indigo-400'
        }`}
      >
        {todo.completed && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`block text-base font-medium transition-all duration-200 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
            {todo.title}
          </span>
          {todo.isRecurring && repeatInfo && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
              {repeatText}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${category.bgColor} ${category.color}`}>
            <span>{category.icon}</span><span>{category.name}</span>
          </span>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${priority.bgColor} ${priority.color}`}>
            <span>🚩</span><span>{priority.name}</span>
          </span>
          {todo.dueDate && (
            <span className={`inline-flex items-center gap-1 text-xs font-medium ${overdue ? 'text-red-600' : dueSoon ? 'text-yellow-600' : 'text-gray-500'}`}>
              <span>📅</span>
              <span>{new Date(todo.dueDate).toLocaleDateString('ko-KR')}</span>
              {todo.dueTime && <span>@{todo.dueTime}</span>}
              {overdue && <span className="text-red-500">(지남)</span>}
              {dueSoon && !overdue && <span className="text-yellow-500">(임박)</span>}
            </span>
          )}
          {todo.note && (
            <div className="mt-2 w-full">
              <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-200">
                <span className="flex-shrink-0 mt-0.5">📝</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs text-gray-500 mb-1">메모</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{todo.note}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 반복 할일인 경우 다음 일정 생성 버튼 */}
        {todo.isRecurring && todo.completed && (
          <button
            onClick={() => onNextOccurrence(todo.id)}
            className="mt-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-200 transition-colors flex items-center gap-1"
          >
            <span>➕</span>
            <span>다음 일정 생성</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button onClick={() => setIsEditing(true)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200" title="수정">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        </button>
        <button onClick={handleDeleteClick} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200" title="삭제">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </li>
  );
}
