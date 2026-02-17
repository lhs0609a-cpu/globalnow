import { NextResponse } from 'next/server';
import { getSignals } from '@/lib/services/signal-service';

export async function GET() {
  try {
    const signals = await getSignals();
    return NextResponse.json(signals);
  } catch {
    return NextResponse.json({ error: '시그널을 불러올 수 없습니다' }, { status: 500 });
  }
}
