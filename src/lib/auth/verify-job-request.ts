import { timingSafeEqual } from 'node:crypto';
import type { NextRequest } from 'next/server';

/**
 * 수집·생성 잡(api/cron/*)을 호출할 자격이 있는 요청인지 확인한다.
 *
 * 원래는 각 라우트에서 이렇게 검사했다.
 *
 *   if (authHeader !== `Bearer ${process.env.CRON_SECRET}`)
 *
 * CRON_SECRET이 비어 있으면 템플릿 문자열이 "Bearer undefined"로 굳는다.
 * 그래서 그 값을 그대로 보내면 인증을 통과했다. 배포된 공개 주소에서
 * 확인된 실제 구멍이었고, 8개 잡 전부가 같은 코드를 쓰고 있었다.
 *
 * 비밀값이 없으면 통과가 아니라 차단이 기본이어야 한다. 비교는 길이를
 * 먼저 확인한 뒤 timingSafeEqual로 해서 응답 시간으로 값을 더듬는 것도 막는다.
 */
export function isAuthorizedJobRequest(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;

  // 비밀값이 설정되지 않았으면 아무도 통과시키지 않는다
  if (!secret) return false;

  const header = request.headers.get('authorization');
  if (!header) return false;

  const received = Buffer.from(header);
  const expected = Buffer.from(`Bearer ${secret}`);

  // timingSafeEqual은 길이가 다르면 예외를 던지므로 먼저 걸러낸다
  if (received.length !== expected.length) return false;

  return timingSafeEqual(received, expected);
}
