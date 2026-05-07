"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { formatDistanceToNow } from "date-fns";

type Report = {
  id: string;
  title: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  status: string;
  createdAt: string;
};

export default function MainMap() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Center on Cambodia by default
  const defaultCenter: [number, number] = [12.5657, 104.9910];

  // Bounding box for Cambodia [SouthWest, NorthEast]
  const cambodiaBounds: [[number, number], [number, number]] = [
    [9.9, 102.1], // SouthWest corner
    [14.7, 107.7] // NorthEast corner
  ];

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch("/api/reports");
        if (res.ok) {
          const data = await res.json();
          setReports(data);
        }
      } catch (error) {
        console.error("Failed to fetch reports", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchReports();
  }, []);

  if (isLoading) {
    return (
      <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-64px)] z-0">
      <MapContainer
        center={defaultCenter}
        zoom={7}
        minZoom={7}
        maxBounds={cambodiaBounds}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {reports.map((report) => (
          <Marker key={report.id} position={[report.latitude, report.longitude]}>
            <Popup className="rounded-xl overflow-hidden shadow-lg border-none">
              <div className="p-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider
                    ${report.category === 'FOOD' ? 'bg-orange-100 text-orange-700' : 
                      report.category === 'HEALTHCARE' ? 'bg-red-100 text-red-700' : 
                      report.category === 'EDUCATION' ? 'bg-blue-100 text-blue-700' : 
                      'bg-gray-100 text-gray-700'}`}
                  >
                    {report.category}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider
                    ${report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                      report.status === 'VERIFIED' ? 'bg-blue-100 text-blue-700' : 
                      'bg-emerald-100 text-emerald-700'}`}
                  >
                    {report.status}
                  </span>
                </div>
                
                <h3 className="font-bold text-gray-900 text-base leading-tight mb-1">{report.title}</h3>
                
                <p className="text-xs text-gray-500 mb-3">
                  Reported {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                </p>
                
                <p className="text-sm text-gray-700 leading-relaxed border-t border-gray-100 pt-2">
                  {report.description}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Floating stats card */}
      <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-100 pointer-events-none">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1">Active Needs</h3>
        <div className="text-3xl font-black text-rose-600">{reports.filter(r => r.status !== 'RESOLVED').length}</div>
        <p className="text-xs text-gray-500 mt-1">across Cambodia</p>
      </div>
    </div>
  );
}
