import React, { useState } from 'react';
import axios from 'axios';

export default function TaskForm() {
  const [form, setForm] = useState({
    title: '', description: '', priority: 'Medium', dueDate: '', status: 'Pending'
  });
  const [msg, setMsg] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setMsg('Title required'); return; }
    try {
      await axios.post('http://localhost:5000/tasks', form);
      setMsg('Task added');
      setForm({ title: '', description: '', priority: 'Medium', dueDate: '', status: 'Pending' });
      // notify other parts via custom event
      window.dispatchEvent(new Event('taskChanged'));
    } catch (err) {
      setMsg('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <h2>Add Task</h2>
      <form onSubmit={submit}>
        <div><input name="title" value={form.title} onChange={handleChange} placeholder="Title" /></div>
        <div><input name="description" value={form.description} onChange={handleChange} placeholder="Description" /></div>
        <div>
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option>Low</option><option>Medium</option><option>High</option>
          </select>
          <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} />
          <select name="status" value={form.status} onChange={handleChange}>
            <option>Pending</option><option>Completed</option>
          </select>
        </div>
        <button type="submit">Add</button>
      </form>
      <div>{msg}</div>
    </div>
  );
}
