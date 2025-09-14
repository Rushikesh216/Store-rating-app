import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

export default function AdminUsers() {
  const [q, setQ] = useState('');
  const [role, setRole] = useState('');
  const [sort, setSort] = useState('name');
  const [order, setOrder] = useState('asc');
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '', role: 'USER' });
  const [error, setError] = useState('');

  const headers = useMemo(() => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }, []);

  const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${base}/api/admin/users`, { params: { q, role, sort, order }, headers });
      setUsers(res.data);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to load users');
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleOrder = () => setOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));

  const onCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`${base}/api/admin/users`, { ...form, role: String(form.role).toUpperCase() }, { headers });
      setForm({ name: '', email: '', address: '', password: '', role: 'user' });
      fetchUsers();
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to create user');
    }
  };

  return (
    <div>
      <h2>Manage Users</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input placeholder="Search name/email/address" value={q} onChange={e => setQ(e.target.value)} />
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="">All Roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="OWNER">Owner</option>
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="address">Address</option>
          <option value="role">Role</option>
        </select>
        <button onClick={toggleOrder}>{order === 'asc' ? 'Asc' : 'Desc'}</button>
        <button onClick={fetchUsers}>Apply</button>
      </div>

      <table border="1" cellPadding="6" style={{ marginTop: 12 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.address}</td>
              <td>{u.role}</td>
              <td><a href={`/admin/users/${u.id}`}>View</a></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: 24 }}>Add User</h3>
      <form onSubmit={onCreate}>
        <div>
          <label>Name</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div>
          <label>Address</label>
          <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        </div>
        <div>
          <label>Role</label>
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="owner">Owner</option>
          </select>
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}


