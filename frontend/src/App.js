import React, { useEffect, useState } from 'react'
import TaskForm from './components/TaskForm'
import './App.css'

const App = () => {
  const [tasks, setTasks] = useState([])
  const [insights, setInsights] = useState({})

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:5000/tasks')
      const data = await res.json()
      setTasks(data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  // Fetch insights
  const fetchInsights = async () => {
    try {
      const res = await fetch('http://localhost:5000/insights')
      const data = await res.json()
      setInsights(data)
    } catch (error) {
      console.error('Error fetching insights:', error)
    }
  }

  // Add new task
  const handleAddTask = async newTask => {
    try {
      const res = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      })
      if (res.ok) {
        fetchTasks()
        fetchInsights()
      }
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  // Update task status
  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        fetchTasks()
        fetchInsights()
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  useEffect(() => {
    fetchTasks()
    fetchInsights()
  }, [])

  return (
    <div className="app-container">
      <h1>📝 Task Tracker with Smart Insights</h1>

      <TaskForm onAddTask={handleAddTask} />

      <div className="task-list">
        <h2>All Tasks</h2>
        {tasks.length === 0 ? (
          <p>No tasks yet</p>
        ) : (
          tasks.map(task => (
            <div key={task._id} className={`task-card ${task.priority.toLowerCase()}`}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>
                <strong>Priority:</strong> {task.priority}
              </p>
              <p>
                <strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {task.status}
              </p>

              {task.status !== 'Completed' && (
                <button onClick={() => handleUpdateStatus(task._id, 'Completed')}>
                  Mark as Done
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <div className="insights-panel">
        <h2>📊 Weekly Insights</h2>
        {insights.summary ? (
          <p>{insights.summary}</p>
        ) : (
          <p>Loading insights...</p>
        )}
      </div>
    </div>
  )
}

export default App
