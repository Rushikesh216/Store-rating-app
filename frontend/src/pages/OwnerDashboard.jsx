import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

export default function OwnerDashboard() {
  const [raters, setRaters] = useState([]);
  const [average, setAverage] = useState(0);
  const [store, setStore] = useState(null);
  const [storeForm, setStoreForm] = useState({ name: '', email: '', address: '' });
  const [error, setError] = useState('');

  const headers = useMemo(() => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }, []);
  const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const load = async () => {
      try {
        const [r1, r2, r3] = await Promise.all([
          axios.get(`${base}/api/owner/raters`, { headers }),
          axios.get(`${base}/api/owner/average`, { headers }),
          axios.get(`${base}/api/owner/store`, { headers })
        ]);
        setRaters(r1.data);
        setAverage(r2.data.average);
        setStore(r3.data);
        if (r3.data) setStoreForm({ name: r3.data.name || '', email: r3.data.email || '', address: r3.data.address || '' });
      } catch (e) {
        setError(e.response?.data?.error || 'Failed to load owner data');
      }
    };
    load();
  }, []);

  const onSaveStore = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${base}/api/owner/store`, storeForm, { headers });
      setStore({ id: res.data.id, name: res.data.name, email: res.data.email, address: res.data.address, owner_id: res.data.owner_id });
    } catch (e2) {
      setError(e2.response?.data?.error || 'Failed to save store');
    }
  };

  return (
    <div>
      <h2>Owner Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div><strong>Average Rating:</strong> {Number(average).toFixed(2)}</div>
      <h3 style={{ marginTop: 16 }}>My Store</h3>
      <form onSubmit={onSaveStore}>
        <div>
          <label>Name</label>
          <input value={storeForm.name} onChange={e => setStoreForm({ ...storeForm, name: e.target.value })} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={storeForm.email} onChange={e => setStoreForm({ ...storeForm, email: e.target.value })} required />
        </div>
        <div>
          <label>Address</label>
          <input value={storeForm.address} onChange={e => setStoreForm({ ...storeForm, address: e.target.value })} />
        </div>
        <button type="submit">{store ? 'Update Store' : 'Create Store'}</button>
      </form>
      <h3 style={{ marginTop: 16 }}>Raters</h3>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {raters.map(r => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.email}</td>
              <td>{r.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


