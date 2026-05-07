import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getSession } from '@/lib/auth';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Verify Authentication & Authorization
    const session = await getSession();
    
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // 2. Parse request body
    const body = await request.json();
    const { status } = body;
    
    const { id } = await params;

    if (!status || !['PENDING', 'VERIFIED', 'RESOLVED'].includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    // 3. Update the report in the database
    const updatedReport = await prisma.report.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error("Error updating report:", error);
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
  }
}
