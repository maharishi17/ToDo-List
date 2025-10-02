import React, { useContext, useMemo, useState, useCallback, useEffect } from 'react';
import useTodos from './hooks/useTodos';
import TodoItem from './components/TodoItem';
import AddTodoForm from './components/AddTodoForm';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import { ThemeContext } from './ThemeContext';
import './App.css';

const ALL_FILTERS = ['all', 'active', 'completed'];
const DEFAULT_CATEGORIES = ['work', 'personal', 'shopping', 'others'];

function App() {
  const { todos, addTodo, toggleComplete, removeTodo, clearCompleted } = useTodos();
  const { dark, toggle } = useContext(ThemeContext);

  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');

  // keyboard shortcuts
  useEffect(() => {
    const handler = e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        const el = document.getElementById('newTodoTitle');
        if (el) el.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggle]);

  const handleAdd = useCallback(async payload => {
    addTodo(payload);
  }, [addTodo]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return todos
      .filter(td => {
        if (filter === 'active' && td.completed) return false;
        if (filter === 'completed' && !td.completed) return false;
        if (categoryFilter !== 'all' && td.category !== categoryFilter) return false;
        if (
          s &&
          !td.title.toLowerCase().includes(s) &&
          !td.category.toLowerCase().includes(s)
        )
          return false;
        return true;
      })
      .sort(
        (a, b) =>
          a.completed - b.completed ||
          new Date(a.due || 0) - new Date(b.due || 0)
      );
  }, [todos, filter, categoryFilter, search]);

  const counts = useMemo(
    () => ({
      total: todos.length,
      active: todos.filter(t => !t.completed).length,
      completed: todos.filter(t => t.completed).length,
    }),
    [todos]
  );

  return (
    <div className="app">
      <header className="header">
        <h1>Enhanced Todo</h1>
        <div className="controls">
          <SearchBar value={search} onChange={setSearch} />
          <button onClick={toggle} className="icon" aria-label="toggle theme">
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className="main-center">
        {/* Top controls block: add form + filters + stats */}
        <div className="top-block">
          <div className="form-wrap">
            <AddTodoForm onAdd={handleAdd} />
          </div>

          <div className="controls-row">
            <div className="filter-group">
              <div className="filter-buttons">
                {ALL_FILTERS.map(f => (
                  <button
                    key={f}
                    className={f === filter ? 'active' : ''}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <CategoryFilter
                value={categoryFilter}
                onChange={setCategoryFilter}
                categories={DEFAULT_CATEGORIES}
              />
            </div>

            <div className="summary">
              <div className="stat">
                <h3>Total</h3>
                <div className="num">{counts.total}</div>
              </div>
              <div className="stat">
                <h3>Active</h3>
                <div className="num">{counts.active}</div>
              </div>
              <div className="stat">
                <h3>Completed</h3>
                <div className="num">{counts.completed}</div>
              </div>
              <button className="clear-btn" onClick={clearCompleted}>
                Clear completed
              </button>
            </div>
          </div>
        </div>

        {/* Centered todo list: each item one-by-one, centered */}
        <section className="center-list">
          <ul className="todo-list">
            {filtered.map(td => (
              <TodoItem
                key={td.id}
                todo={td}
                onToggle={toggleComplete}
                onDelete={removeTodo}
              />
            ))}
            {filtered.length === 0 && <li className="empty">No todos found</li>}
          </ul>
        </section>
      </main>

      <footer className="footer">
        <div>Made by Maharishi R</div>
        <div>
          <a
            href="https://github.com/maharishi17"
            target="_blank"
            rel="noreferrer"
          >
            My GitHub Link
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
