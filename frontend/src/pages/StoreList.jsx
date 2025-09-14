import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StoreRatingForm from '../components/StoreRatingForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function StoreList() {
  const [stores, setStores] = useState([]);
  const [q, setQ] = useState('');
  const { token } = useAuth();

  const fetchStores = () => {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');
    axios.get(`${base}/api/stores`, {
      params: { q },
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => setStores(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div>
      <h2>Stores</h2>
      <div>
        <input
          placeholder="Search by name or address"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <button onClick={fetchStores}>Search</button>
      </div>
      <ul>
        {stores.map(store => (
          <li key={store.id}>
            <strong>{store.name}</strong> ({store.address})<br />
            Average Rating: {Number(store.avg_rating).toFixed(2)}<br />
            Your Rating: {store.user_rating ?? '—'}
            {token ? (
              <StoreRatingForm storeId={store.id} onRated={fetchStores} />
            ) : (
              <span style={{ marginLeft: 8, color: '#666' }}>Login to rate</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StoreList;