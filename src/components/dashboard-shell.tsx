import Link from "next/link";

export function DashboardShell({ title, intro, sections }: { title: string; intro: string; sections: string[] }) {
  return (
    <div className="container-page py-12">
      <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-muted">{intro}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <div key={s} className="card flex items-center justify-between p-6">
            <span className="font-medium">{s}</span>
            <span className="badge bg-gold-100 text-gold-500">Coming soon</span>
          </div>
        ))}
      </div>
      <Link href="/" className="btn btn-outline mt-10">Back to home</Link>
    </div>
  );
}