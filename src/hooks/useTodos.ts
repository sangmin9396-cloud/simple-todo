/**
 * 할일 관리 커스텀 훅
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Todo, Category, Priority, RepeatUnit } from '../types';
import { saveTodos, loadTodos } from '../utils/storage';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState({
    category: 'all' as Category | 'all',
    status: 'all' as 'all' | 'active' | 'completed',
    sortBy: 'newest' as 'newest' | 'oldest' | 'dueDate',
  });

  useEffect(() => {
    const loadedTodos = loadTodos();
    setTodos(loadedTodos);
    setIsLoading(false);
  }, []);

  const addTodo = useCallback((
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
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: title.trim(),
      category,
      priority,
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
      note: note || undefined,
      completed: false,
      isRecurring: isRecurring || false,
      repeatUnit,
      repeatDayOfWeek: repeatDayOfWeek && repeatDayOfWeek.length > 0 ? repeatDayOfWeek : undefined,
      createdAt: new Date().toISOString(),
    };

    setTodos((prev) => {
      const updated = [...prev, newTodo];
      saveTodos(updated);
      return updated;
    });
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) => {
      const updated = prev.map((todo) => {
        if (todo.id === id) {
          const completed = !todo.completed;
          return {
            ...todo,
            completed,
            completedAt: completed ? new Date().toISOString() : undefined,
          };
        }
        return todo;
      });
      saveTodos(updated);
      return updated;
    });
  }, []);

  const createNextOccurrence = useCallback((completedTodoId: string) => {
    setTodos((prev) => {
      const completedTodo = prev.find((t) => t.id === completedTodoId);
      if (!completedTodo || !completedTodo.isRecurring || !completedTodo.repeatUnit || !completedTodo.dueDate) {
        return prev;
      }

      const lastDueDate = new Date(completedTodo.dueDate);
      let nextDueDate: Date;

      switch (completedTodo.repeatUnit) {
        case 'daily':
          nextDueDate = new Date(lastDueDate);
          nextDueDate.setDate(nextDueDate.getDate() + 1);
          break;
        case 'weekly':
          nextDueDate = new Date(lastDueDate);
          nextDueDate.setDate(nextDueDate.getDate() + 7);
          break;
        case 'monthly':
          nextDueDate = new Date(lastDueDate);
          nextDueDate.setMonth(nextDueDate.getMonth() + 1);
          break;
        default:
          return prev;
      }

      const nextTodo: Todo = {
        id: crypto.randomUUID(),
        title: completedTodo.title,
        category: completedTodo.category,
        priority: completedTodo.priority,
        dueDate: nextDueDate.toISOString().split('T')[0],
        dueTime: completedTodo.dueTime,
        completed: false,
        isRecurring: true,
        repeatUnit: completedTodo.repeatUnit,
        repeatDayOfWeek: completedTodo.repeatDayOfWeek,
        createdAt: new Date().toISOString(),
      };

      const updated = [...prev, nextTodo];
      saveTodos(updated);
      return updated;
    });
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => {
      const updated = prev.filter((todo) => todo.id !== id);
      saveTodos(updated);
      return updated;
    });
  }, []);

  const updateTodo = useCallback((id: string, updates: Partial<Todo>) => {
    setTodos((prev) => {
      const updated = prev.map((todo) =>
        todo.id === id ? { ...todo, ...updates } : todo
      );
      saveTodos(updated);
      return updated;
    });
  }, []);

  const clearAllTodos = useCallback(() => {
    setTodos([]);
    saveTodos([]);
  }, []);

  const filteredTodos = useMemo(() => {
    let result = [...todos];

    if (filters.category !== 'all') {
      result = result.filter((todo) => todo.category === filters.category);
    }

    if (filters.status === 'active') {
      result = result.filter((todo) => !todo.completed);
    } else if (filters.status === 'completed') {
      result = result.filter((todo) => todo.completed);
    }

    switch (filters.sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'dueDate':
        result.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        break;
    }

    return result;
  }, [todos, filters]);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const pending = total - completed;
    const recurring = todos.filter((todo) => todo.isRecurring).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, recurring, percentage };
  }, [todos]);

  return {
    filteredTodos,
    isLoading,
    filters,
    setFilters,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearAllTodos,
    createNextOccurrence,
    stats,
  };
}
