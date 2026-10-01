import type { Listing, Review, VenueInfo } from "./types";

export const emptyVenue = (): VenueInfo => ({
  minGuests: 0, maxGuests: 0, seated: 0, standing: 0,
  weekdayPrice: 0, weekendPrice: 0, deposit: 0, cancellationPolicy: "", amenities: [],
});

export const emptyListing = (categorySlug = ""): Listing => ({
  id: "", name: "", categorySlug, owner: "", tagline: "", description: "",
  districts: [], address: "", priceMin: 0, priceMax: 0,
  status: "pending", featured: false, verified: false, trending: false,
  plan: "free", premiumUntil: "", planRequested: "free", tin: "", ownerEmail: "",
  contact: { phone: "", whatsapp: "", email: "" },
  social: { instagram: "", facebook: "", tiktok: "", youtube: "", website: "" },
  photos: [], videos: [], packages: [], bookedDates: [], venue: emptyVenue(),
  createdAt: "", updatedAt: "",
});

export const emptyReview = (): Review => ({
  id: "", listingId: "", author: "", rating: 5, comment: "", verified: false,
  cleanliness: 0, staff: 0, food: 0, decoration: 0, parking: 0, accessibility: 0, valueForMoney: 0,
  createdAt: "",
});