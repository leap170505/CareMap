"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, MapPin } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import MapPicker so it only renders on the client side
// This is required because Leaflet relies on the browser 'window' object
const MapPicker = dynamic(() => import("@/components/map/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400">
      Loading map...
    </div>
  ),
});

export default function ReportForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [latitude, setLatitude] = useState(11.5564);
  const [longitude, setLongitude] = useState(104.9282);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    const formData = new FormData(e.currentTarget);

    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      latitude: latitude,
      longitude: longitude,
    };

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit report");
      }

      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-rose-100/50 p-8 border border-rose-50 w-full max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Submit a Need</h2>
        <p className="text-gray-500">Help us locate and assist those who need it most.</p>
      </div>

      {status === "success" && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-emerald-600" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted!</h3>
            <p className="text-gray-600 mb-8">
              Thank you for your submission. Our team has received your report and will verify it shortly.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 animate-in fade-in slide-in-from-top-4">
          <AlertCircle className="shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-semibold">Submission Failed</h4>
            <p className="text-sm opacity-90 mt-1">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-gray-700">Short Title</label>
          <input
            type="text"
            id="title"
            name="title"
            required
            placeholder="e.g., Need rice and cooking oil"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium text-gray-700">Category</label>
          <div className="relative">
            <select
              id="category"
              name="category"
              required
              defaultValue=""
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none appearance-none bg-white"
            >
              <option value="" disabled>Select a category</option>
              <option value="FOOD">Food & Water</option>
              <option value="EDUCATION">Education Supplies</option>
              <option value="HEALTHCARE">Medical & Healthcare</option>
              <option value="OTHER">Other Needs</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium text-gray-700">Detailed Description</label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            placeholder="Describe the situation in detail..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none resize-none"
          ></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
            <MapPin size={14} className="text-rose-500" /> Location
          </label>
          <p className="text-xs text-gray-500 mb-2">Drag the pin or click "Locate Me" to set the exact location.</p>
          <MapPicker
            defaultLat={latitude}
            defaultLng={longitude}
            onLocationSelect={(lat, lng) => {
              setLatitude(lat);
              setLongitude(lng);
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-4 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-rose-200 mt-4"
        >
          {isSubmitting ? (
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send size={18} />
              Submit Report
            </>
          )}
        </button>
      </form>
    </div>
  );
}
