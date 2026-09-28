export const VENDOR_CATEGORIES = [
  { slug: "caterers", label: "Caterers" },
  { slug: "cake-designers", label: "Cake Designers" },
  { slug: "makeup-artists", label: "Makeup Artists" },
  { slug: "hair-stylists", label: "Hair Stylists" },
  { slug: "photographers", label: "Photographers" },
  { slug: "videographers", label: "Videographers" },
  { slug: "decorators", label: "Decorators" },
  { slug: "florists", label: "Florists" },
  { slug: "wedding-cars", label: "Wedding Cars" },
  { slug: "djs-mcs", label: "DJs & MCs" },
  { slug: "wedding-planners", label: "Wedding Planners" },
] as const;

export type VendorCategorySlug = (typeof VENDOR_CATEGORIES)[number]["slug"];

export const getCategory = (slug: string) =>
  VENDOR_CATEGORIES.find((c) => c.slug === slug);

export const AMENITIES = [
  "Indoor hall", "Outdoor garden", "Parking", "VIP parking", "Security",
  "Wheelchair access", "Wi-Fi", "Generator", "Air conditioning", "Bridal room",
  "Groom room", "Accommodation", "Kitchen", "Restrooms",
] as const;

export const GALLERY_LABELS = [
  "Main exterior", "Entrance", "Reception area", "Ceremony area", "Indoor hall",
  "Outdoor garden", "Table setup", "Dance floor", "Stage", "Parking area",
  "Night view", "Drone photos", "Real wedding examples", "Before decoration",
  "After decoration", "Video walkthrough", "360° virtual tour (future)",
  "Customer-uploaded photos",
] as const;