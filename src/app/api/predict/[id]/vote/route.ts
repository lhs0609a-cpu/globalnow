import { NextResponse } from 'next/server';
export function GET() { return NextResponse.json({ error: '의사결정 도구 개편으로 종료된 기능입니다.' }, { status:410 }); }
export const POST = GET;
