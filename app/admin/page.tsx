import prisma from "@/lib/db/prisma";
import ReportTable from "@/components/admin/ReportTable";

export default async function AdminDashboard() {
  // Fetch all reports from the database
  const reports = await prisma.report.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Convert dates to strings for the client component
  const formattedReports = reports.map(report => ({
    ...report,
    createdAt: report.createdAt.toISOString(),
    updatedAt: report.updatedAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-600">Review and manage all help requests across Cambodia.</p>
        </div>

        <ReportTable initialReports={formattedReports} />
      </div>
    </div>
  );
}
