import type { ReactNode } from "react";
import { groupEmoji } from "@/lib/emoji";
import type { Group } from "@/lib/types";

const Heart = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 5C-8 -1 -5 -7 0 -3C5 -7 8 -1 0 5Z" />
);

const ART: Record<string, ReactNode> = {
  venue: (
    <>
      <path d="M10 26L32 10L54 26" />
      <path d="M12 26H52M16 26V50M48 26V50M10 50H54" />
      <path d="M16 28Q22 36 22 50M48 28Q42 36 42 50" />
      <Heart x={32} y={21} s={0.9} />
    </>
  ),
  food: (
    <>
      <circle cx="32" cy="32" r="14" />
      <circle cx="32" cy="32" r="9" />
      <path d="M6 18V28M10 18V28M14 18V28M6 28Q10 33 14 28M10 33V48" />
      <path d="M54 16C60 20 60 31 54 33V48M54 16V33" />
    </>
  ),
  media: (
    <>
      <rect x="14" y="22" width="40" height="28" rx="5" />
      <circle cx="34" cy="36" r="9" />
      <circle cx="34" cy="36" r="4" />
      <path d="M26 22L29 16H39L42 22" />
      <circle cx="47" cy="28" r="1.5" />
      <path d="M6 58Q8 48 16 44M9 52Q3 50 3 44Q9 45 9 52Z" />
    </>
  ),
  decor: (
    <>
      <path d="M32 58V34M32 46Q22 42 20 34M32 50Q42 46 44 38" />
      <circle cx="32" cy="13" r="4.5" />
      <circle cx="41" cy="19" r="4.5" />
      <circle cx="38" cy="29" r="4.5" />
      <circle cx="26" cy="29" r="4.5" />
      <circle cx="23" cy="19" r="4.5" />
      <circle cx="32" cy="22" r="3" />
      <circle cx="19" cy="31" r="3.5" />
      <circle cx="45" cy="35" r="3.5" />
    </>
  ),
  beauty: (
    <>
      <path d="M27 6L29 22L18 56H46L35 22L37 6" />
      <path d="M27 6Q32 12 37 6M29 22H35M24 40Q32 46 40 40" />
      <path d="M52 10V18M48 14H56" />
    </>
  ),
  transport: (
    <>
      <path d="M10 44V34Q10 30 14 29L18 21Q19 19 22 19H42Q45 19 46 21L50 29Q54 30 54 34V44Z" />
      <path d="M18 29H46" />
      <circle cx="19" cy="46" r="5" />
      <circle cx="45" cy="46" r="5" />
      <circle cx="16" cy="35" r="2" />
      <circle cx="48" cy="35" r="2" />
      <Heart x={26} y={10} s={0.8} />
      <Heart x={38} y={10} s={0.8} />
    </>
  ),
  entertainment: (
    <>
      <rect x="25" y="8" width="14" height="24" rx="7" />
      <path d="M19 26Q19 41 32 41Q45 41 45 26M32 41V53M23 53H41" />
      <path d="M11 22Q7 29 11 36M53 22Q57 29 53 36" />
    </>
  ),
  planning: (
    <>
      <rect x="10" y="14" width="44" height="40" rx="5" />
      <path d="M10 25H54M21 9V19M43 9V19" />
      <Heart x={32} y={40} s={1.7} />
    </>
  ),
  drinks: (
    <>
      <path d="M16 10H28L26 29Q22 34 18 29Z" />
      <path d="M22 33V50M15 50H29" />
      <path d="M36 10H48L46 29Q42 34 38 29Z" />
      <path d="M42 33V50M35 50H49" />
      <circle cx="22" cy="19" r="1.2" />
      <circle cx="42" cy="22" r="1.2" />
      <path d="M52 8V14M49 11H55" />
    </>
  ),
  rings: (
    <>
      <circle cx="23" cy="40" r="12" />
      <circle cx="41" cy="40" r="12" />
      <path d="M23 28L19 22L23 16L27 22Z" />
    </>
  ),
  stay: (
    <>
      <path d="M9 28V54M55 28V54M9 40H55M9 54H55" />
      <rect x="13" y="32" width="15" height="8" rx="2" />
      <rect x="36" y="32" width="15" height="8" rx="2" />
      <Heart x={32} y={17} s={1.2} />
    </>
  ),
};

/** picks a drawing from the group's id or name, so groups you add later get art too */
function artKey(g: Group): string | null {
  const s = (g.id + " " + g.name).toLowerCase();
  if (/\brings?\b|\bgifts?\b|souvenir/.test(s)) return "rings";
  if (/accommodation|honeymoon|hotel|lodging|\bstay\b/.test(s)) return "stay";
  if (/venue/.test(s)) return "venue";
  if (/cater|cake|food/.test(s)) return "food";
  if (/photo|video|media/.test(s)) return "media";
  if (/decor|rental|flower|florist/.test(s)) return "decor";
  if (/beauty|fashion|dress|makeup/.test(s)) return "beauty";
  if (/transport|\bcars?\b/.test(s)) return "transport";
  if (/entertain|music|\bband|\bdj/.test(s)) return "entertainment";
  if (/\bplan|coordinat/.test(s)) return "planning";
  if (/drink|beverage/.test(s)) return "drinks";
  return null;
}

/** own picture first, then a chosen emoji, then the drawing, then a default emoji */
export function GroupBadge({ g, size = 56 }: { g: Group; size?: number }) {
  if (g.icon) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={g.icon} alt="" width={size} height={size} className="mb-3 object-contain" style={{ width: size, height: size }} />;
  }
  if (g.emoji) return <div aria-hidden className="mb-3 text-5xl leading-none">{g.emoji}</div>;
  const k = artKey(g);
  if (k) {
    return (
      <svg viewBox="0 0 64 64" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2.5}
        strokeLinecap="round" strokeLinejoin="round" aria-hidden className="mb-3 text-wine-600">
        {ART[k]}
      </svg>
    );
  }
  return <div aria-hidden className="mb-3 text-5xl leading-none">{groupEmoji(g)}</div>;
}