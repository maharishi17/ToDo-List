import React, { useCallback } from 'react';
import { format } from 'date-fns';

export default function TodoItem({ todo, onToggle, onDelete }) {
  const handleToggle = useCallback(() => onToggle(todo.id), [onToggle, todo.id]);
  const handleDelete = useCallback(() => onDelete(todo.id), [onDelete, todo.id]);

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="left">
        <input type="checkbox" checked={todo.completed} onChange={handleToggle} />
        <div className="meta">
          <div className="title">{todo.title}</div>
          <div className="small">{todo.category} • {todo.due ? format(new Date(todo.due), 'PPP') : 'No due date'}</div>
        </div>
      </div>
      <button className="del" onClick={handleDelete}>Delete</button>
    </li>
  );
}
