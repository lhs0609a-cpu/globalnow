import { NextRequest, NextResponse } from 'next/server';
import { getBriefByDate } from '@/lib/services/brief-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  const { date } = await params;
  const brief = await getBriefByDate(date);
  return NextResponse.json(brief);
}
