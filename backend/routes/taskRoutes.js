const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// Add a new task
router.post('/', async (req, res) => {
  try {
    const { title, description, priority, dueDate, status } = req.body;

    if (!title || !priority || !dueDate) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      status: status || 'Pending',
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all tasks (with filters)
router.get('/', async (req, res) => {
  try {
    const { status, priority } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  Update task status or priority
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//  Insights route — summary of tasks
router.get('/insights', async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const highPriority = await Task.countDocuments({ priority: 'High' });
    const pendingTasks = await Task.countDocuments({ status: 'Pending' });

    const message = `You have ${totalTasks} tasks — ${highPriority} are High priority and ${pendingTasks} are still pending.`;

    res.json({
      totalTasks,
      highPriority,
      pendingTasks,
      message,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

