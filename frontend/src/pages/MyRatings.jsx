import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

export default function MyRatings() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  const headers = useMemo(() => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${base}/api/stores/me/ratings`, { headers });
        setRows(res.data);
      } catch (e) {
        setError(e.response?.data?.error || 'Failed to load ratings');
      }
    };
    load();
  }, []);

  return (
    <div>
      <h2>My Ratings</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Store</th>
            <th>Address</th>
            <th>Rating</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.store_name}</td>
              <td>{r.store_address}</td>
              <td>{r.rating}</td>
              <td>{new Date(r.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


