import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateInitialSchedule } from '@/lib/scheduler/adaptive-engine';

export async function GET() {
  try {
    const topics = await prisma.syllabusTopic.findMany({ orderBy: { id: 'asc' } });
    const tasks = await prisma.dailyTask.findMany({ orderBy: { scheduledDate: 'asc' } });
    const pyqs = await prisma.pYQ.findMany();
    return NextResponse.json({ tasks, pyqs, topics });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { taskId, status, notes } = await req.json();
    const updated = await prisma.dailyTask.update({
      where: { id: taskId },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { personalNotes: notes })
      }
    });
    return NextResponse.json({ success: true, task: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}