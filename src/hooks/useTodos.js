import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'todos_v1';

export default function useTodos() {
  const [todos, setTodos] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = useCallback(({ title, category, due }) => {
    setTodos(t => [{ id: uuidv4(), title, category, due: due || null, completed: false, createdAt: Date.now() }, ...t]);
  }, []);

  const toggleComplete = useCallback(id => {
    setTodos(t => t.map(td => (td.id === id ? { ...td, completed: !td.completed } : td)));
  }, []);

  const removeTodo = useCallback(id => {
    setTodos(t => t.filter(td => td.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(t => t.filter(td => !td.completed));
  }, []);

  const updateTodo = useCallback((id, patch) => {
    setTodos(t => t.map(td => (td.id === id ? { ...td, ...patch } : td)));
  }, []);

  return { todos, addTodo, toggleComplete, removeTodo, clearCompleted, updateTodo };
}
