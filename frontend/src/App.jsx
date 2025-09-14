import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import StoreList from './pages/StoreList.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Auth from './pages/Auth.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import AdminStores from './pages/AdminStores.jsx';
import OwnerDashboard from './pages/OwnerDashboard.jsx';
import UpdatePassword from './pages/UpdatePassword.jsx';
import MyRatings from './pages/MyRatings.jsx';
import AdminUserDetails from './pages/AdminUserDetails.jsx';

function App() {
  const { token, user, logout } = useAuth();
  return (
    <div className="container">
      <h1 className="app-title">Store Rating Platform</h1>
      <nav className="nav">
        <Link to="/">Stores</Link>
        {String(user?.role).toUpperCase() === 'ADMIN' && <Link to="/admin">Admin</Link>}
        {String(user?.role).toUpperCase() === 'ADMIN' && <Link to="/admin/users">Users</Link>}
        {String(user?.role).toUpperCase() === 'ADMIN' && <Link to="/admin/stores">Stores</Link>}
        {String(user?.role).toUpperCase() === 'OWNER' && <Link to="/owner">Owner</Link>}
        {token && <Link to="/account/password">Update Password</Link>}
        {token && <Link to="/me/ratings">My Ratings</Link>}
        {!token && <Link to="/auth">Login / Signup</Link>}
        <span className="spacer" />
        {token && (
          <>
            <span className="whoami">{user?.email} ({user?.role})</span>
            <button className="btn" onClick={logout}>Logout</button>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<StoreList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/account/password" element={
          <ProtectedRoute>
            <UpdatePassword />
          </ProtectedRoute>
        } />
        <Route path="/me/ratings" element={
          <ProtectedRoute roles={['USER','ADMIN','OWNER']}>
            <MyRatings />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute roles={['admin']}>
            <AdminUsers />
          </ProtectedRoute>
        } />
        <Route path="/admin/users/:id" element={
          <ProtectedRoute roles={['admin']}>
            <AdminUserDetails />
          </ProtectedRoute>
        } />
        <Route path="/admin/stores" element={
          <ProtectedRoute roles={['admin']}>
            <AdminStores />
          </ProtectedRoute>
        } />
        <Route path="/owner" element={
          <ProtectedRoute roles={['owner']}>
            <OwnerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/protected" element={
          <ProtectedRoute>
            <div>Protected content</div>
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;