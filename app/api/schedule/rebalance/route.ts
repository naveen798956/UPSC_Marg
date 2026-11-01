import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  const todayStr = new Date().toISOString().split('T')[0];
  const overdue = await prisma.dailyTask.findMany({
    where: { scheduledDate: { lt: todayStr }, status: { not: 'COMPLETED' } }
  });
  for (const t of overdue) {
    await prisma.dailyTask.update({ where: { id: t.id }, data: { scheduledDate: todayStr } });
  }
  return NextResponse.json({ success: true, message: `Reallocated ${overdue.length} overdue tasks to today.` });
}