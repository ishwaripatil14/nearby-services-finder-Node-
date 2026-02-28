import { useEffect, useMemo, useState } from 'react';
import { getDefaultCityState } from '../config/cities';

const STORAGE_KEY = 'nsf_city_state';

export default function useCity() {
  const [cityState, setCityState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return getDefaultCityState();
      const parsed = JSON.parse(raw);
      return { ...getDefaultCityState(), ...parsed };
    } catch {
      return getDefaultCityState();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cityState));
    } catch {
      // ignore
    }
  }, [cityState]);

  const api = useMemo(() => ({ cityState, setCityState }), [cityState]);
  return api;
}
