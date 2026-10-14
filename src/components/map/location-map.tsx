"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const pinIcon = L.divIcon({
  className: "daak-pin",
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  html: `<svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M16 41s12-11.4 12-22A12 12 0 1 0 4 19c0 10.6 12 22 12 22z" fill="#1D4ED8" stroke="#ffffff" stroke-width="2"/><circle cx="16" cy="17" r="4.2" fill="#ffffff"/></svg>`,
});

export default function LocationMap({
  lat,
  lng,
  interactive = true,
  recenterToken = 0,
  onMove,
}: {
  lat: number;
  lng: number;
  interactive?: boolean;
  recenterToken?: number;
  onMove?: (lat: number, lng: number) => void;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const map = L.map(node, {
      center: [lat, lng],
      zoom: 17,
      scrollWheelZoom: false,
      zoomControl: interactive,
      dragging: interactive,
      doubleClickZoom: interactive,
      touchZoom: interactive,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const marker = L.marker([lat, lng], { icon: pinIcon, draggable: interactive }).addTo(map);
    marker.on("dragend", () => {
      const next = marker.getLatLng();
      onMoveRef.current?.(next.lat, next.lng);
    });
    if (interactive) {
      map.on("click", (event) => {
        onMoveRef.current?.(event.latlng.lat, event.latlng.lng);
      });
    }

    mapRef.current = map;
    markerRef.current = marker;
    const frame = requestAnimationFrame(() => map.invalidateSize());

    return () => {
      cancelAnimationFrame(frame);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // The map is created once for this mode. Marker and camera updates run below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive]);

  useEffect(() => {
    markerRef.current?.setLatLng([lat, lng]);
  }, [lat, lng]);

  useEffect(() => {
    if (!recenterToken || !mapRef.current) return;
    mapRef.current.flyTo([lat, lng], Math.max(mapRef.current.getZoom(), 17), { duration: 0.55 });
  }, [recenterToken, lat, lng]);

  return <div ref={nodeRef} className="h-full w-full" />;
}
