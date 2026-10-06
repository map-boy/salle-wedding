import { FIELDS } from "./content";
import type { Db } from "./types";

export const DATA_VERSION = 2;

const CAT_EMOJI: Record<string, string> = {
  "wedding-venues": "\u{1F3DB}\uFE0F", "ceremony-venues": "\u26EA", "caterers": "\u{1F37D}\uFE0F",
  "cake-designers": "\u{1F382}", "photographers": "\u{1F4F8}", "videographers": "\u{1F3A5}",
  "decorators": "\u{1F3A8}", "florists": "\u{1F490}", "tent-rental": "\u26FA",
  "makeup-artists": "\u{1F484}", "hair-stylists": "\u{1F487}", "dress-suit-rental": "\u{1F457}",
  "wedding-cars": "\u{1F697}", "djs-mcs": "\u{1F3A7}", "live-bands": "\u{1F3B8}",
  "cultural-troupes": "\u{1F941}", "wedding-planners": "\u{1F4CB}", "rings-jewelry": "\u{1F48D}",
  "gifts-souvenirs": "\u{1F381}", "invitations": "\u{1F48C}", "accommodation": "\u{1F3E8}",
  "honeymoon": "\u{1F334}", "drinks-beverages": "\u{1F942}",
};

const AMENITY_EMOJI = [
  "vip parking | \u{1F698}", "parking | \u{1F17F}\uFE0F", "indoor | \u{1F3DB}\uFE0F", "garden | \u{1F333}",
  "security | \u{1F6E1}\uFE0F", "wheelchair | \u267F", "wi-fi | \u{1F4F6}", "wifi | \u{1F4F6}",
  "generator | \u26A1", "air conditioning | \u2744\uFE0F", "bridal | \u{1F470}", "groom | \u{1F935}",
  "accommodation | \u{1F6CF}\uFE0F", "kitchen | \u{1F373}", "restroom | \u{1F6BB}", "stage | \u{1F3A4}",
  "sound | \u{1F50A}", "pool | \u{1F3CA}", "* | \u2705",
];

const SLOTS = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];

/** One-time seed of values that used to live in code. Never overwrites admin edits. */
export function applyDataDefaults(db: Db): boolean {
  const s = db.settings;
  if ((s.dataVersion ?? 0) >= DATA_VERSION) return false;
  for (const c of db.categories) if (!c.emoji) c.emoji = CAT_EMOJI[c.slug] ?? (c.kind === "venue" ? "\u{1F3DB}\uFE0F" : "\u2728");
  for (const g of db.groups) if (g.id === "planning" && g.hidden === undefined) g.hidden = true;
  if (!s.amenityEmojis?.length) s.amenityEmojis = [...AMENITY_EMOJI];
  if (!s.appointmentSlots?.length) s.appointmentSlots = [...SLOTS];
  if (!s.dateLocale) s.dateLocale = "en-GB";
  if (!s.calendarMonths) s.calendarMonths = 3;
  if (s.appointmentDaysAhead === undefined) s.appointmentDaysAhead = 200;
  if (s.appointmentClosedDays === undefined) s.appointmentClosedDays = "0";
  if (s.timezoneOffset === undefined) s.timezoneOffset = 2;
  if (!s.numberLocale) s.numberLocale = "en-US";
  s.content = s.content ?? {};
  for (const f of FIELDS) if (s.content[f.key] === undefined) s.content[f.key] = f.value;
  s.dataVersion = DATA_VERSION;
  return true;
}