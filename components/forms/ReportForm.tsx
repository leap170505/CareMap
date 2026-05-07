"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, MapPin } from "lucide-react";

export default function ReportForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    const formData = new FormData(e.currentTarget);
    
    // Simulate getting coordinates from a map picker (we'll implement real map picking later)
    // For now, we'll use a hardcoded default or require manual entry
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      latitude: parseFloat(formData.get("latitude") as string) || 11.5564, // Default PP
      longitude: parseFloat(formData.get("longitude") as string) || 104.9282,
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
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3 text-emerald-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-semibold">Report Submitted</h4>
            <p className="text-sm opacity-90 mt-1">Thank you for your submission. Our team will verify it shortly.</p>
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
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium text-gray-700">Category</label>
          <div className="relative">
            <select
              id="category"
              name="category"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none appearance-none bg-white"
            >
              <option value="" disabled selected>Select a category</option>
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
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none resize-none"
          ></textarea>
        </div>

        {/* Temporary coordinate inputs until we add the map picker */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="latitude" className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <MapPin size={14} className="text-rose-500" /> Latitude
            </label>
            <input
              type="number"
              step="any"
              id="latitude"
              name="latitude"
              required
              defaultValue={11.5564}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="longitude" className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <MapPin size={14} className="text-rose-500" /> Longitude
            </label>
            <input
              type="number"
              step="any"
              id="longitude"
              name="longitude"
              required
              defaultValue={104.9282}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none bg-gray-50"
            />
          </div>
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
