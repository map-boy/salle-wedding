export const catEmoji = (c: { emoji?: string }): string => c.emoji ?? "";

/** rules: lines "word | emoji" from settings; first match wins; a "* | emoji" line is the fallback. */
export function amenityEmoji(name: string, rules: string[] = []): string {
  const n = name.toLowerCase();
  let dflt = "";
  for (const r of rules) {
    const [k, e] = r.split("|").map((x) => x.trim());
    if (!k || !e) continue;
    if (k === "*") { dflt = e; continue; }
    if (n.includes(k.toLowerCase())) return e;
  }
  return dflt;
}

const E = (...c: number[]) => String.fromCodePoint(...c) + "\uFE0F";
const GROUP_DEFAULT: Record<string, string> = {
  venues: E(0x1F3DB), food: E(0x1F37D), media: E(0x1F4F8), decor: E(0x1F3A8), beauty: E(0x1F484),
  transport: E(0x1F697), entertainment: E(0x1F3A7), planning: E(0x1F4CB), drinks: E(0x1F942),
};
/** group emoji: the admin's choice first, then a default for the built-in groups, then a ring. */
export const groupEmoji = (g: { id: string; emoji?: string }): string => g.emoji || GROUP_DEFAULT[g.id] || E(0x1F48D);