"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, CheckCircle2, Clock, MoreHorizontal } from "lucide-react";

type Report = {
  id: string;
  title: string;
  category: string;
  latitude: number;
  longitude: number;
  status: string;
  createdAt: string;
};

export default function ReportTable({ initialReports }: { initialReports: Report[] }) {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function handleStatusChange(id: string, newStatus: string) {
    setUpdatingId(id);
    
    try {
      const res = await fetch(`/api/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Update local state
        setReports(reports.map(r => r.id === id ? { ...r, status: newStatus } : r));
      } else {
        alert("Failed to update status. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while updating.");
    } finally {
      setUpdatingId(null);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-yellow-100 text-yellow-800"><Clock size={12} /> Pending</span>;
      case 'VERIFIED':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-800"><AlertCircle size={12} /> Verified</span>;
      case 'RESOLVED':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800"><CheckCircle2 size={12} /> Resolved</span>;
      default:
        return <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Report Details</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Coordinates</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">{report.title}</span>
                    <span className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-700 font-medium">{report.category}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                  {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(report.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <select
                      disabled={updatingId === report.id}
                      value={report.status}
                      onChange={(e) => handleStatusChange(report.id, e.target.value)}
                      className="block w-full text-sm border-gray-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500 bg-gray-50 py-1.5 px-3 disabled:opacity-50"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="VERIFIED">Verified</option>
                      <option value="RESOLVED">Resolved</option>
                    </select>
                    {updatingId === report.id && (
                      <div className="w-4 h-4 border-2 border-rose-200 border-t-rose-600 rounded-full animate-spin shrink-0"></div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            
            {reports.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
