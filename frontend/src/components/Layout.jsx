import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';

import { CityProvider } from '../context/CityContext.jsx';

const navClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium ${
    isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
  }`;

export default function Layout() {
  const navigate = useNavigate();
  const token = localStorage.getItem('admin_token');

  const onLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-lg font-semibold tracking-tight text-slate-900">
            Nearby <span className="text-sky-600">Services</span> Finder
          </Link>
          <nav className="flex items-center gap-2 rounded-full bg-slate-100 px-1 py-1">
            <NavLink to="/" className={navClass}>
              Home
            </NavLink>
            <NavLink to="/nearby" className={navClass}>
              Nearby
            </NavLink>
            <NavLink to="/admin/login" className={navClass}>
              Admin
            </NavLink>
            {token ? (
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-full text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 shadow-sm"
              >
                Logout
              </button>
            ) : null}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <CityProvider>
          <Outlet />
        </CityProvider>
      </main>
    </div>
  );
}
