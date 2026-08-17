import { useCallback, useEffect, useMemo, useState } from 'react';
import TaskForm from './components/TaskForm.js';
import TaskFilter from './components/TaskFilter.js';
import TaskList from './components/TaskList.js';
import * as api from './services/api.js';
import { getCurrentTheme, applyTheme } from './services/theme.js';
import './styles/main-app-layout/App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(getCurrentTheme);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setTheme(next);
  };

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreate = async (payload) => {
    const created = await api.createTask(payload);
    setTasks((prev) => [...prev, created]);
  };

  const handleUpdate = async (id, payload) => {
    const updated = await api.updateTask(id, payload);
    setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
    setEditingTask(null);
  };

  const handleToggle = async (id) => {
    try {
      const updated = await api.toggleTask(id);
      setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      setEditingTask((current) => (current && current.id === id ? null : current));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const counts = useMemo(
    () => ({
      all: tasks.length,
      pending: tasks.filter((task) => !task.completed).length,
      completed: tasks.filter((task) => task.completed).length,
    }),
    [tasks]
  );

  const visibleTasks = useMemo(() => {
    let list = tasks;
    if (filter === 'completed') list = tasks.filter((task) => task.completed);
    else if (filter === 'pending') list = tasks.filter((task) => !task.completed);

    return [...list].sort((a, b) => {
      // Soonest due date first; tasks without a due date go last.
      if (!a.dueDate) return b.dueDate ? 1 : 0;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    });
  }, [tasks, filter]);

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__heading">
          <h1 className="app__title">Task Manager</h1>
          <p className="app__subtitle">
            Organize your work
          </p>
        </div>
        <button
          type="button"
          className="btn btn--ghost btn--sm app__theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </header>

      <main className="app__main">
        <section className="app__panel">
          <TaskForm
            editingTask={editingTask}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onCancelEdit={() => setEditingTask(null)}
          />
        </section>

        <section className="app__panel app__panel--wide">
          <div className="app__toolbar">
            <TaskFilter filter={filter} onChange={setFilter} counts={counts} />
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={loadTasks}
              title="Reload tasks from the server"
            >
              Refresh
            </button>
          </div>

          {error && (
            <div className="app__error" role="alert">
              <span>{error}</span>
              <button type="button" className="btn btn--sm" onClick={loadTasks}>
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="app__loading">Loading tasks…</div>
          ) : (
            <TaskList
              tasks={visibleTasks}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </section>
      </main>

      <footer className="app__footer">
        <span>{counts.all} tasks total</span>
        <span aria-hidden="true">•</span>
        <span>{counts.completed} completed</span>
      </footer>
    </div>
  );
}

export default App;
