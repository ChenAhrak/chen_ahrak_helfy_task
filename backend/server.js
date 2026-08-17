const express = require('express');
const cors = require('cors');

const taskRoutes = require('./routes/tasks');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'task-manager-api' });
});

app.use('/api/tasks', taskRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Task Manager API running on http://localhost:${PORT}`);
});

module.exports = app;
