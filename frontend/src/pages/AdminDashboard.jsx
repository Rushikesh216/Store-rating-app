import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total_users: 0, total_stores: 0, total_ratings: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const token = localStorage.getItem('token');
        const res = await axios.get(`${base}/api/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (e) {
        setError(e.response?.data?.error || 'Failed to load stats');
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', gap: 24 }}>
        <div><strong>Total Users:</strong> {stats.total_users}</div>
        <div><strong>Total Stores:</strong> {stats.total_stores}</div>
        <div><strong>Total Ratings:</strong> {stats.total_ratings}</div>
      </div>
    </div>
  );
}


