import { txt } from "@/lib/content";
import { readDb } from "@/lib/db";
import { digits } from "@/lib/format";

export async function WhatsAppButton() {
  const { settings: s } = await readDb();
  let n = digits(s.whatsapp || s.contactPhone);
  if (!n) return null;
  if (n.startsWith("0")) n = "250" + n.slice(1);
  const text = encodeURIComponent(txt(s, "whatsapp.message").split("{site}").join(s.siteName));
  return (
    <a
      href={"https://wa.me/" + n + "?text=" + text}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed right-4 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-medium text-white shadow-lg transition hover:scale-105"
      style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      </svg>
      {txt(s, "whatsapp.label")}
    </a>
  );
}
