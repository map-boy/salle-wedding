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

const X = (group: string, rows: [string, string, string][]): Field[] => rows.map(([k, l, v]) => f(group, k, l, v));
const EXTRA: Field[] = [
  ...X("Country and currency", [
    ["locale.country", "Country name", "Rwanda"],
    ["locale.countryCode", "Country code (2 letters, for search engines)", "RW"],
    ["locale.localeCode", "Locale code for link previews", "en_RW"],
    ["locale.currency", "Currency label shown after prices", "RWF"],
    ["locale.phonePrefix", "Phone country prefix, digits only (turns 07... into a WhatsApp link)", "250"],
    ["price.ask", "Text when a vendor has no price", "Ask for a quote"],
    ["price.from", "Word before a single price", "From"],
    ["price.askVenue", "Text when a venue detail is empty", "Ask venue"],
  ]),
  ...X("Labels (all pages)", [
    ["ui.allDistricts", "All districts option", "All districts"],
    ["ui.allCategories", "All categories option", "All categories"],
    ["ui.searchByName", "Search box placeholder (filters)", "Search by name or keyword"],
    ["ui.minGuests", "Min guests placeholder", "Min guests"],
    ["ui.sortRecommended", "Sort: recommended", "Recommended"],
    ["ui.sortRating", "Sort: rating", "Top rated"],
    ["ui.sortPriceAsc", "Sort: price low", "Price: low to high"],
    ["ui.sortPriceDesc", "Sort: price high", "Price: high to low"],
    ["ui.apply", "Apply filters button", "Apply"],
    ["ui.noListings", "Empty search message", "No listings match your search yet. Try clearing a filter."],
    ["ui.chatWhatsapp", "Chat on WhatsApp link", "Chat on WhatsApp"],
    ["ui.adminLink", "Footer admin link", "Admin"],
    ["form.phName", "Placeholder: name", "Your name"],
    ["form.phPhone", "Placeholder: phone", "Phone / WhatsApp"],
    ["form.phEmail", "Placeholder: email", "Email (optional)"],
    ["badge.featured", "Badge: featured", "Featured"],
    ["badge.premium", "Badge: premium", "Premium"],
    ["badge.verified", "Badge: verified", "Verified"],
    ["badge.trending", "Badge: trending", "Trending"],
    ["footer.exploreTitle", "Footer explore heading", "Explore"],
    ["footer.contactTitle", "Footer contact heading", "Contact"],
    ["notfound.title", "404 heading", "We could not find that page"],
    ["notfound.text", "404 text", "It may have been moved, removed or is still awaiting approval."],
    ["notfound.back", "404 button", "Back to home"],
  ]),
  ...X("SEO titles and descriptions ({site} and {country} are filled in)", [
    ["seo.homeTitle", "Home page title", "{site} - wedding venues and vendors in {country}"],
    ["seo.about.title", "About title", "About"],
    ["seo.about.desc", "About description", "About our wedding venues and vendors marketplace in {country}."],
    ["seo.vendors.title", "Vendors title", "Wedding vendors in {country}"],
    ["seo.vendors.desc", "Vendors description", "Photographers, caterers, decorators, wedding cars, DJs & MCs and more for your wedding in {country}."],
    ["seo.venues.title", "Venues title", "Wedding venues in {country}"],
    ["seo.venues.desc", "Venues description", "Browse and compare wedding venues in {country} by district, capacity and price."],
    ["seo.planning.title", "Planning title", "Plan your wedding"],
    ["seo.planning.desc", "Planning description", "Schedule an appointment with the wedding planner and start planning your wedding."],
    ["seo.forVendors.title", "For vendors title", "For vendors"],
    ["seo.forVendors.desc", "For vendors description", "Join {site} as a vendor. Free and Premium plans for wedding businesses in {country}."],
    ["seo.join.title", "Join title", "Join as a vendor"],
    ["seo.join.desc", "Join description", "Apply to list your wedding business on {site}."],
    ["seo.category.desc", "Category description when empty ({category})", "Find {category} in {country} on {site}."],
  ]),
  ...X("About page (extra)", [
    ["about.eyebrow", "Small heading above title", "About"],
    ["about.ctaPlan", "Button: planning", "Start planning"],
    ["about.ctaVenues", "Button: venues", "Browse venues"],
  ]),
  ...X("Home page (extra)", [
    ["home.searchVendors", "Search vendors button", "Search vendors"],
    ["home.searchVenues", "Search venues button", "Venues"],
  ]),
  ...X("Vendors and venues pages", [
    ["browse.vendorsTitle", "Vendors page heading", "Wedding vendors"],
    ["browse.venuesTitle", "Venues page heading", "Wedding venues"],
    ["browse.vendorOne", "1 vendor found ({n})", "{n} vendor found"],
    ["browse.vendorMany", "Many vendors found ({n})", "{n} vendors found"],
    ["browse.venueOne", "1 venue found ({n})", "{n} venue found"],
    ["browse.venueMany", "Many venues found ({n})", "{n} venues found"],
    ["browse.allVendors", "Back link on category page", "All vendors"],
  ]),
  ...X("Planning page (extra)", [
    ["planning.eyebrow", "Small heading", "Start planning"],
    ["planning.sent", "Success message", "Thank you. Your appointment request was sent and we will contact you soon to confirm."],
    ["planning.errMissing", "Error: missing fields", "Please choose a time and enter your name and phone number."],
    ["planning.errTaken", "Error: slot taken", "That time was just taken. Please choose another one."],
    ["planning.errInvalid", "Error: bad date", "Please choose an available date."],
    ["planning.legendAvailable", "Legend: available", "Available"],
    ["planning.legendBooked", "Legend: fully booked", "Fully booked"],
    ["planning.legendNA", "Legend: not available", "Not available"],
    ["planning.chooseTime", "Choose a time label", "Choose a time"],
    ["planning.pickDay", "Empty state", "Pick an available day in the calendar to see the times."],
    ["planning.weddingDate", "Wedding date label", "Wedding date (optional)"],
    ["planning.phMessage", "Message placeholder", "Tell us about your wedding"],
  ]),
  ...X("Join page (extra)", [
    ["join.sent", "Success message", "Application received. We will contact you after review. When approved, manage your listing at /vendor."],
    ["join.errMissing", "Error: missing", "Please fill in the business name, category and phone."],
    ["join.errTerms", "Error: terms", "Please accept the Vendor Terms to continue."],
    ["join.errTin", "Error: TIN", "Please enter your TIN number."],
    ["join.lblBusiness", "Label: business name", "Business name"],
    ["join.lblOwner", "Label: owner", "Owner"],
    ["join.lblCategory", "Label: category", "Category"],
    ["join.selCategory", "Select category placeholder", "Select a category"],
    ["join.lblPhone", "Label: phone", "Phone / WhatsApp"],
    ["join.lblEmail", "Label: email", "Email (Google email you will use to sign in)"],
    ["join.lblTin", "Label: TIN", "TIN number"],
    ["join.lblDistrict", "Label: district", "District"],
    ["join.selDistrict", "Select district placeholder", "Select"],
    ["join.lblPrice", "Label: starting price (currency is added)", "Starting price"],
    ["join.lblAbout", "Label: about", "About your business"],
    ["join.submit", "Submit button", "Submit application"],
  ]),
  ...X("Listing page", [
    ["listing.catFallback", "Category fallback", "Listing"],
    ["listing.about", "Block: about", "About"],
    ["listing.capacity", "Block: capacity", "Capacity & pricing"],
    ["listing.amenities", "Block: amenities", "Amenities"],
    ["listing.packages", "Block: packages", "Packages"],
    ["listing.availability", "Block: availability", "Availability"],
    ["listing.videos", "Block: videos", "Videos"],
    ["listing.reviews", "Block: reviews", "Reviews"],
    ["listing.rowGuests", "Row: guests", "Guests"],
    ["listing.rowSeated", "Row: seated/standing", "Seated / standing"],
    ["listing.rowWeekday", "Row: weekday price", "Weekday price"],
    ["listing.rowWeekend", "Row: weekend price", "Weekend price"],
    ["listing.rowDeposit", "Row: deposit", "Deposit"],
    ["listing.rowCancel", "Row: cancellation", "Cancellation"],
    ["listing.guestsRange", "Guests range ({min} {max})", "{min} to {max}"],
    ["listing.upTo", "Card capacity ({n})", "Up to {n} guests"],
    ["listing.photosSoon", "No photos", "Photos coming soon"],
    ["listing.alreadyBooked", "Booked dates label", "Already booked:"],
    ["listing.noBooked", "No booked dates", "No upcoming dates are marked as booked. Send a request to confirm your date."],
    ["listing.noReviews", "No reviews", "No reviews yet."],
    ["listing.sendTitle", "Request form heading", "Send a request"],
    ["listing.sent", "Request sent", "Request sent. The vendor or our team will contact you soon."],
    ["listing.errMissing", "Error: missing", "Please enter your name and phone number."],
    ["listing.errBooked", "Error: date booked", "That date is already booked. Please choose another."],
    ["listing.phGuests", "Guests placeholder", "Guests"],
    ["listing.phMessage", "Message placeholder", "Tell us about your event"],
    ["listing.send", "Send button", "Send request"],
    ["listing.contact", "Contact heading", "Contact"],
  ]),
  ...X("Plans (extra)", [
    ["plan.commissionLine", "Commission line on plan card ({commission})", "{commission}% commission on Wacu-attributed transactions"],
    ["plan.commissionShort", "Commission in join form ({commission})", "{commission}% commission"],
  ]),
];
FIELDS.push(...EXTRA);
export const DEFAULTS: Record<string, string> = Object.fromEntries(FIELDS.map((x) => [x.key, x.value]));

type Src = Pick<Settings, "content"> | { content?: Record<string, string> } | undefined | null;

export function txt(s: Src, key: string): string {
  const v = s?.content?.[key];
  return v !== undefined ? v : (DEFAULTS[key] ?? "");
}
export const ts = (s: Settings, key: string, extra: Record<string, string> = {}): string => {
  let v = txt(s, key).split("{site}").join(s.siteName).split("{country}").join(txt(s, "locale.country"));
  for (const k of Object.keys(extra)) v = v.split("{" + k + "}").join(extra[k]);
  return v;
};
export const priceOpts = (s: Settings) => ({ cur: txt(s, "locale.currency"), ask: txt(s, "price.ask"), from: txt(s, "price.from") });
export const list =  (s: Src, key: string): string[] => txt(s, key).split("\n").map((x) => x.trim()).filter(Boolean);
export const pairs = (s: Src, key: string): [string, string][] =>
  list(s, key).map((l): [string, string] => {
    const i = l.indexOf("|");
    return i < 0 ? [l, ""] : [l.slice(0, i).trim(), l.slice(i + 1).trim()];
  });
