import React, { useState } from 'react';
import axios from 'axios';

export default function UpdatePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setErr('');
    try {
      const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      await axios.post(`${base}/api/auth/password`, { currentPassword, newPassword }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg('Password updated');
      setCurrentPassword('');
      setNewPassword('');
    } catch (e) {
      setErr(e.response?.data?.error || 'Failed to update password');
    }
  };

  return (
    <div>
      <h2>Update Password</h2>
      {msg && <p style={{ color: 'green' }}>{msg}</p>}
      {err && <p style={{ color: 'red' }}>{err}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <label>Current Password</label>
          <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
        </div>
        <div>
          <label>New Password</label>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
}


