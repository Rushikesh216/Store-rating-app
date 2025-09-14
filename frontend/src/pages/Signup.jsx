import React, { useState } from 'react';
import axios from 'axios';
import Joi from 'joi';
import { Link, useNavigate } from 'react-router-dom';

const schema = Joi.object({
  name: Joi.string().min(20).max(60).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  address: Joi.string().allow('').max(400),
  password: Joi.string().min(8).max(16).pattern(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).*$/).required()
});

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { error: vError } = schema.validate(form);
    if (vError) { setError(vError.message); return; }
    try {
      const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${base}/api/auth/signup`, { ...form, role: 'USER' });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={onSubmit}>
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
        <button type="submit">Create account</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

