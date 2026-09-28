import type { Vendor, Venue } from "./types";

const venues: Venue[] = [
  {
    id: "garden-palace",
    name: "Garden Palace",
    district: "Gasabo, Kigali",
    description: "Sample venue with an indoor hall and an outdoor garden.",
    capacity: { minGuests: 50, maxGuests: 400, seated: 400, standing: 600 },
    pricing: {
      startingPrice: 1500000,
      weekday: 1500000,
      weekend: 2200000,
      deposit: 500000,
      cancellationPolicy: "Deposit refundable up to 30 days before the event.",
    },
    bookedDates: ["2026-10-17", "2026-10-24"],
    amenities: ["Indoor hall", "Outdoor garden", "Parking", "Security", "Generator", "Bridal room", "Restrooms"],
    gallery: [
      { label: "Main exterior", url: "" },
      { label: "Indoor hall", url: "" },
      { label: "Outdoor garden", url: "" },
    ],
    videos: [],
    reviews: [
      {
        id: "r1", author: "Sample Couple", verified: true, overall: 4.5,
        comment: "Lovely garden and helpful staff.",
        cleanliness: 5, staff: 5, food: 4, decoration: 4, parking: 4, accessibility: 4, valueForMoney: 4,
      },
    ],
    contact: { phone: "+250 700 000 000" },
    social: {},
  },
];

const vendors: Vendor[] = [
  {
    id: "lens-and-light",
    category: "photographers",
    businessName: "Lens & Light",
    owner: "Sample Owner",
    portfolio: "Weddings, engagements and pre-wedding shoots across Kigali.",
    packages: [
      { name: "Basic", price: 300000, description: "4 hours, 100 edited photos." },
      { name: "Full day", price: 700000, description: "10 hours, 400 edited photos, album." },
    ],
    startingPrice: 300000,
    bookedDates: ["2026-10-17"],
    photos: [],
    videos: [],
    reviews: [],
    contact: { phone: "+250 700 000 001" },
    social: {},
  },
  {
    id: "urugo-catering",
    category: "caterers",
    businessName: "Urugo Catering",
    owner: "Sample Owner",
    portfolio: "Buffet and plated menus for 50 to 800 guests.",
    packages: [{ name: "Buffet", price: 12000, description: "Per guest, 3 mains, 2 sides." }],
    startingPrice: 12000,
    bookedDates: [],
    photos: [],
    videos: [],
    reviews: [],
    contact: { phone: "+250 700 000 002" },
    social: {},
  },
];

export const getVenues = () => venues;
export const getVenue = (id: string) => venues.find((v) => v.id === id);
export const getVendors = (category?: string) =>
  category ? vendors.filter((v) => v.category === category) : vendors;
export const getVendor = (id: string) => vendors.find((v) => v.id === id);