
const PRIORITIES = ['low', 'medium', 'high'];

let tasks = [
  {
    id: 1,
    title: 'Set up project repository',
    description: 'Create the repo, add .gitignore and a README.',
    completed: true,
    createdAt: new Date('2026-08-15T09:00:00.000Z'),
    priority: 'high',
    dueDate: '2026-08-16',
  },
  {
    id: 2,
    title: 'Design the task model',
    description: 'Decide on fields, priorities and validation rules.',
    completed: true,
    createdAt: new Date('2026-08-15T11:30:00.000Z'),
    priority: 'medium',
    dueDate: '2026-08-18',
  },
  {
    id: 3,
    title: 'Build the endless carousel',
    description: 'Vanilla React carousel with smooth infinite scrolling.',
    completed: false,
    createdAt: new Date('2026-08-16T08:15:00.000Z'),
    priority: 'high',
    dueDate: '2026-08-20',
  },
  {
    id: 4,
    title: 'Write API documentation',
    description: 'Document every endpoint in the README.',
    completed: false,
    createdAt: new Date('2026-08-16T14:00:00.000Z'),
    priority: 'low',
    dueDate: '2026-08-25',
  },
  {
    id: 5,
    title: 'Polish responsive styling',
    description: 'Make sure the UI looks good on mobile screens.',
    completed: false,
    createdAt: new Date('2026-08-17T07:45:00.000Z'),
    priority: 'medium',
    dueDate: '2026-08-22',
  },
];

let nextId = tasks.length + 1;

const store = {
  PRIORITIES,

  getAll() {
    return tasks;
  },

  findById(id) {
    return tasks.find((task) => task.id === id);
  },

  create({ title, description = '', priority = 'medium', completed = false, dueDate }) {
    const task = {
      id: nextId++,
      title,
      description,
      completed,
      createdAt: new Date(),
      priority,
      dueDate,
    };
    tasks.push(task);
    return task;
  },

  update(id, updates) {
    const task = this.findById(id);
    if (!task) return undefined;
    const allowed = ['title', 'description', 'priority', 'completed', 'dueDate'];
    for (const key of allowed) {
      if (updates[key] !== undefined) task[key] = updates[key];
    }
    return task;
  },

  remove(id) {
    const index = tasks.findIndex((task) => task.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
  },

  toggle(id) {
    const task = this.findById(id);
    if (!task) return undefined;
    task.completed = !task.completed;
    return task;
  },
};

module.exports = store;
