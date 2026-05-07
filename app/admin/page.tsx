export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to the secure admin area. Only admins can see this page.</p>
        <div className="mt-8 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 font-medium">
          Authentication is working perfectly! Next, we will build the data table here.
        </div>
      </div>
    </div>
  );
}
