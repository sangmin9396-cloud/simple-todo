/**
 * 할일 입력 컴포넌트
 */

import { useState, useRef } from 'react';
import type { Category, RepeatUnit } from '../types';
import { PRIORITIES, CATEGORIES, REPEAT_UNITS, DAYS_OF_WEEK } from '../types';

interface TodoInputProps {
  onAdd: (
    title: string,
    category: Category,
    priority: 'low' | 'medium' | 'high',
    dueDate?: string,
    dueTime?: string,
    note?: string,
    isRecurring?: boolean,
    repeatUnit?: RepeatUnit,
    repeatDayOfWeek?: number[]
  ) => void;
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [category, setCategory] = useState<Category>('personal');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [note, setNote] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [repeatUnit, setRepeatUnit] = useState<RepeatUnit>('daily');
  const [repeatDayOfWeek, setRepeatDayOfWeek] = useState<number[]>([]);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setError('할일 제목을 입력해주세요.');
      inputRef.current?.focus();
      return;
    }

    onAdd(trimmed, category, priority, dueDate || undefined, dueTime || undefined, note || undefined, isRecurring, isRecurring ? repeatUnit : undefined, isRecurring && repeatUnit === 'weekly' ? repeatDayOfWeek : undefined);

    setInputValue('');
    setCategory('personal');
    setPriority('medium');
    setDueDate('');
    setDueTime('');
    setNote('');
    setIsRecurring(false);
    setRepeatUnit('daily');
    setRepeatDayOfWeek([]);
    setError('');
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (error) setError('');
  };

  const toggleDayOfWeek = (day: number) => {
    setRepeatDayOfWeek(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-4">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="새로운 할일을 입력하세요..."
            className="flex-1 px-4 py-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
          />
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <span className="flex items-center gap-2">
              <span>+</span>
              <span className="hidden sm:inline">추가</span>
            </span>
          </button>
        </div>
        {error && (
          <div className="mt-2 flex items-center gap-2 text-sm text-red-500 animate-fade-in" role="alert">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 bg-gray-50/50 p-4 pt-3">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[120px]">
            <span className="text-sm text-gray-500 font-medium whitespace-nowrap">카테고리:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer"
            >
              {Object.values(CATEGORIES).map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 flex-1 min-w-[120px]">
            <span className="text-sm text-gray-500 font-medium whitespace-nowrap">우선순위:</span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer"
            >
              {Object.values(PRIORITIES).map((p) => (
                <option key={p.id} value={p.id}>🚩 {p.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 flex-1 min-w-[120px]">
            <span className="text-sm text-gray-500 font-medium whitespace-nowrap">마감일:</span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div className="flex items-center gap-2 flex-1 min-w-[120px]">
            <span className="text-sm text-gray-500 font-medium whitespace-nowrap">마감시간:</span>
            <input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-start gap-2">
            <span className="text-sm text-gray-500 font-medium whitespace-nowrap mt-1.5">메모:</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="추가 메모를 입력하세요 (선택사항)"
              rows={3}
              maxLength={500}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white resize-none"
            />
          </div>
          {note && (
            <div className="text-right mt-1">
              <span className="text-xs text-gray-400">{note.length}/500</span>
            </div>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setIsRecurring(!isRecurring)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isRecurring
                  ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center gap-1">
                <span>🔁</span>
                <span>반복</span>
              </span>
            </button>

            {isRecurring && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-500 font-medium whitespace-nowrap">주기:</span>
                <div className="flex gap-1">
                  {Object.values(REPEAT_UNITS).map((unit) => (
                    <button
                      key={unit.id}
                      onClick={() => { setRepeatUnit(unit.id); setRepeatDayOfWeek([]); }}
                      className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                        repeatUnit === unit.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {unit.icon} {unit.name}
                    </button>
                  ))}
                </div>

                {repeatUnit === 'weekly' && (
                  <div className="flex items-center gap-1 ml-2">
                    <span className="text-xs text-gray-500">요일:</span>
                    {DAYS_OF_WEEK.map((day, idx) => (
                      <button
                        key={idx}
                        onClick={() => toggleDayOfWeek(idx)}
                        className={`w-7 h-7 rounded text-xs font-medium transition-all ${
                          repeatDayOfWeek.includes(idx)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
