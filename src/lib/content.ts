import type { Settings } from "./types";

export type Field = { key: string; group: string; label: string; value: string; rows: number };

const f = (group: string, key: string, label: string, value: string, rows = 1): Field => ({ group, key, label, value, rows });
const L = (...a: string[]) => a.join("\n");

export const FIELDS: Field[] = [
  f("Menu", "menu.items", "Menu links (one per line: Label | /path). Use 'services' as the path for the Services dropdown.",
    L("Home | /", "Services | services", "Start planning | /planning", "About | /about", "Contact | /#contact", "For vendors | /for-vendors", "Join as vendor | /join"), 8),

  f("Home page", "home.searchPlaceholder", "Search box placeholder", "Search photographers, caterers, decorators..."),
  f("Home page", "home.categoriesTitle", "Categories heading", "Everything for your wedding"),
  f("Home page", "home.categoriesSubtitle", "Categories subtitle", "Browse by category."),
  f("Home page", "home.featuredTitle", "Featured heading", "Featured"),
  f("Home page", "home.featuredLink", "Featured link text", "See all vendors"),
  f("Home page", "home.howTitle", "How it works heading", "How it works"),
  f("Home page", "home.howSteps", "How it works steps (one per line: Title | text)",
    L("Search | Filter venues and vendors by district, price and guest count.",
      "Compare | See packages, availability, reviews and contact details side by side.",
      "Send a request | Reach vendors directly and confirm your date."), 4),
  f("Home page", "home.vendorTitle", "Vendor banner heading", "Are you a wedding professional?"),
  f("Home page", "home.vendorText", "Vendor banner text", "Apply to list your business. Our team reviews every application."),
  f("Home page", "home.vendorButton", "Vendor banner button", "Join as vendor"),

  f("Planning page", "planning.title", "Heading", "Plan your wedding with Wacu planner"),
  f("Planning page", "planning.intro", "Intro text", "Schedule your appointment. Pick a day and a time and we will contact you to plan your wedding.", 2),
  f("Planning page", "planning.submit", "Submit button", "Contact us"),

  f("About page", "about.pillars", "Three boxes (one per line: Title | text)",
    L("Discover | Browse wedding venues, photographers, caterers, decorators, wedding cars, DJs & MCs and more, all in one place.",
      "Compare | See packages, prices, availability and reviews side by side before you decide.",
      "Plan with Wacu planner | Book an appointment and we will help you plan your wedding from start to finish."), 4),
  f("About page", "about.talkTitle", "Contact box heading", "Talk to us"),

  f("Footer", "footer.links", "Explore links (one per line: Label | /path)",
    L("Venues | /venues", "Vendors | /vendors", "For vendors | /for-vendors", "Join as vendor | /join"), 5),

  f("WhatsApp button", "whatsapp.label", "Button text", "WhatsApp"),
  f("WhatsApp button", "whatsapp.message", "Message the customer starts with ({site} = site name)", "Hello {site}, I would like help planning my wedding.", 2),

  f("For vendors page", "vendors.title", "Heading", "Grow your wedding business with Wacu Events"),
  f("For vendors page", "vendors.intro", "Intro", "Couples use Wacu for free. Vendors get visibility, qualified enquiries and business tools. Join for free or upgrade to Premium.", 3),
  f("For vendors page", "vendors.cta", "Plan button text", "Join as a vendor"),
  f("For vendors page", "vendors.commissionTitle", "Commission heading", "Commission on Wacu-attributed transactions"),
  f("For vendors page", "vendors.commissionRules", "Commission rules (one per line, {free} and {premium} = the percentages)",
    L("Free vendors: {free}% commission on each Wacu-attributed transaction.",
      "Premium vendors: {premium}% commission on each Wacu-attributed transaction.",
      "Commission is based on the amount actually paid by the customer, subject to the final vendor agreement.",
      "A transaction is Wacu-attributed when the customer was introduced to, contacted, requested a quote from, booked, or otherwise connected to the vendor through Wacu or a Wacu marketing channel."), 6),
  f("For vendors page", "vendors.stepsTitle", "Steps heading", "How joining works"),
  f("For vendors page", "vendors.steps", "Steps (one per line: Title | text)",
    L("Join Wacu | Click Join as a vendor and choose Free or Premium.",
      "Select your category | Venue, catering, photography, decoration, beauty, fashion, transport, accommodation, honeymoon and more.",
      "Business information | Business name, contact, phone, WhatsApp, email, location and social links.",
      "Build your profile | Logo, portfolio, services, prices, packages and description.",
      "Choose your subscription | Free or Premium.",
      "Accept the Vendor Terms | Commission, customer-service standards, accurate information and respect for confirmed bookings.",
      "Verification | Our team reviews your application and activates your profile.",
      "Go live | Start receiving enquiries."), 9),
  f("For vendors page", "vendors.trustTitle", "Trust heading", "Trust and marketplace rules"),
  f("For vendors page", "vendors.trustRules", "Trust rules (one per line)",
    L("Wacu Verified is based on defined checks. Paying for Premium does not automatically mean verified.",
      "Paid placement is clearly labelled as Sponsored or Featured.",
      "Vendors agree to accurate information, professional communication, transparent pricing and respect for confirmed bookings."), 4),

  f("Plan: Free", "plan.free.name", "Plan name", "Free Vendor"),
  f("Plan: Free", "plan.free.price", "Price in RWF (numbers only)", "0"),
  f("Plan: Free", "plan.free.period", "Period (for example 6 months, leave empty for none)", ""),
  f("Plan: Free", "plan.free.commission", "Commission percent (number only)", "7"),
  f("Plan: Free", "plan.free.features", "Features (one per line)",
    L("Business profile: name, category, location, contact details, WhatsApp, social links and description",
      "Portfolio: up to 10 photos and 2 videos",
      "Services: list your services and starting prices",
      "Customer enquiries: receive enquiries through Wacu",
      "Reviews: receive and respond to customer reviews",
      "Basic analytics: profile views, enquiries and contact activity",
      "Standard visibility in relevant Wacu search results"), 8),

  f("Plan: Premium", "plan.premium.name", "Plan name", "Premium Vendor"),
  f("Plan: Premium", "plan.premium.price", "Price in RWF (numbers only)", "30000"),
  f("Plan: Premium", "plan.premium.period", "Period (for example 6 months, leave empty for none)", "6 months"),
  f("Plan: Premium", "plan.premium.commission", "Commission percent (number only)", "5"),
  f("Plan: Premium", "plan.premium.features", "Features (one per line, {premium} = commission percent)",
    L("Priority visibility in discovery areas and Premium/Featured sections",
      "Expanded portfolio: substantially more photos, videos and content",
      "Detailed service packages, inclusions, prices and add-ons",
      "Advanced profile with facilities, service details and portfolio categories",
      "Lead management: New, Contacted, Quote Sent, Negotiating, Booked, Completed or Lost",
      "Quote builder to create and send professional quotations",
      "Availability calendar to show available and booked dates",
      "Advanced analytics: views, enquiries, quotes, bookings and booking value",
      "Booking support through Wacu",
      "Eligibility for selected Wacu campaigns, featured content and promotions",
      "Lower commission: {premium}% on Wacu-attributed transactions"), 12),

  f("Join page", "join.title", "Heading", "Join as a vendor"),
  f("Join page", "join.intro", "Intro", "Tell us about your business. We review every application before it appears on the site.", 2),
  f("Join page", "join.planTitle", "Plan choice label", "Choose your plan"),
  f("Join page", "join.termsText", "Terms checkbox text", "I accept the Vendor Terms, including the commission on Wacu-attributed transactions, accurate information and respect for confirmed bookings.", 3),
];

export const DEFAULTS: Record<string, string> = Object.fromEntries(FIELDS.map((x) => [x.key, x.value]));

type Src = Pick<Settings, "content"> | { content?: Record<string, string> } | undefined | null;

export function txt(s: Src, key: string): string {
  const v = s?.content?.[key];
  return v !== undefined ? v : (DEFAULTS[key] ?? "");
}
export const list = (s: Src, key: string): string[] => txt(s, key).split("\n").map((x) => x.trim()).filter(Boolean);
export const pairs = (s: Src, key: string): [string, string][] =>
  list(s, key).map((l): [string, string] => {
    const i = l.indexOf("|");
    return i < 0 ? [l, ""] : [l.slice(0, i).trim(), l.slice(i + 1).trim()];
  });
