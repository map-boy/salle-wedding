export function PageSpinner() {
  return (
    <div role="status" aria-live="polite" className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-line border-t-wine-600" />
      <p className="text-sm text-muted">Loading, please wait...</p>
    </div>
  );
}