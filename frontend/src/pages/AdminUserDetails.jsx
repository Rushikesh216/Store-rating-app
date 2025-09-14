import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function AdminUserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const headers = useMemo(() => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${base}/api/admin/users/${id}`, { headers });
        setUser(res.data);
      } catch (e) {
        setError(e.response?.data?.error || 'Failed to load user');
      }
    };
    load();
  }, [id]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>User Details</h2>
      <div><strong>Name:</strong> {user.name}</div>
      <div><strong>Email:</strong> {user.email}</div>
      <div><strong>Address:</strong> {user.address}</div>
      <div><strong>Role:</strong> {user.role}</div>
      {String(user.role).toUpperCase() === 'OWNER' && (
        <div><strong>Owner Average Rating:</strong> {Number(user.owner_rating ?? 0).toFixed(2)}</div>
      )}
    </div>
  );
}
