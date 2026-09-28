import type { VendorCategorySlug } from "./categories";

export type Review = {
  id: string;
  author: string;
  verified: boolean;
  overall: number;
  comment: string;
  cleanliness?: number;
  staff?: number;
  food?: number;
  decoration?: number;
  parking?: number;
  accessibility?: number;
  valueForMoney?: number;
};

export type Contact = { phone: string; email?: string; address?: string };
export type SocialLinks = {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
  whatsapp?: string;
};
export type ServicePackage = { name: string; price: number; description: string };
export type GalleryItem = { label: string; url: string };

export type Venue = {
  id: string;
  name: string;
  district: string;
  description: string;
  capacity: { minGuests: number; maxGuests: number; seated: number; standing: number };
  pricing: {
    startingPrice: number;
    weekday: number;
    weekend: number;
    deposit: number;
    cancellationPolicy: string;
  };
  bookedDates: string[];
  amenities: string[];
  gallery: GalleryItem[];
  videos: string[];
  reviews: Review[];
  contact: Contact;
  social: SocialLinks;
};

export type Vendor = {
  id: string;
  category: VendorCategorySlug;
  businessName: string;
  owner: string;
  portfolio: string;
  packages: ServicePackage[];
  startingPrice: number;
  bookedDates: string[];
  photos: string[];
  videos: string[];
  reviews: Review[];
  contact: Contact;
  social: SocialLinks;
};