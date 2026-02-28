import React, { useEffect, useMemo, useState } from 'react';

import MapView from '../components/MapView.jsx';
import { fetchNearbyServices } from '../api/servicesApi.js';
import CitySelector from '../components/CitySelector.jsx';
import { useCityContext } from '../context/CityContext.jsx';
import { getCityCenter } from '../config/cities.js';

export default function NearbyPage() {
  const { cityState, setCityState } = useCityContext();

  const cityCenter = useMemo(() => getCityCenter(cityState), [cityState]);

  const [lat, setLat] = useState(String(cityCenter.lat));
  const [lng, setLng] = useState(String(cityCenter.lng));
  const [radius, setRadius] = useState('5');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [services, setServices] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    setLat(String(cityCenter.lat));
    setLng(String(cityCenter.lng));
  }, [cityCenter.lat, cityCenter.lng]);

  const center = useMemo(() => {
    const latNum = Number(lat);
    const lngNum = Number(lng);
    if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) return undefined;
    return [latNum, lngNum, cityCenter.zoom];
  }, [lat, lng, cityCenter.zoom]);

  const onSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const data = await fetchNearbyServices({
        lat: Number(lat),
        lng: Number(lng),
        radius: Number(radius)
      });
      setServices(data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load nearby services');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Nearby Services</h1>
        <p className="text-slate-600 text-sm">Search by coordinates and radius (km).</p>
      </div>

      <CitySelector cityState={cityState} setCityState={setCityState} />

      <form onSubmit={onSearch} className="grid md:grid-cols-4 gap-3 items-end mt-2">
        <div>
          <label className="text-sm text-slate-700">Latitude</label>
          <input
            className="w-full border rounded-md px-3 py-2 bg-white"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="18.5204"
          />
        </div>
        <div>
          <label className="text-sm text-slate-700">Longitude</label>
          <input
            className="w-full border rounded-md px-3 py-2 bg-white"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder="73.8567"
          />
        </div>
        <div>
          <label className="text-sm text-slate-700">Radius (km)</label>
          <input
            className="w-full border rounded-md px-3 py-2 bg-white"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            placeholder="5"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error ? (
        <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start">
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <MapView services={services} center={center} />
        </div>

        <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b font-semibold text-slate-900">Results</div>
          <div className="divide-y max-h-[480px] overflow-auto">
            {(services || []).length === 0 ? (
              <div className="p-4 text-sm text-slate-600">
                {hasSearched
                  ? 'No services were found for this location. There may be no data for this city. Please select another city or use Other (Custom).'
                  : 'No results yet. Please search using the form above.'}
              </div>
            ) : (
              services.map((s) => (
                <div key={s._id} className="p-4">
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-sm text-slate-600">Category: {s.category}</div>
                  {s.rating !== undefined ? (
                    <div className="text-sm text-slate-600">Rating: {s.rating}</div>
                  ) : null}
                  {s.distanceKm !== undefined ? (
                    <div className="text-sm text-slate-600">
                      Distance: {Number(s.distanceKm).toFixed(2)} km
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
