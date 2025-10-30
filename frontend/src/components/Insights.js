import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Insights() {
  const [ins, setIns] = useState(null);
  const load = async () => {
    try {
      // If your backend offers /tasks/insights
      const res = await axios.get('http://localhost:5000/tasks/insights');
      setIns(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    load();
    const h = () => load();
    window.addEventListener('taskChanged', h);
    return () => window.removeEventListener('taskChanged', h);
  }, []);
  if (!ins) return <div>Loading insights...</div>;
  return (
    <div>
      <h2>Insights</h2>
      <div><strong>Summary:</strong> {ins.summary}</div>
      <div>Total tasks: {ins.total}</div>
      <div>Tasks due in 7 days: {ins.dueSoonCount}</div>
    </div>
  );
}
