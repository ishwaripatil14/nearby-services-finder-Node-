import React, { useMemo } from 'react';
import { CITY_PRESETS, OTHER_CITY_ID } from '../config/cities';

export default function CitySelector({ cityState, setCityState }) {
  const isOther = cityState.cityId === OTHER_CITY_ID;

  const cityOptions = useMemo(
    () => [...CITY_PRESETS, { id: OTHER_CITY_ID, label: 'Other (Custom)' }],
    []
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <label className="text-sm text-slate-700">City</label>
        <select
          className="border rounded-md px-3 py-2 bg-white"
          value={cityState.cityId}
          onChange={(e) =>
            setCityState((s) => ({
              ...s,
              cityId: e.target.value
            }))
          }
        >
          {cityOptions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {isOther ? (
        <div className="grid md:grid-cols-3 gap-2">
          <div>
            <label className="text-sm text-slate-700">Custom City Name</label>
            <input
              className="w-full border rounded-md px-3 py-2 bg-white"
              value={cityState.customCityName}
              onChange={(e) => setCityState((s) => ({ ...s, customCityName: e.target.value }))}
              placeholder="e.g., Kolhapur"
            />
          </div>
          <div>
            <label className="text-sm text-slate-700">Latitude</label>
            <input
              className="w-full border rounded-md px-3 py-2 bg-white"
              value={cityState.customLat}
              onChange={(e) => setCityState((s) => ({ ...s, customLat: e.target.value }))}
              placeholder="e.g., 16.7049"
            />
          </div>
          <div>
            <label className="text-sm text-slate-700">Longitude</label>
            <input
              className="w-full border rounded-md px-3 py-2 bg-white"
              value={cityState.customLng}
              onChange={(e) => setCityState((s) => ({ ...s, customLng: e.target.value }))}
              placeholder="e.g., 74.2433"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
