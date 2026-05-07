"use client";

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { LocateFixed } from "lucide-react";

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  defaultLat?: number;
  defaultLng?: number;
}

// A sub-component to handle map clicks for moving the pin
function MapEvents({ setPosition }: { setPosition: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

// A sub-component to handle flying to the user's location
function LocateControl({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, map.getZoom());
  }, [position, map]);
  return null;
}

export default function MapPicker({ onLocationSelect, defaultLat = 11.5564, defaultLng = 104.9282 }: MapPickerProps) {
  const [position, setPosition] = useState<[number, number]>([defaultLat, defaultLng]);
  const [isLocating, setIsLocating] = useState(false);

  // Sync position changes back to parent
  useEffect(() => {
    onLocationSelect(position[0], position[1]);
  }, [position, onLocationSelect]);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
        setIsLocating(false);
      },
      (err) => {
        console.error(err);
        alert("Could not fetch your location. Please check your browser permissions.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="relative w-full h-[300px] rounded-xl overflow-hidden border border-gray-200 shadow-inner z-0">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents setPosition={setPosition} />
        <LocateControl position={position} />
        <Marker position={position} />
      </MapContainer>

      {/* Locate Me Button overlay */}
      <button
        type="button"
        onClick={handleLocateMe}
        disabled={isLocating}
        className="absolute bottom-4 right-4 z-[400] bg-white text-gray-700 hover:text-rose-600 p-3 rounded-full shadow-lg border border-gray-100 hover:shadow-xl transition-all flex items-center justify-center disabled:opacity-70 group"
        title="Use my current location"
      >
        <LocateFixed size={20} className={isLocating ? "animate-pulse text-rose-500" : "group-hover:scale-110 transition-transform"} />
      </button>
    </div>
  );
}
