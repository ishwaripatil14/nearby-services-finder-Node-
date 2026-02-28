import React, { useEffect, useMemo, useState } from 'react';

import {
  adminCreateService,
  adminDeleteService,
  adminListServices,
  adminUpdateService
} from '../../api/servicesApi.js';
import MapView from '../../components/MapView.jsx';

const categories = [
  { label: 'Hospital', value: 'hospital' },
  { label: 'ATM', value: 'ATM' },
  { label: 'Shop', value: 'shop' },
  { label: 'Others', value: 'others' }
];

export default function AdminDashboardPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('hospital');
  const [rating, setRating] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  const formTitle = useMemo(() => (editingId ? 'Edit Service' : 'Add Service'), [editingId]);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminListServices();
      setServices(data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setCity('');
    setCategory('hospital');
    setRating('');
    setLat('');
    setLng('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const payload = {
        name,
        city: city || undefined,
        category,
        rating: rating === '' ? undefined : Number(rating),
        lat: Number(lat),
        lng: Number(lng)
      };

      if (editingId) {
        await adminUpdateService(editingId, payload);
      } else {
        await adminCreateService(payload);
      }

      resetForm();
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Save failed');
    }
  };

  const onEdit = (s) => {
    setEditingId(s._id);
    setName(s.name || '');
    setCity(s.city || '');
    setCategory(s.category || 'hospital');
    setRating(s.rating === undefined ? '' : String(s.rating));
    const lngVal = s?.location?.coordinates?.[0];
    const latVal = s?.location?.coordinates?.[1];
    setLat(latVal === undefined ? '' : String(latVal));
    setLng(lngVal === undefined ? '' : String(lngVal));
  };

  const onDelete = async (id) => {
    setError('');
    try {
      await adminDeleteService(id);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-sm text-slate-600">Add, edit, and delete services.</p>
      </div>

      {error ? (
        <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>
      ) : null}

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="border rounded-xl bg-white shadow-sm p-4">
          <div className="font-semibold text-slate-900">{formTitle}</div>

          <form onSubmit={onSubmit} className="mt-3 space-y-3">
            <div>
              <label className="text-sm text-slate-700">Name</label>
              <input className="w-full border rounded-md px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <label className="text-sm text-slate-700">City (optional)</label>
              <input className="w-full border rounded-md px-3 py-2" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>

            <div>
              <label className="text-sm text-slate-700">Category</label>
              <select className="w-full border rounded-md px-3 py-2 bg-white" value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-700">Rating (0-5 optional)</label>
              <input className="w-full border rounded-md px-3 py-2" value={rating} onChange={(e) => setRating(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-700">Latitude</label>
                <input className="w-full border rounded-md px-3 py-2" value={lat} onChange={(e) => setLat(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-slate-700">Longitude</label>
                <input className="w-full border rounded-md px-3 py-2" value={lng} onChange={(e) => setLng(e.target.value)} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button type="submit" className="px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800">
                {editingId ? 'Update' : 'Create'}
              </button>
              {editingId ? (
                <button type="button" className="px-4 py-2 rounded-md border" onClick={resetForm}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
          <MapView services={services} />
        </div>
      </div>

      <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="font-semibold text-slate-900">All Services</div>
          <button className="text-sm px-3 py-1.5 rounded-md border hover:bg-slate-50" onClick={load} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <div className="divide-y">
          {(services || []).length === 0 ? (
            <div className="p-4 text-sm text-slate-600">No services found.</div>
          ) : (
            services.map((s) => (
              <div key={s._id} className="p-4 flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-sm text-slate-600">Category: {s.category}</div>
                  {s.rating !== undefined ? <div className="text-sm text-slate-600">Rating: {s.rating}</div> : null}
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-md border hover:bg-slate-50 text-sm" onClick={() => onEdit(s)}>
                    Edit
                  </button>
                  <button className="px-3 py-1.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-sm" onClick={() => onDelete(s._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
