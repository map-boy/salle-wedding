const CAT: Record<string, string> = {
  "wedding-venues": "🏛️",
  "ceremony-venues": "⛪",
  "caterers": "🍽️",
  "cake-designers": "🎂",
  "photographers": "📸",
  "videographers": "🎥",
  "decorators": "🎨",
  "florists": "💐",
  "tent-rental": "⛺",
  "makeup-artists": "💄",
  "hair-stylists": "💇",
  "dress-suit-rental": "👗",
  "wedding-cars": "🚗",
  "djs-mcs": "🎧",
  "live-bands": "🎸",
  "cultural-troupes": "🥁",
  "wedding-planners": "📋",
  "rings-jewelry": "💍",
  "gifts-souvenirs": "🎁",
  "invitations": "💌",
  "accommodation": "🏨",
  "honeymoon": "🌴",
  "drinks-beverages": "🥂",
};

export function catEmoji(c: { slug: string; kind: string; emoji?: string }): string {
  return c.emoji || CAT[c.slug] || (c.kind === "venue" ? "🏛️" : "✨");
}

const AMENITY: [string, string][] = [
  ["vip parking", "🚘"], ["parking", "🅿️"], ["indoor", "🏛️"], ["garden", "🌳"],
  ["security", "🛡️"], ["wheelchair", "♿"], ["wi-fi", "📶"], ["wifi", "📶"],
  ["generator", "⚡"], ["air conditioning", "❄️"], ["bridal", "👰"], ["groom", "🤵"],
  ["accommodation", "🛏️"], ["kitchen", "🍳"], ["restroom", "🚻"], ["stage", "🎤"],
  ["sound", "🔊"], ["pool", "🏊"],
];

export function amenityEmoji(name: string): string {
  const n = name.toLowerCase();
  for (const [k, e] of AMENITY) if (n.includes(k)) return e;
  return "✅";
}
