const express = require('express');
const store = require('../data/store');
const {
  validateId,
  validateCreate,
  validateUpdate,
  httpError,
} = require('../middleware/validateTask');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json(store.getAll());
});

router.post('/', validateCreate, (req, res) => {
  const task = store.create(req.body);
  res.status(201).json(task);
});

router.put('/:id', validateId, validateUpdate, (req, res, next) => {
  const task = store.update(req.taskId, req.body);
  if (!task) return next(httpError(404, `Task ${req.taskId} not found.`));
  res.status(200).json(task);
});

router.patch('/:id/toggle', validateId, (req, res, next) => {
  const task = store.toggle(req.taskId);
  if (!task) return next(httpError(404, `Task ${req.taskId} not found.`));
  res.status(200).json(task);
});

router.delete('/:id', validateId, (req, res, next) => {
  const removed = store.remove(req.taskId);
  if (!removed) return next(httpError(404, `Task ${req.taskId} not found.`));
  res.status(204).send();
});

module.exports = router;
