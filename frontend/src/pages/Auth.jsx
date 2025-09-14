import React, { useMemo, useState } from 'react';
import axios from 'axios';
import Joi from 'joi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const signupSchema = Joi.object({
  name: Joi.string().min(20).max(60).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  address: Joi.string().allow('').max(400),
  password: Joi.string().min(8).max(16).pattern(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).*$/).required(),
  role: Joi.string().valid('ADMIN','USER','OWNER').required()
});

export default function Auth() {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [role, setRole] = useState('USER');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', address: '', password: '' });
  const [error, setError] = useState('');

  const base = useMemo(() => import.meta.env.VITE_API_URL || 'http://localhost:5000', []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${base}/api/auth/login`, loginForm);
      setToken(res.data.token);
      setUser(res.data.user);
      const userRole = String(res.data.user?.role || '').toUpperCase();
      if (userRole === 'ADMIN') navigate('/admin');
      else if (userRole === 'OWNER') navigate('/owner');
      else navigate('/');
    } catch (e2) {
      setError(e2.response?.data?.error || 'Login failed');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    const payload = { ...signupForm, role: role.toUpperCase() };
    const { error: vError } = signupSchema.validate(payload);
    if (vError) { setError(vError.message); return; }
    try {
      await axios.post(`${base}/api/auth/signup`, payload);
      // After signup, send to login and prefill email
      setMode('login');
      setLoginForm({ email: signupForm.email, password: '' });
    } catch (e2) {
      setError(e2.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div>
      <h2>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={() => setMode('login')} disabled={mode==='login'}>Login</button>
        <button onClick={() => setMode('signup')} disabled={mode==='signup'}>Sign Up</button>
        {mode === 'signup' && (
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="USER">Normal User</option>
            <option value="OWNER">Store Owner</option>
            <option value="ADMIN">System Administrator</option>
          </select>
        )}
      </div>

      {mode === 'login' ? (
        <form onSubmit={handleLogin}>
          <div>
            <label>Email</label>
            <input type="email" value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} required />
          </div>
          <div>
            <label>Password</label>
            <input type="password" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} required />
          </div>
          <button type="submit">Login</button>
        </form>
      ) : (
        <form onSubmit={handleSignup}>
          <div>
            <label>Name</label>
            <input value={signupForm.name} onChange={e => setSignupForm({ ...signupForm, name: e.target.value })} required />
          </div>
          <div>
            <label>Email</label>
            <input type="email" value={signupForm.email} onChange={e => setSignupForm({ ...signupForm, email: e.target.value })} required />
          </div>
          <div>
            <label>Address</label>
            <input value={signupForm.address} onChange={e => setSignupForm({ ...signupForm, address: e.target.value })} />
          </div>
          <div>
            <label>Password</label>
            <input type="password" value={signupForm.password} onChange={e => setSignupForm({ ...signupForm, password: e.target.value })} required />
          </div>
          <button type="submit">Create account</button>
        </form>
      )}
    </div>
  );
}


