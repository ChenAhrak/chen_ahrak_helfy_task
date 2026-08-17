const { PRIORITIES } = require('../data/store');

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function isValidDateString(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return (
    !Number.isNaN(date.getTime()) &&
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function validateId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return next(httpError(400, 'Task id must be a positive integer.'));
  }
  req.taskId = id;
  next();
}

function validateCreate(req, res, next) {
  const { title, description, priority, dueDate } = req.body;

  if (typeof title !== 'string' || title.trim() === '') {
    return next(httpError(400, 'Title is required and must be a non-empty string.'));
  }
  if (description !== undefined && typeof description !== 'string') {
    return next(httpError(400, 'Description must be a string.'));
  }
  if (priority !== undefined && !PRIORITIES.includes(priority)) {
    return next(httpError(400, `Priority must be one of: ${PRIORITIES.join(', ')}.`));
  }
  if (!isValidDateString(dueDate)) {
    return next(httpError(400, 'Due date is required and must be a valid YYYY-MM-DD date.'));
  }

  req.body.title = title.trim();
  next();
}

function validateUpdate(req, res, next) {
  const { title, description, priority, completed, dueDate } = req.body;

  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    return next(httpError(400, 'Title must be a non-empty string.'));
  }
  if (description !== undefined && typeof description !== 'string') {
    return next(httpError(400, 'Description must be a string.'));
  }
  if (priority !== undefined && !PRIORITIES.includes(priority)) {
    return next(httpError(400, `Priority must be one of: ${PRIORITIES.join(', ')}.`));
  }
  if (completed !== undefined && typeof completed !== 'boolean') {
    return next(httpError(400, 'Completed must be a boolean.'));
  }
  if (dueDate !== undefined && !isValidDateString(dueDate)) {
    return next(httpError(400, 'Due date must be a valid YYYY-MM-DD date.'));
  }

  if (typeof title === 'string') req.body.title = title.trim();
  next();
}

module.exports = { validateId, validateCreate, validateUpdate, httpError };
