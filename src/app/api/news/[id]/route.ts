import { NextRequest, NextResponse } from 'next/server';
import { getNewsById } from '@/lib/services/news-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const news = await getNewsById(id);

  if (!news) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(news);
}
