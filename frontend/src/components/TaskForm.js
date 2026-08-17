import { useEffect, useState } from 'react';
import '../styles/TaskForm.css';

const EMPTY = { title: '', description: '', priority: 'medium', dueDate: '' };

function TaskForm({ editingTask, onCreate, onUpdate, onCancelEdit }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(editingTask);

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description || '',
        priority: editingTask.priority,
        dueDate: editingTask.dueDate || '',
      });
    } else {
      setForm(EMPTY);
    }
    setError('');
  }, [editingTask]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.title.trim() === '') {
      setError('Title is required.');
      return;
    }
    if (form.dueDate === '') {
      setError('Due date is required.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        dueDate: form.dueDate,
      };
      if (isEditing) {
        await onUpdate(editingTask.id, payload);
      } else {
        await onCreate(payload);
        setForm(EMPTY);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2 className="task-form__title">{isEditing ? 'Edit Task' : 'Add Task'}</h2>

      <div className="task-form__row">
        <label className="task-form__label" htmlFor="title">
          Title <span aria-hidden="true">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className="task-form__input"
          placeholder="What needs to be done?"
          value={form.title}
          onChange={handleChange}
          maxLength={120}
        />
      </div>

      <div className="task-form__row">
        <label className="task-form__label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="task-form__input task-form__textarea"
          placeholder="Add more details (optional)"
          value={form.description}
          onChange={handleChange}
          rows={2}
        />
      </div>

      <div className="task-form__row">
        <label className="task-form__label" htmlFor="priority">
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          className="task-form__input"
          value={form.priority}
          onChange={handleChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="task-form__row">
        <label className="task-form__label" htmlFor="dueDate">
          Due Date <span aria-hidden="true">*</span>
        </label>
        <input
          id="dueDate"
          name="dueDate"
          type="date"
          className="task-form__input"
          value={form.dueDate}
          onChange={handleChange}
        />
      </div>

      {error && <p className="task-form__error">{error}</p>}

      <div className="task-form__actions">
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Task'}
        </button>
        {isEditing && (
          <button type="button" className="btn btn--ghost" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;
