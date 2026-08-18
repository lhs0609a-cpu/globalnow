/**
 * 비어 있는 상태.
 *
 * 화면마다 큰 이모지와 제각각인 여백으로 「준비 중」을 표현하고 있었다.
 * 한 벌로 묶어 어느 화면에서 마주쳐도 같은 무게로 읽히게 한다.
 */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-slate-800 px-6 py-16 text-center">
      <p className="text-[0.875rem] font-medium text-slate-300">{title}</p>
      {description && (
        <p className="mx-auto mt-1 max-w-sm text-[0.8125rem] leading-relaxed text-slate-500">
          {description}
        </p>
      )}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
