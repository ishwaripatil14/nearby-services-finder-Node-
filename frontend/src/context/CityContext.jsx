import React, { createContext, useContext } from 'react';
import useCity from '../hooks/useCity';

const CityContext = createContext(null);

export function CityProvider({ children }) {
  const value = useCity();
  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}

export function useCityContext() {
  const ctx = useContext(CityContext);
  if (!ctx) {
    throw new Error('useCityContext must be used within a CityProvider');
  }
  return ctx;
}
