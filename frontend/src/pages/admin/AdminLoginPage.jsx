import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { adminLogin } from '../../api/authApi.js';

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await adminLogin({ email, password });
      localStorage.setItem('admin_token', data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto border rounded-2xl bg-white/90 shadow-lg p-6 mt-8">
      <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
      <p className="text-sm text-slate-600 mt-1">Sign in to manage and curate nearby services.</p>

      {error ? (
        <div className="mt-4 p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>
      ) : null}

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <div>
          <label className="text-sm text-slate-700">Email</label>
          <input
            className="w-full border rounded-md px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
        </div>
        <div>
          <label className="text-sm text-slate-700">Password</label>
          <input
            className="w-full border rounded-md px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="mt-4 text-xs text-slate-500">
        Token is stored in localStorage as <code>admin_token</code>.
      </div>
    </div>
  );
}
