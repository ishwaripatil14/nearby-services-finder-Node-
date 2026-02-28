import React, { useEffect, useMemo, useState } from 'react';

import MapView from '../components/MapView.jsx';
import CitySelector from '../components/CitySelector.jsx';
import { fetchAllServices } from '../api/servicesApi.js';
import { useCityContext } from '../context/CityContext.jsx';
import { getCityCenter } from '../config/cities.js';

const categories = [
  { label: 'All', value: '' },
  { label: 'Hospital', value: 'hospital' },
  { label: 'ATM', value: 'ATM' },
  { label: 'Shop', value: 'shop' },
  { label: 'Others', value: 'others' }
];

export default function HomePage() {
  const { cityState, setCityState } = useCityContext();
  const [category, setCategory] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cityCenter = useMemo(() => getCityCenter(cityState), [cityState]);

  const title = useMemo(() => {
    const active = categories.find((c) => c.value === category);
    return active?.label ? `Services (${active.label})` : 'Services';
  }, [category]);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchAllServices(category);
        if (!alive) return;
        setServices(data);
      } catch (e) {
        if (!alive) return;
        setError(e?.response?.data?.message || e.message || 'Failed to load services');
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    run();

    return () => {
      alive = false;
    };
  }, [category]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-slate-600 text-sm">Browse services and view them on the map.</p>
        </div>

        <div className="flex items-end gap-6 flex-wrap">
          <CitySelector cityState={cityState} setCityState={setCityState} />

          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-700">Category</label>
            <select
              className="border rounded-md px-3 py-2 bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.label} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-start">
        <div className="space-y-3">
          {error ? (
            <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>
          ) : null}

          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-4 text-sm text-slate-600">Loading map...</div>
            ) : (
              <MapView services={services} center={[cityCenter.lat, cityCenter.lng, cityCenter.zoom]} />
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-white shadow-sm p-4 h-full">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-900">Highlighted Services</h2>
            <span className="text-xs text-slate-500">Top {Math.min(6, services.length)} results</span>
          </div>

          <div className="grid md:grid-cols-1 gap-3">
            {(services || []).slice(0, 6).map((s) => (
              <div key={s._id} className="border rounded-lg bg-slate-50 p-4 hover:bg-slate-100 transition">
                <div className="font-semibold text-slate-900">{s.name}</div>
                <div className="text-sm text-slate-600">Category: {s.category}</div>
                {s.rating !== undefined ? <div className="text-sm text-slate-600">Rating: {s.rating}</div> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
