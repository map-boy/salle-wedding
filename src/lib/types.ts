export type Status = "pending" | "approved" | "rejected" | "suspended";
export type Kind = "venue" | "vendor";
export type InquiryStatus = "new" | "contacted" | "confirmed" | "closed";

export type FieldType = "text" | "textarea" | "number" | "money" | "select" | "multi" | "url";
export type FieldDef = { key: string; label: string; type: FieldType; order: number; options?: string[]; hint?: string };
export type Group = { id: string; name: string; order: number; hidden?: boolean };
export type Category = {
  slug: string; name: string; groupId: string; kind: Kind; description: string; order: number;
  emoji?: string; icon?: string; hidePrice?: boolean; fields?: FieldDef[];
};
export type Photo = { label: string; url: string };
export type Pkg = { name: string; price: number; description: string };
export type VenueInfo = {
  minGuests: number; maxGuests: number; seated: number; standing: number;
  weekdayPrice: number; weekendPrice: number; deposit: number;
  cancellationPolicy: string; amenities: string[];
};
export type Listing = {
  id: string; name: string; categorySlug: string; owner: string; tagline: string; description: string;
  districts: string[]; address: string; priceMin: number; priceMax: number;
  status: Status; featured: boolean; verified: boolean; trending: boolean;
  plan: "free" | "premium"; premiumUntil: string; planRequested: "free" | "premium"; tin: string; ownerEmail: string;
  contact: { phone: string; whatsapp: string; email: string };
  social: { instagram: string; facebook: string; tiktok: string; youtube: string; website: string };
  photos: Photo[]; videos: string[]; packages: Pkg[]; bookedDates: string[]; venue: VenueInfo; attrs: Record<string, string | number | string[]>;
  createdAt: string; updatedAt: string;
};
export type Review = {
  id: string; listingId: string; author: string; rating: number; comment: string; verified: boolean;
  cleanliness: number; staff: number; food: number; decoration: number; parking: number;
  accessibility: number; valueForMoney: number; createdAt: string;
};
export type Inquiry = {
  id: string; listingId: string; name: string; phone: string; email: string;
  eventDate: string; guests: number; message: string; status: InquiryStatus; createdAt: string;
};
export type Settings = {
  siteName: string; tagline: string; heroTitle: string; heroSubtitle: string;
  contactPhone: string; contactEmail: string; contactAddress: string; whatsapp: string; footerNote: string;
  districts: string[]; amenities: string[];
  siteUrl: string; heroImage: string; seoImage: string; seoDescription: string; aboutText: string; appointmentSlots: string[]; schemaVersion?: number; dataVersion?: number; amenityEmojis?: string[]; dateLocale?: string; calendarMonths?: number; appointmentDaysAhead?: number; appointmentClosedDays?: string; timezoneOffset?: number; numberLocale?: string;
  content: Record<string, string>;
};
export type Db = {
  settings: Settings; groups: Group[]; categories: Category[];
  listings: Listing[]; reviews: Review[]; inquiries: Inquiry[];
};