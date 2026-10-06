import type { Db, FieldDef } from "./types";

export const WACU_VERSION = 1;
const YN = ["Yes", "No"];
const F = (key: string, label: string, type: FieldDef["type"], x: Partial<FieldDef> = {}): FieldDef => ({ key, label, type, order: 0, ...x });
const ord = (fs: FieldDef[]): FieldDef[] => fs.map((f, i) => ({ ...f, order: i }));

export const WACU_FIELDS: Record<string, FieldDef[]> = {
  venues: ord([
    F("venueType", "Venue Type", "select", { options: ["Tent", "Building", "Open ground", "Hotel / resort", "Other"] }),
    F("setting", "Setting", "select", { options: ["Outdoor", "Indoor", "Indoor & outdoor"] }),
    F("distanceFromRoad", "Distance from the Main Road", "text", { hint: "e.g. 1-3 km" }),
    F("mapUrl", "Google Maps Location", "url", { hint: "Paste the Google Maps link" }),
    F("chairs", "Number of Chairs Provided", "number"),
    F("tables", "Number of Tables Provided", "number"),
  ]),
  decor: ord([
    F("setupTime", "Setup Time", "text", { hint: "e.g. 3 hours before the event" }),
  ]),
  food: ord([
    F("serviceDetails", "Service Details", "textarea"),
    F("serviceType", "Service Type", "select", { options: ["Catering", "Cake", "Catering & cake"] }),
    F("cuisine", "Cuisine Types", "multi", { options: ["Rwandan", "African", "Continental", "Indian", "Chinese", "Italian", "Vegetarian", "Barbecue / grill"] }),
    F("serviceStyle", "Service Style", "multi", { options: ["Buffet", "Plated", "Cocktail", "Family style", "Live stations"] }),
    F("minPlate", "Minimum Price per Plate", "money"),
    F("maxPlate", "Maximum Price per Plate", "money"),
    F("minGuests", "Minimum Number of Guests Catered For", "number"),
    F("tasting", "Pre-Booking Tasting Available?", "select", { options: YN }),
    F("extraPlates", "Do you bring extra plates?", "select", { options: YN }),
    F("extraPlatesCount", "If yes, how many extra plates?", "number"),
  ]),
  media: ord([
    F("serviceDetails", "Service Details", "textarea"),
    F("servicesOffered", "Service Offered", "multi", { options: ["Photography", "Videography", "Drone", "Photo booth", "Live streaming", "Albums & prints"] }),
    F("style", "Photography Style", "multi", { options: ["Traditional", "Candid", "Cinematic", "Editorial", "Pre-wedding / outdoor"] }),
    F("portfolio", "Portfolio Link", "url"),
    F("deliveryDays", "Delivery Days", "number"),
  ]),
  beauty: ord([
    F("servicesOffered", "Service Offered", "multi", { options: ["Bridal makeup", "Party makeup", "Hair styling", "Dress rental", "Suit rental", "Traditional attire", "Tailoring"] }),
    F("mapUrl", "Google Maps Location", "url"),
    F("homeService", "Home / On-Site Service Available", "select", { options: YN, hint: "Does the vendor provide services at the client's location?" }),
  ]),
  entertainment: ord([
    F("serviceDetails", "Service Details", "textarea"),
    F("entertainmentType", "Entertainment Type", "select", { options: ["DJ", "MC", "Live band", "Cultural troupe", "Singer", "Other"] }),
    F("mcOnly", "MC Pricing - MC Only", "money"),
    F("mcReception", "MC Pricing - Reception Only", "money"),
    F("mcBoth", "MC Pricing - Both (MC + Reception)", "money"),
    F("languages", "Languages (MC)", "multi", { options: ["Kinyarwanda", "English", "French", "Swahili"] }),
    F("genres", "Music Genres", "multi", { options: ["Afrobeat", "Gospel", "Rhumba", "R&B", "Traditional", "Pop", "Hip-hop", "Amapiano"] }),
    F("duration", "Performance Duration", "text", { hint: "e.g. 3 hours" }),
    F("performances", "Number of Performances", "number"),
  ]),
};

const DROP = ["accommodation", "honeymoon", "rings-jewelry", "gifts-souvenirs", "invitations"];
const REN: Record<string, [string, string]> = {
  media: ["Photographers & videographers", "Photography & Videography"],
  decor: ["Decor & Rentals", "Decor & Rental"],
  food: ["Catering & cake", "Catering & Cake"],
  entertainment: ["Entertainment and coordination", "Entertainment"],
};

/** Idempotent. force=true only re-seeds the field schemas. Returns true when db changed. */
export function applyWacu(db: Db, force = false): boolean {
  const s = db.settings;
  const first = (s.schemaVersion ?? 0) < WACU_VERSION;
  if (!first && !force) return false;
  if (first) {
    const used = (slug: string) => db.listings.some((l) => l.categorySlug === slug);
    db.categories = db.categories.filter((c) => !DROP.includes(c.slug) || used(c.slug));
    db.groups = db.groups.filter((g) => !["stay", "gifts"].includes(g.id) || db.categories.some((c) => c.groupId === g.id));
    for (const g of db.groups) { const r = REN[g.id]; if (r && g.name === r[0]) g.name = r[1]; }
    s.contactPhone = "+250 782 177 434";
    s.whatsapp = "+250782177434";
    s.contactEmail = "wacuevents@gmail.com";
    s.schemaVersion = WACU_VERSION;
  }
  for (const c of db.categories) {
    const f = WACU_FIELDS[c.groupId];
    if (f && (force || !c.fields?.length)) c.fields = structuredClone(f);
  }
  return true;
}