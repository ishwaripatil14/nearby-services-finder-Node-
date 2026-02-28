import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

const defaultCenter = [18.5204, 73.8567];

const baseMarkerOptions = {
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
};

const hospitalIcon = new L.Icon({
  ...baseMarkerOptions,
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconRetinaUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png'
});

const atmIcon = new L.Icon({
  ...baseMarkerOptions,
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  iconRetinaUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png'
});

const shopIcon = new L.Icon({
  ...baseMarkerOptions,
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  iconRetinaUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png'
});

const otherIcon = new L.Icon({
  ...baseMarkerOptions,
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
  iconRetinaUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png'
});

export default function MapView({ services, center }) {
  const mapCenter = useMemo(() => {
    if (center && Number.isFinite(center[0]) && Number.isFinite(center[1])) return center;
    return defaultCenter;
  }, [center]);

  const zoom = Number.isFinite(center?.[2]) ? center[2] : 13;

  function Recenter({ lat, lng, z }) {
    const map = useMap();
    useEffect(() => {
      if (Number.isFinite(lat) && Number.isFinite(lng) && Number.isFinite(z)) {
        map.setView([lat, lng], z, { animate: true });
      }
    }, [lat, lng, z, map]);
    return null;
  }

  return (
    <div className="h-[520px] w-full rounded-lg overflow-hidden border bg-white">
      <MapContainer center={mapCenter} zoom={zoom} scrollWheelZoom className="h-full w-full">
        <Recenter lat={mapCenter[0]} lng={mapCenter[1]} z={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {(services || []).map((s) => {
          const lng = s?.location?.coordinates?.[0];
          const lat = s?.location?.coordinates?.[1];
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

          let icon = otherIcon;
          const cat = (s.category || '').toString().toLowerCase();
          if (cat === 'hospital') icon = hospitalIcon;
          else if (cat === 'atm') icon = atmIcon;
          else if (cat === 'shop') icon = shopIcon;

          return (
            <Marker key={s._id} position={[lat, lng]} icon={icon}>
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">{s.name}</div>
                  {s.city ? <div className="text-slate-600">City: {s.city}</div> : null}
                  <div className="text-slate-600">Category: {s.category}</div>
                  {s.rating !== undefined ? (
                    <div className="text-slate-600">Rating: {s.rating}</div>
                  ) : null}
                  {s.distanceKm !== undefined ? (
                    <div className="text-slate-600">Distance: {Number(s.distanceKm).toFixed(2)} km</div>
                  ) : null}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
