import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({ status: '', priority: '', sort: 'dueDate', order: 'asc' });

  const load = async () => {
    try {
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.priority) params.priority = filter.priority;
      params.sort = filter.sort;
      params.order = filter.order;
      const res = await axios.get('http://localhost:5000/tasks', { params });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener('taskChanged', handler);
    return () => window.removeEventListener('taskChanged', handler);
  }, [filter]);

  const toggleComplete = async (t) => {
    try {
      const newStatus = t.status === 'Pending' ? 'Completed' : 'Pending';
      await axios.patch(`http://localhost:5000/tasks/${t._id}`, { status: newStatus });
      load();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Tasks</h2>
      <div>
        <label>Status:
          <select value={filter.status} onChange={e=>setFilter({...filter,status:e.target.value})}>
            <option value="">All</option><option>Pending</option><option>Completed</option>
          </select>
        </label>
        <label>Priority:
          <select value={filter.priority} onChange={e=>setFilter({...filter,priority:e.target.value})}>
            <option value="">All</option><option>Low</option><option>Medium</option><option>High</option>
          </select>
        </label>
        <label>Sort:
          <select value={filter.order} onChange={e=>setFilter({...filter,order:e.target.value})}>
            <option value="asc">Due date ↑</option>
            <option value="desc">Due date ↓</option>
          </select>
        </label>
      </div>

      <ul>
        {tasks.map(t => (
          <li key={t._id} style={{ margin: 10, border: '1px solid #ddd', padding: 8 }}>
            <strong>{t.title}</strong> — {t.priority} — {t.status}
            <div>{t.description}</div>
            <div>Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}</div>
            <button onClick={() => toggleComplete(t)}>{t.status === 'Pending' ? 'Mark Completed' : 'Mark Pending'}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
