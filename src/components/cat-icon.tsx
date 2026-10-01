import { catEmoji } from "@/lib/emoji";
import type { Category } from "@/lib/types";

export function CatIcon({ c, size = 20 }: { c: Category; size?: number }) {
  if (c.icon) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={c.icon} alt="" width={size} height={size} className="inline-block object-contain align-[-0.2em]" />;
  }
  return <span aria-hidden>{catEmoji(c)}</span>;
}