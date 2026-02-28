export const CITY_PRESETS = [
  { id: 'pune', label: 'Pune', lat: 18.5204, lng: 73.8567, zoom: 13 },
  { id: 'mumbai', label: 'Mumbai', lat: 18.9402, lng: 72.8356, zoom: 12 },
  { id: 'nashik', label: 'Nashik', lat: 19.9975, lng: 73.7898, zoom: 13 },
  { id: 'nagpur', label: 'Nagpur', lat: 21.1458, lng: 79.0882, zoom: 13 },
  { id: 'aurangabad', label: 'Aurangabad', lat: 19.8762, lng: 75.3433, zoom: 13 }
];

export const OTHER_CITY_ID = 'other';

export const getDefaultCityState = () => ({
  cityId: 'pune',
  customCityName: '',
  customLat: '',
  customLng: ''
});

export const getCityCenter = (cityState) => {
  const preset = CITY_PRESETS.find((c) => c.id === cityState.cityId);
  if (preset) return { lat: preset.lat, lng: preset.lng, zoom: preset.zoom, label: preset.label };

  const lat = Number(cityState.customLat);
  const lng = Number(cityState.customLng);
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return { lat, lng, zoom: 13, label: cityState.customCityName || 'Custom' };
  }

  const pune = CITY_PRESETS.find((c) => c.id === 'pune');
  return { lat: pune.lat, lng: pune.lng, zoom: pune.zoom, label: pune.label };
};
