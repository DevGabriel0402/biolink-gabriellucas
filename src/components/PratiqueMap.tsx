import React, { useEffect, useRef, useState } from 'react';
import { PratiqueUnit } from '../data/pratiqueUnits';
import { PRATIQUE_ADDRESSES, UnitLocation } from '../data/pratiqueAddresses';

interface PratiqueMapProps {
  units: PratiqueUnit[];
  onSelectUnit: (unit: PratiqueUnit) => void;
}

interface NearbyResult {
  unit: PratiqueUnit;
  location: UnitLocation;
  distanceKm: number;
}

/** Haversine distance in km between two lat/lng points */
const haversineKm = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/** Exact lookup only: a gym can never inherit another gym's coordinates. */
const findUnitLocation = (unitName: string): UnitLocation | null =>
  PRATIQUE_ADDRESSES[unitName] ?? null;

export const PratiqueMap: React.FC<PratiqueMapProps> = ({ units, onSelectUnit }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const userCircleRef = useRef<any>(null);
  const validUnitsRef = useRef<Array<{ unit: PratiqueUnit; location: UnitLocation; idx: number; marker?: any }>>([]);

  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [nearby, setNearby] = useState<NearbyResult[]>([]);

  const logoUrl = 'https://pratiquefitness.com.br/wp-content/uploads/2022/09/ZAP-GURU-VICTOR-4-5.png';

  const handlePanTo = (lat: number, lng: number, marker?: any) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 17, { animate: true, duration: 0.8 });
      if (marker) {
        setTimeout(() => marker.openPopup(), 400); // Wait a bit for the pan animation
      }
    }
  };

  /* ─── Init map ──────────────────────────────────────────────────── */
  useEffect(() => {
    const leafletCssId = 'leaflet-css-cdn';
    const leafletJsId = 'leaflet-js-cdn';

    if (!document.getElementById(leafletCssId)) {
      const link = document.createElement('link');
      link.id = leafletCssId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const initMap = () => {
      const L = (window as any).L;
      if (!L || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, { zoomControl: false }).setView([-19.92, -43.94], 10);
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      const createPinIcon = (highlight = false) =>
        L.divIcon({
          className: 'pratique-custom-pin',
          html: `
            <div style="
              width: ${highlight ? 42 : 36}px;
              height: ${highlight ? 42 : 36}px;
              background: #0a0c0e;
              border: 2.5px solid ${highlight ? '#f97316' : '#ef4444'};
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 4px;
              cursor: pointer;
              transition: transform 0.2s ease;
            ">
              <img src="${logoUrl}" alt="Pratique" style="width:100%;height:100%;object-fit:contain;" />
            </div>`,
          iconSize: [highlight ? 44 : 38, highlight ? 44 : 38],
          iconAnchor: [highlight ? 22 : 19, highlight ? 22 : 19],
        });

      /* Build valid units list and place markers */
      const validUnits: Array<{ unit: PratiqueUnit; location: UnitLocation; idx: number; marker: any }> = [];

      units.forEach((unit, idx) => {
        const location = findUnitLocation(unit.name);
        if (!location) return;

        const marker = L.marker([location.lat, location.lng], { icon: createPinIcon(false) }).addTo(map);

        const popup = document.createElement('div');
        popup.style.cssText = 'text-align:center;padding:4px 2px;';
        popup.innerHTML = `
          <strong style="display:block;font-size:.9rem;color:#fff;margin-bottom:4px;font-weight:800;">${unit.name}</strong>
          <span style="display:block;font-size:.72rem;color:#9ca3af;margin-bottom:8px;">${location.address}</span>
          <button id="btn-select-map-${idx}" style="
            background:linear-gradient(135deg,#ef4444 0%,#dc2626 100%); 
            color:#fff;border:none;border-radius:8px;padding:8px 12px;
            font-size:.8rem;font-weight:800;cursor:pointer;width:100%;
          ">Matricular nesta Unidade →</button>`;

        marker.bindPopup(popup, { autoPanPadding: [20, 20] });
        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-select-map-${idx}`);
          if (btn) btn.onclick = () => onSelectUnit(unit);
        });
        marker.on('click', () => {
          map.setView([location.lat, location.lng], 17, { animate: true, duration: 0.5 });
        });

        validUnits.push({ unit, location, idx, marker });
      });

      validUnitsRef.current = validUnits;

      if (validUnits.length > 0) {
        const latLngs = validUnits.map(({ location }) => [location.lat, location.lng]);
        map.fitBounds(latLngs as any, { padding: [40, 40], maxZoom: 12 });
      }

      mapInstanceRef.current = map;
    };

    if ((window as any).L) {
      initMap();
    } else if (!document.getElementById(leafletJsId)) {
      const script = document.createElement('script');
      script.id = leafletJsId;
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => initMap();
      document.body.appendChild(script);
    } else {
      const existing = document.getElementById(leafletJsId);
      if (existing) existing.addEventListener('load', initMap);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [units, onSelectUnit]);

  /* ─── Geolocation handler ───────────────────────────────────────── */
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setGeoStatus('error');
      return;
    }
    setGeoStatus('loading');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: userLat, longitude: userLng } = pos.coords;
        const L = (window as any).L;
        const map = mapInstanceRef.current;
        if (!L || !map) return;

        /* Remove old user marker/circle */
        if (userMarkerRef.current) { userMarkerRef.current.remove(); userMarkerRef.current = null; }
        if (userCircleRef.current) { userCircleRef.current.remove(); userCircleRef.current = null; }

        /* User location marker */
        const userIcon = L.divIcon({
          className: '',
          html: `<div style="
            width:18px;height:18px;
            background:#3b82f6;
            border:3px solid #fff;
            border-radius:50%;
            box-shadow:0 0 0 4px rgba(59,130,246,.3);
          "></div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });

        userMarkerRef.current = L.marker([userLat, userLng], { icon: userIcon, zIndexOffset: 1000 })
          .addTo(map)
          .bindPopup('<strong style="color:#fff">📍 Você está aqui</strong>');

        /* Proximity circle (5 km) */
        userCircleRef.current = L.circle([userLat, userLng], {
          radius: 5000,
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.06,
          weight: 1.5,
          dashArray: '6 4',
        }).addTo(map);

        /* Calculate distances and sort */
        const results: NearbyResult[] = validUnitsRef.current
          .map(({ unit, location, marker }) => ({
            unit,
            location,
            marker,
            distanceKm: haversineKm(userLat, userLng, location.lat, location.lng),
          }))
          .sort((a, b) => a.distanceKm - b.distanceKm)
          .slice(0, 5);

        setNearby(results);
        setGeoStatus('done');

        /* Pan to user with all nearby */
        const bounds = L.latLngBounds([[userLat, userLng], ...results.map(r => [r.location.lat, r.location.lng])]);
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 13 });
      },
      () => {
        setGeoStatus('error');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  /* ─── Render ────────────────────────────────────────────────────── */
  return (
    <div style={{ width: '100%' }}>
      {/* Map container */}
      <div style={{ position: 'relative', width: '100%', height: '340px', borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--border-card)' }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%', background: '#090d16' }} />

        {/* Locate Me button — floating over the map */}
        <button
          onClick={handleLocateMe}
          disabled={geoStatus === 'loading'}
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            background: geoStatus === 'done' ? 'linear-gradient(135deg,#1d4ed8,#2563eb)' : 'linear-gradient(135deg,#1a1d24,#212530)',
            color: geoStatus === 'done' ? '#fff' : '#e2e8f0',
            border: `1.5px solid ${geoStatus === 'done' ? '#3b82f6' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: '10px',
            backdropFilter: 'blur(10px)',
            padding: '8px 14px',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: geoStatus === 'loading' ? 'wait' : 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            transition: 'all 0.2s ease',
          }}
        >
          {geoStatus === 'loading' ? (
            <>
              <span style={{ fontSize: '0.9rem', animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
              Localizando…
            </>
          ) : (
            <>
              <span style={{ fontSize: '1rem' }}>📍</span>
              {geoStatus === 'done' ? 'Localização ativa' : 'Ver academias próximas'}
            </>
          )}
        </button>

        {geoStatus === 'error' && (
          <div style={{
            position: 'absolute', top: '12px', left: '12px', zIndex: 1000,
            background: 'rgba(220,38,38,.15)', border: '1px solid #ef4444',
            color: '#fca5a5', borderRadius: '8px', padding: '7px 12px', fontSize: '0.75rem',
          }}>
            ⚠️ Não foi possível obter localização
          </div>
        )}
      </div>

      {/* Nearby panel */}
      {nearby.length > 0 && (
        <div style={{
          marginTop: '12px',
          background: 'var(--card-bg, #0f111720)',
          border: '1px solid var(--border-card, rgba(255,255,255,0.08))',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '10px 14px',
            borderBottom: '1px solid var(--border-card, rgba(255,255,255,0.08))',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ fontSize: '1rem' }}>🎯</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0' }}>
              Academias mais próximas de você
            </span>
          </div>

          {nearby.map((item, i) => (
            <div
              key={i}
              onClick={() => handlePanTo(item.location.lat, item.location.lng, (item as any).marker)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderBottom: i < nearby.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                transition: 'background 0.15s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {/* Rank badge */}
              <div style={{
                minWidth: '28px', height: '28px',
                background: i === 0 ? 'linear-gradient(135deg,#f97316,#ea580c)' : 'rgba(255,255,255,0.07)',
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 800,
                color: i === 0 ? '#fff' : '#9ca3af',
              }}>
                {i + 1}º
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.unit.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.location.address}
                </div>
              </div>

              {/* Distance + CTA */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <span style={{
                  fontSize: '0.72rem', fontWeight: 700,
                  color: item.distanceKm < 3 ? '#4ade80' : item.distanceKm < 8 ? '#facc15' : '#9ca3af',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: '6px', padding: '2px 7px',
                }}>
                  {item.distanceKm < 1
                    ? `${Math.round(item.distanceKm * 1000)} m`
                    : `${item.distanceKm.toFixed(1)} km`}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectUnit(item.unit);
                  }}
                  style={{
                    background: 'linear-gradient(135deg,#ef4444,#dc2626)',
                    color: '#fff', border: 'none', borderRadius: '7px',
                    padding: '5px 10px', fontSize: '0.72rem', fontWeight: 800,
                    cursor: 'pointer', whiteSpace: 'nowrap',
                  }}
                >
                  Matricular →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
