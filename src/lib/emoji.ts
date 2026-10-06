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