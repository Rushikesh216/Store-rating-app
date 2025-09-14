import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children, roles }) {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (roles && user) {
    const need = roles.map(r => String(r).toUpperCase());
    const have = String(user.role).toUpperCase();
    if (!need.includes(have)) return <Navigate to="/" replace />;
  }
  return children;
}

