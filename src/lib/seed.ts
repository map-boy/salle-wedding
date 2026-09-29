import { emptyListing, emptyVenue } from "./defaults";
import type { Category, Db, Group, Kind, Listing, Review } from "./types";

const NOW = new Date().toISOString();

const DISTRICTS = [
  "Gasabo", "Kicukiro", "Nyarugenge",
  "Bugesera", "Gatsibo", "Kayonza", "Kirehe", "Ngoma", "Nyagatare", "Rwamagana",
  "Burera", "Gakenke", "Gicumbi", "Musanze", "Rulindo",
  "Gisagara", "Huye", "Kamonyi", "Muhanga", "Nyamagabe", "Nyanza", "Nyaruguru", "Ruhango",
  "Karongi", "Ngororero", "Nyabihu", "Nyamasheke", "Rubavu", "Rusizi", "Rutsiro",
];

const AMENITIES = [
  "Indoor hall", "Outdoor garden", "Parking", "VIP parking", "Security", "Wheelchair access",
  "Wi-Fi", "Generator", "Air conditioning", "Bridal room", "Groom room", "Accommodation", "Kitchen", "Restrooms",
];

const GROUPS: [string, string][] = [
  ["venues", "Wedding venues"], ["food", "Catering & cake"], ["media", "Photographers & videographers"], ["decor", "Decor & Rentals"],
  ["beauty", "Beauty & Fashion"], ["transport", "Transport"], ["entertainment", "Entertainment and coordination"],
  ["planning", "Planning"], ["gifts", "Rings, Gifts & Invitations"], ["stay", "Accommodation and honeymoon"], ["drinks", "Drinks & beverages"],
];

const CATS: [string, string, string, Kind, string][] = [
  ["wedding-venues", "Wedding Venues", "venues", "venue", "Halls, gardens and reception venues."],
  ["ceremony-venues", "Ceremony Venues", "venues", "venue", "Churches, chapels and outdoor ceremony sites."],
  ["caterers", "Caterers", "food", "vendor", "Buffet, plated and traditional menus."],
  ["cake-designers", "Cake Designers", "food", "vendor", "Custom wedding and engagement cakes."],
  ["photographers", "Photographers", "media", "vendor", "Wedding, engagement and pre-wedding photography."],
  ["videographers", "Videographers", "media", "vendor", "Wedding films, highlights and live streaming."],
  ["decorators", "Decorators", "decor", "vendor", "Venue styling, lighting and table setups."],
  ["florists", "Florists", "decor", "vendor", "Bouquets, arches and floral arrangements."],
  ["tent-rental", "Tents & Equipment", "decor", "vendor", "Tents, chairs, tables and sound equipment."],
  ["makeup-artists", "Makeup Artists", "beauty", "vendor", "Bridal and party makeup."],
  ["hair-stylists", "Hair Stylists", "beauty", "vendor", "Bridal hair and styling."],
  ["dress-suit-rental", "Dresses & Suits", "beauty", "vendor", "Gowns, suits and traditional attire."],
  ["wedding-cars", "Wedding Cars", "transport", "vendor", "Bridal cars and convoy hire."],
  ["djs-mcs", "DJs & MCs", "entertainment", "vendor", "DJs, MCs and sound systems."],
  ["live-bands", "Live Bands", "entertainment", "vendor", "Live music and bands."],
  ["cultural-troupes", "Cultural Troupes", "entertainment", "vendor", "Traditional dance and drummers."],
  ["wedding-planners", "Wedding Planners", "planning", "vendor", "Full planning and day-of coordination."],
  ["rings-jewelry", "Rings & Jewelry", "gifts", "vendor", "Wedding rings and jewelry."],
  ["gifts-souvenirs", "Gifts & Souvenirs", "gifts", "vendor", "Gifts, favors and souvenirs."],
  ["invitations", "Invitations", "gifts", "vendor", "Printed and digital invitations."],
  ["accommodation", "Accommodation", "stay", "vendor", "Hotels and lodges for guests."],
  ["honeymoon", "Honeymoon Planning", "stay", "vendor", "Honeymoon packages and trips."],
  ["drinks-beverages", "Drinks & Beverages", "drinks", "vendor", "Wedding drinks and beverages."],
];

