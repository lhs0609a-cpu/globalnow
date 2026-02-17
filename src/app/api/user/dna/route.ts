import { NextResponse } from 'next/server';
import { getNewsDNA } from '@/lib/services/user-service';

export async function GET() {
  try {
    const dna = await getNewsDNA();
    return NextResponse.json(dna);
  } catch {
    return NextResponse.json({ error: '뉴스 DNA를 불러올 수 없습니다' }, { status: 500 });
  }
}
