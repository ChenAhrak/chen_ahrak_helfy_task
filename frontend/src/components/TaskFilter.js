import '../styles/TaskFilter.css';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
];

function TaskFilter({ filter, onChange, counts }) {
  return (
    <div className="task-filter" role="group" aria-label="Filter tasks">
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          className={`task-filter__btn ${filter === key ? 'is-active' : ''}`}
          onClick={() => onChange(key)}
          aria-pressed={filter === key}
        >
          {label}
          <span className="task-filter__count">{counts[key]}</span>
        </button>
      ))}
    </div>
  );
}

export default TaskFilter;
