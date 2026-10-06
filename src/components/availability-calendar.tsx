const pad = (n: number) => String(n).padStart(2, "0");

export function Calendar({ booked, months, locale }: { booked: string[]; months: number; locale?: string }) {
  const loc = locale || undefined;
  const set = new Set(booked);
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const wd = Array.from({ length: 7 }, (_, k) => new Date(Date.UTC(2024, 0, 1 + k)).toLocaleDateString(loc, { weekday: "narrow", timeZone: "UTC" }));
  return (
    <div className="mb-5 grid gap-4 sm:grid-cols-3">
      {Array.from({ length: months }, (_, i) => {
        const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + i, 1));
        const y = d.getUTCFullYear(), m = d.getUTCMonth();
        const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
        const cells: (number | null)[] = [
          ...Array.from({ length: (d.getUTCDay() + 6) % 7 }, () => null),
          ...Array.from({ length: days }, (_, k) => k + 1),
        ];
        return (
          <div key={i}>
            <p className="mb-2 text-sm font-medium">{d.toLocaleDateString(loc, { month: "long", year: "numeric", timeZone: "UTC" })}</p>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {wd.map((w, k) => <span key={"w" + k} className="text-muted">{w}</span>)}
              {cells.map((day, k) => {
                if (day === null) return <span key={k} />;
                const ds = `${y}-${pad(m + 1)}-${pad(day)}`;
                const cls = set.has(ds) ? "bg-neutral-200 text-neutral-500 line-through" : ds < today ? "text-neutral-300" : "bg-green-50 text-green-800";
                return <span key={k} className={"rounded py-1 " + cls}>{day}</span>;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}