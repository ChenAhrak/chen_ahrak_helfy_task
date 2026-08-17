import { useState } from 'react';
import '../styles/TaskItem.css';

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Parse a YYYY-MM-DD string as a local-midnight date (avoids UTC off-by-one).
function parseLocalDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatLocalDate(value) {
  const date = parseLocalDate(value);
  if (!date) return '';
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const dueDate = parseLocalDate(task.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isOverdue = !task.completed && dueDate !== null && dueDate < today;

  return (
    <article
      className={`task-item task-item--${task.priority} ${
        task.completed ? 'is-completed' : ''
      }`}
    >
      <div className="task-item__header">
        <span className={`task-item__badge badge--${task.priority}`}>
          {task.priority}
        </span>
        <span className="task-item__date">{formatDate(task.createdAt)}</span>
      </div>

      <h3 className="task-item__title">{task.title}</h3>
      {task.description && (
        <p className="task-item__description">{task.description}</p>
      )}

      <div className="task-item__status">
        <label className="task-item__toggle">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
          />
          <span>{task.completed ? 'Completed' : 'Pending'}</span>
        </label>
        {task.dueDate && (
          <span className={`task-item__due ${isOverdue ? 'is-overdue' : ''}`}>
            Due {formatLocalDate(task.dueDate)}
            {isOverdue && ' · Overdue'}
          </span>
        )}
      </div>

      <div className="task-item__actions">
        {confirmingDelete ? (
          <>
            <span className="task-item__confirm-text">Delete?</span>
            <button
              type="button"
              className="btn btn--danger btn--sm"
              onClick={() => onDelete(task.id)}
            >
              Yes
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => setConfirmingDelete(false)}
            >
              No
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => onEdit(task)}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn btn--danger btn--sm"
              onClick={() => setConfirmingDelete(true)}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </article>
  );
}

export default TaskItem;
