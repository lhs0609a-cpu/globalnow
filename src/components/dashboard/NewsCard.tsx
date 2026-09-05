'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { NewsItem } from '@/types/news';
import { SoWhatButton } from '@/components/news/SoWhatButton';
import { BookmarkButton } from '@/components/news/BookmarkButton';
import { Kicker, LiveDot } from '@/components/ui/Badge';
import { formatRelativeTime } from '@/lib/utils/date';
import { formatNumber } from '@/lib/utils/format';
import { CATEGORIES } from '@/lib/constants/categories';

/**
 * 기사 한 건.
 *
 * 한 화면의 기사가 모두 같은 크기면 "무엇이 중요한지"를 독자가 직접
 * 판단해야 한다. 신문 1면이 머리기사·중간기사·단신으로 크기를 가르는 이유다.
 * 여기서도 세 가지 형태만 둔다.
 *   lead  머리기사 — 화면당 한 건. 사진 크게, 제목 32~40px
 *   card  중간기사 — 2단. 사진 16:9, 제목 17px
 *   row   단신     — 사진은 썸네일, 제목 15px. 한 화면에 10건 이상 들어간다
 *
 * 목록형(row)을 둔 이유는 밀도다. 카드만 깔면 한 화면에 4~6건이지만
 * 목록을 섞으면 15건이 들어간다(Techmeme·Bloomberg 지면이 같은 방식).
 */

type Variant = 'lead' | 'card' | 'row';

/** 30분 안에 들어온 기사에만 표시 — 남발하면 아무 뜻도 없어진다 */
const LIVE_WINDOW_MS = 30 * 60 * 1000;

function categoryLabel(id: string) {
  return CATEGORIES.find(c => c.id === id)?.nameKo ?? id;
}

function isFresh(publishedAt: string | Date | undefined) {
  if (!publishedAt) return false;
  const t = new Date(publishedAt).getTime();
  return Number.isFinite(t) && Date.now() - t < LIVE_WINDOW_MS;
}

function SourceLine({
  news,
  className,
}: {
  news: NewsItem;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        't-meta-sm flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-500',
        className
      )}
    >
      {news.source && (
        <span className="font-semibold text-slate-400">
          {news.source.countryFlag} {news.source.nameKo || news.source.name}
        </span>
      )}
      <span aria-hidden className="text-slate-600">
        ·
      </span>
      <time className="tnum" dateTime={new Date(news.publishedAt).toISOString()}>
        {formatRelativeTime(news.publishedAt)}
      </time>
      {news.viewCount ? (
        <>
          <span aria-hidden className="text-slate-600">
            ·
          </span>
          <span className="tnum">조회 {formatNumber(news.viewCount)}</span>
        </>
      ) : null}
      {isFresh(news.publishedAt) && (
        <span className="ml-0.5 inline-flex items-center gap-1 text-live">
          <LiveDot />
          NEW
        </span>
      )}
    </div>
  );
}

/** 안쪽 버튼은 카드 전체 링크 위로 올려야 눌린다 */
function Actions({ newsId, className }: { newsId: string; className?: string }) {
  return (
    <div className={clsx('relative z-10 flex items-center gap-0.5', className)}>
      <SoWhatButton newsId={newsId} />
      <BookmarkButton newsId={newsId} />
    </div>
  );
}

function Thumb({
  news,
  ratio,
  onError,
  className,
}: {
  news: NewsItem;
  ratio: string;
  onError: () => void;
  className?: string;
}) {
  return (
    <div className={clsx('overflow-hidden bg-surface-2', ratio, className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={news.imageUrl}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        onError={onError}
      />
    </div>
  );
}

export function NewsCard({
  news,
  variant = 'card',
}: {
  news: NewsItem;
  variant?: Variant;
}) {
  const [imageError, setImageError] = useState(false);
  const hasImage = Boolean(news.imageUrl) && !imageError;
  const title = news.titleKo || news.title;

  /* ── 머리기사 ─────────────────────────────────────────────── */
  if (variant === 'lead') {
    return (
      <article className="group relative grid gap-5 lg:grid-cols-[1.15fr_1fr] lg:gap-7">
        {hasImage && (
          <Thumb
            news={news}
            ratio="aspect-[16/9] lg:aspect-[3/2]"
            onError={() => setImageError(true)}
            className="rounded-xl"
          />
        )}
        <div className="flex flex-col justify-center">
          <div className="mb-2.5 flex items-center gap-2">
            <Kicker tone="accent">{categoryLabel(news.category)}</Kicker>
          </div>

          <h2 className="t-display text-slate-100">
            <a
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="tap-area transition-colors group-hover:text-accent-text"
            >
              {title}
            </a>
          </h2>

          {news.titleKo && news.title !== news.titleKo && (
            <p className="t-editorial mt-2 line-clamp-1 text-[1rem] italic text-slate-500">
              {news.title}
            </p>
          )}

          {news.summaryKo && (
            <p className="t-body-lg mt-3 line-clamp-3 text-slate-300">{news.summaryKo}</p>
          )}

          <div className="mt-4 flex items-center justify-between gap-3">
            <SourceLine news={news} />
            <Actions newsId={news.id} />
          </div>
        </div>
      </article>
    );
  }

  /* ── 단신 목록 ────────────────────────────────────────────── */
  if (variant === 'row') {
    return (
      <article className="group relative flex gap-4 py-4 transition-colors">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <Kicker>{categoryLabel(news.category)}</Kicker>
          </div>
          <h3 className="t-headline-sm text-slate-100">
            <a
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="tap-area line-clamp-2 transition-colors group-hover:text-accent-text"
            >
              {title}
            </a>
          </h3>
          <div className="mt-2 flex items-center justify-between gap-3">
            <SourceLine news={news} />
            {/* 손가락에는 hover 가 없다. 숨기는 건 포인터가 있는 화면에서만 */}
            <Actions
              newsId={news.id}
              className="-mr-1 transition-opacity lg:opacity-0 lg:focus-within:opacity-100 lg:group-hover:opacity-100"
            />
          </div>
        </div>

        {hasImage && (
          <Thumb
            news={news}
            ratio="aspect-[4/3] w-[5.5rem] sm:w-[6.5rem]"
            onError={() => setImageError(true)}
            className="flex-shrink-0 self-start rounded-lg"
          />
        )}
      </article>
    );
  }

  /* ── 중간기사 카드 ────────────────────────────────────────── */
  return (
    <article className="group surface relative flex flex-col overflow-hidden transition-colors hover:border-line-strong">
      {hasImage && (
        <Thumb news={news} ratio="aspect-[16/9]" onError={() => setImageError(true)} />
      )}

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-2">
          <Kicker>{categoryLabel(news.category)}</Kicker>
        </div>

        <h3 className="t-headline text-slate-100">
          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-area line-clamp-3 transition-colors group-hover:text-accent-text"
          >
            {title}
          </a>
        </h3>

        {news.summaryKo && (
          <p className="t-body-sm mt-2 line-clamp-2 text-slate-500">{news.summaryKo}</p>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-3.5">
          <SourceLine news={news} />
          <Actions newsId={news.id} className="-mr-1 -mb-1" />
        </div>
      </div>
    </article>
  );
}
