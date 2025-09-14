import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

export default function AdminStores() {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('name');
  const [order, setOrder] = useState('asc');
  const [stores, setStores] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [error, setError] = useState('');

  const headers = useMemo(() => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }, []);

  const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchStores = async () => {
    try {
      const res = await axios.get(`${base}/api/admin/stores`, { params: { q, sort, order }, headers });
      setStores(res.data);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to load stores');
    }
  };

  useEffect(() => { fetchStores(); }, []);

  const toggleOrder = () => setOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));

  const onCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form, owner_id: form.owner_id ? Number(form.owner_id) : undefined };
      await axios.post(`${base}/api/admin/stores`, payload, { headers });
      setForm({ name: '', email: '', address: '', owner_id: '' });
      fetchStores();
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to create store');
    }
  };

  return (
    <div>
      <h2>Manage Stores</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input placeholder="Search name/email/address" value={q} onChange={e => setQ(e.target.value)} />
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="address">Address</option>
        </select>
        <button onClick={toggleOrder}>{order === 'asc' ? 'Asc' : 'Desc'}</button>
        <button onClick={fetchStores}>Apply</button>
      </div>

      <table border="1" cellPadding="6" style={{ marginTop: 12 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.address}</td>
              <td>{Number(s.rating).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: 24 }}>Add Store</h3>
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
          <label>Owner ID (optional)</label>
          <input type="number" value={form.owner_id} onChange={e => setForm({ ...form, owner_id: e.target.value })} />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}


