export function DashboardShell({ title, sections }: { title: string; sections: string[] }) {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">{title}</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {sections.map((s) => (
          <div key={s} className="rounded-lg border p-6 font-medium">
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}