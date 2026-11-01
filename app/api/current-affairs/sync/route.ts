import { NextResponse } from 'next/server';
import { fetchVerifiedCurrentAffairs } from '@/lib/current-affairs/retrieval-service';

export async function GET() {
  const items = await fetchVerifiedCurrentAffairs();
  return NextResponse.json({ items });
}