type Seed = Partial<Listing> & { id: string; name: string; categorySlug: string };
const L = (p: Seed): Listing => ({ ...emptyListing(p.categorySlug), status: "approved", createdAt: NOW, updatedAt: NOW, ...p });

export function makeSeed(): Db {
  const groups: Group[] = GROUPS.map(([id, name], order) => ({ id, name, order }));
  const categories: Category[] = CATS.map(([slug, name, groupId, kind, description], order) => ({ slug, name, groupId, kind, description, order, ...(slug === "drinks-beverages" ? { hidePrice: true } : {}) }));

  const listings: Listing[] = [
    L({
      id: "garden-palace", name: "Garden Palace (sample)", categorySlug: "wedding-venues", owner: "Sample Owner",
      tagline: "Indoor hall and open garden in one compound",
      description: "Sample venue listing. Replace with a real venue from the admin panel.",
      districts: ["Gasabo"], address: "Kigali", priceMin: 1500000, priceMax: 2200000, featured: true, verified: true,
      contact: { phone: "+250700000000", whatsapp: "+250700000000", email: "" },
      venue: {
        minGuests: 50, maxGuests: 400, seated: 400, standing: 600, weekdayPrice: 1500000, weekendPrice: 2200000, deposit: 500000,
        cancellationPolicy: "Deposit refundable up to 30 days before the event.",
        amenities: ["Indoor hall", "Outdoor garden", "Parking", "Security", "Generator", "Bridal room", "Restrooms"],
      },
      photos: [{ label: "Main exterior", url: "" }, { label: "Indoor hall", url: "" }, { label: "Outdoor garden", url: "" }],
      bookedDates: ["2026-10-17", "2026-10-24"],
    }),
    L({
      id: "lakeview-hall", name: "Lakeview Hall (sample)", categorySlug: "wedding-venues", owner: "Sample Owner",
      tagline: "Multipurpose hall with lake views", description: "Sample venue listing for the Bugesera area.",
      districts: ["Bugesera"], priceMin: 2500000, priceMax: 3500000, trending: true,
      contact: { phone: "+250700000010", whatsapp: "", email: "" },
      venue: { ...emptyVenue(), minGuests: 100, maxGuests: 600, seated: 600, standing: 800, weekdayPrice: 2500000, weekendPrice: 3500000, deposit: 800000, cancellationPolicy: "Deposit non-refundable within 14 days.", amenities: ["Indoor hall", "Parking", "Generator", "Kitchen", "Restrooms"] },
    }),
    L({
      id: "lens-and-light", name: "Lens & Light (sample)", categorySlug: "photographers", owner: "Sample Owner",
      tagline: "Weddings, engagements and pre-wedding shoots", description: "Sample photographer listing.",
      districts: ["Kicukiro", "Gasabo"], priceMin: 300000, priceMax: 700000, verified: true, featured: true,
      contact: { phone: "+250700000001", whatsapp: "+250700000001", email: "" },
      packages: [
        { name: "Basic", price: 300000, description: "4 hours, 100 edited photos." },
        { name: "Full day", price: 700000, description: "10 hours, 400 edited photos, album." },
      ],
      bookedDates: ["2026-10-17"],
    }),
    L({ id: "urugo-catering", name: "Urugo Catering (sample)", categorySlug: "caterers", owner: "Sample Owner", tagline: "Buffet and plated menus", description: "Sample caterer listing. Prices are per guest.", districts: ["Gasabo", "Kicukiro"], priceMin: 8000, priceMax: 20000, verified: true, packages: [{ name: "Buffet", price: 12000, description: "Per guest: 3 mains, 2 sides, dessert." }] }),
    L({ id: "sweet-layers", name: "Sweet Layers Bakery (sample)", categorySlug: "cake-designers", owner: "Sample Owner", tagline: "Custom wedding cakes", description: "Sample cake designer listing.", districts: ["Kicukiro"], priceMin: 150000, priceMax: 600000, trending: true }),
    L({ id: "bloom-and-bough", name: "Bloom & Bough Decor (sample)", categorySlug: "decorators", owner: "Sample Owner", tagline: "Flowers, lights and table styling", description: "Sample decorator listing.", districts: ["Kicukiro", "Nyarugenge"], priceMin: 500000, priceMax: 3000000, featured: true }),
    L({ id: "kigali-sound", name: "Kigali Sound Co (sample)", categorySlug: "djs-mcs", owner: "Sample Owner", tagline: "DJ, MC and full sound", description: "Sample DJ and MC listing.", districts: ["Nyarugenge", "Gasabo"], priceMin: 250000, priceMax: 800000 }),
    L({ id: "golden-day-planners", name: "Golden Day Planners (sample)", categorySlug: "wedding-planners", owner: "Sample Owner", tagline: "Full planning and day-of coordination", description: "Sample planner listing.", districts: ["Gasabo"], priceMin: 800000, priceMax: 4000000, verified: true }),
    L({ id: "royal-rides", name: "Royal Rides (sample)", categorySlug: "wedding-cars", owner: "Sample Owner", tagline: "Bridal cars with chauffeur", description: "Sample wedding car listing.", districts: ["Nyarugenge"], priceMin: 150000, priceMax: 400000 }),
    L({ id: "glow-studio", name: "Glow Studio (pending sample)", categorySlug: "makeup-artists", owner: "Sample Owner", tagline: "Bridal makeup", description: "Sample pending application. Approve or reject it from the admin panel.", districts: ["Kicukiro"], priceMin: 60000, priceMax: 150000, status: "pending" }),
  ];

  const R = (id: string, listingId: string, author: string, rating: number, comment: string, verified: boolean, extra: Partial<Review> = {}): Review => ({
    id, listingId, author, rating, comment, verified, createdAt: NOW,
    cleanliness: 0, staff: 0, food: 0, decoration: 0, parking: 0, accessibility: 0, valueForMoney: 0, ...extra,
  });
  const reviews: Review[] = [
    R("r1", "garden-palace", "Sample Couple", 4.5, "Lovely garden and helpful staff.", true, { cleanliness: 5, staff: 5, food: 4, decoration: 4, parking: 4, accessibility: 4, valueForMoney: 4 }),
    R("r2", "lens-and-light", "Sample Bride", 5, "Beautiful photos, delivered on time.", true),
    R("r3", "urugo-catering", "Sample Guest", 4, "Food was fresh and service was quick.", false),
  ];

  return {
    settings: {
      siteName: "Wacu Events",
      tagline: "Your wedding · your vision · our expertise",
      heroTitle: "Discover Rwanda's best venues, photographers, caterers & more",
      heroSubtitle: "All in one place. Compare venues and vendors, send a request and plan your wedding.",
      contactPhone: "+250 700 000 000", contactEmail: "hello@example.com", contactAddress: "Kigali, Rwanda", whatsapp: "+250781466135",
      footerNote: "Listings are reviewed by our team before they appear.",
      siteUrl: "",
      content: {},
      heroImage: "/hero/hero-1.jpg",
      seoImage: "/hero/SEO.jpg",
      seoDescription: "Discover Rwanda's best wedding venues, photographers, caterers, decorators, wedding cars, DJs & MCs and more. Plan your wedding in one place with Wacu Events.",
      aboutText: "Wacu Events brings Rwanda's wedding venues and vendors together in one place, so couples can discover the right people, compare their options and plan with confidence.",
      appointmentSlots: ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"],
      districts: DISTRICTS, amenities: AMENITIES,
    },
    groups, categories, listings, reviews,
    inquiries: [{
      id: "i1", listingId: "garden-palace", name: "Sample Couple", phone: "+250700000099", email: "",
      eventDate: "2026-12-05", guests: 250, message: "Is this date free? We would like to visit.", status: "new", createdAt: NOW,
    }],
  };
}