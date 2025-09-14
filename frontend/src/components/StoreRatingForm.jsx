import React, { useState } from 'react';
import axios from 'axios';

function StoreRatingForm({ storeId, onRated }) {
  const [rating, setRating] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    await axios.post(`${base}/api/stores/rate`, {
      store_id: storeId,
      rating
    }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (onRated) onRated();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Rate this store:
        <select value={rating} onChange={e => setRating(Number(e.target.value))}>
          {[1,2,3,4,5].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default StoreRatingForm;