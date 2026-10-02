import { submitInquiry } from "@/lib/actions/public";
import { priceOpts, ts, txt } from "@/lib/content";
import { categoryOf, kindOf, ratingOf } from "@/lib/db";
import { digits, fmtDate, priceText, rwf } from "@/lib/format";
import type { Db, Listing } from "@/lib/types";
import { amenityEmoji, catEmoji } from "@/lib/emoji";
import { isPremium } from "@/lib/plans";
import { Badge, Banner, Stars } from "./ui";

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card p-6">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line py-2 text-sm last:border-0">
      <span className="text-muted">{k}</span>
      <span className="text-right font-medium">{v}</span>
    </div>
  );
}

export function ListingDetail({
  db, l, back, sent, error,
}: { db: Db; l: Listing; back: string; sent: boolean; error: string }) {
  const cat = categoryOf(db, l.categorySlug);
  const isVenue = kindOf(db, l) === "venue";
  const hidePrice = !!cat?.hidePrice;
  const { avg, count } = ratingOf(db, l.id);
  const reviews = db.reviews.filter((r) => r.listingId === l.id);
  const v = l.venue;
  const today = new Date().toISOString().slice(0, 10);
  const booked = l.bookedDates.filter((d) => d >= today).sort();
  const wa = digits(l.contact.whatsapp || l.contact.phone);
  const socials = Object.entries(l.social).filter(([, url]) => url);
  const photos = l.photos.slice(0, 9);
  const st = db.settings;
  const cur = txt(st, "locale.currency");
  const ask = txt(st, "price.askVenue");

  return (
    <div className="container-page py-10">
      <p className="text-sm text-muted">{(cat ? catEmoji(cat) + " " : "") + (cat?.name ?? txt(st, "listing.catFallback"))}</p>
      <div className="mt-1 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold sm:text-4xl">{l.name}</h1>
        {l.featured && <Badge tone="gold">{txt(st, "badge.featured")}</Badge>}
        {isPremium(l) && <Badge tone="wine">{txt(st, "badge.premium")}</Badge>}
        {l.verified && <Badge tone="green">{txt(st, "badge.verified")}</Badge>}
        {l.trending && <Badge tone="wine">{txt(st, "badge.trending")}</Badge>}
      </div>
      {l.tagline && <p className="mt-2 text-lg text-muted">{l.tagline}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
        <Stars avg={avg} count={count} />
        <span className="text-muted">{l.districts.join(", ") || txt(st, "locale.country")}{l.address ? ` - ${l.address}` : ""}</span>
        {!hidePrice && <span className="font-medium text-wine-700">{priceText(l, priceOpts(st))}</span>}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.length ? photos.map((p, i) => (
              <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-wine-100 to-gold-100">
                {p.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.url} alt={p.label || l.name} className="h-full w-full object-cover" />
                ) : null}
                {p.label ? <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-xs">{p.label}</span> : null}
              </div>
            )) : (
              <div className="col-span-full flex aspect-[16/6] items-center justify-center rounded-xl bg-gradient-to-br from-wine-100 to-gold-100 text-sm text-muted">{txt(st, "listing.photosSoon")}</div>
            )}
          </div>

          {l.description && <Block title={txt(st, "listing.about")}><p className="whitespace-pre-line leading-7 text-ink/80">{l.description}</p></Block>}

          {isVenue && (
            <Block title={txt(st, "listing.capacity")}>
              <Row k={"👥 " + txt(st, "listing.rowGuests")} v={v.maxGuests ? ts(st, "listing.guestsRange", { min: String(v.minGuests || 0), max: String(v.maxGuests) }) : ask} />
              <Row k={"🪑 " + txt(st, "listing.rowSeated")} v={v.seated || v.standing ? `${v.seated} / ${v.standing}` : ask} />
              <Row k={"💵 " + txt(st, "listing.rowWeekday")} v={v.weekdayPrice ? rwf(v.weekdayPrice, cur) : ask} />
              <Row k={"💵 " + txt(st, "listing.rowWeekend")} v={v.weekendPrice ? rwf(v.weekendPrice, cur) : ask} />
              <Row k={"💵 " + txt(st, "listing.rowDeposit")} v={v.deposit ? rwf(v.deposit, cur) : ask} />
              <Row k={"📝 " + txt(st, "listing.rowCancel")} v={v.cancellationPolicy || ask} />
            </Block>
          )}

          {isVenue && v.amenities.length > 0 && (
            <Block title={txt(st, "listing.amenities")}>
              <div className="flex flex-wrap gap-2">
                {v.amenities.map((a) => <span key={a} className="rounded-full border border-line bg-cream-50 px-3 py-1 text-sm">{amenityEmoji(a) + " " + a}</span>)}
              </div>
            </Block>
          )}

          {l.packages.length > 0 && (
            <Block title={txt(st, "listing.packages")}>
              <div className="grid gap-3 sm:grid-cols-2">
                {l.packages.map((p, i) => (
                  <div key={i} className="rounded-xl border border-line p-4">
                    <p className="font-semibold">{p.name}</p>
                    {!hidePrice && <p className="text-sm font-medium text-wine-700">{rwf(p.price, cur)}</p>}
                    <p className="mt-1 text-sm text-muted">{p.description}</p>
                  </div>
                ))}
              </div>
            </Block>
          )}

          <Block title={txt(st, "listing.availability")}>
            {booked.length ? (
              <>
                <p className="mb-3 text-sm text-muted">{txt(st, "listing.alreadyBooked")}</p>
                <div className="flex flex-wrap gap-2">
                  {booked.map((d) => <span key={d} className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700">{fmtDate(d)}</span>)}
                </div>
              </>
            ) : <p className="text-sm text-muted">{txt(st, "listing.noBooked")}</p>}
          </Block>

          {l.videos.length > 0 && (
            <Block title={txt(st, "listing.videos")}>
              <ul className="space-y-1 text-sm">
                {l.videos.map((u) => <li key={u}>{/\.(mp4|webm|mov)(\?|$)/i.test(u) ? <video src={u} controls preload="metadata" className="w-full max-w-2xl rounded-xl" /> : <a href={u} target="_blank" rel="noopener noreferrer" className="text-wine-600 underline-offset-2 hover:underline">{u}</a>}</li>)}
              </ul>
            </Block>
          )}

          <Block title={txt(st, "listing.reviews") + " (" + count + ")"}>
            {reviews.length ? (
              <ul className="space-y-4">
                {reviews.map((r) => (
                  <li key={r.id} className="border-b border-line pb-4 last:border-0 last:pb-0">
                    <p className="text-sm font-medium">
                      {r.author} {r.verified && <Badge tone="green">{txt(st, "badge.verified")}</Badge>} <span className="ml-1 text-gold-500">&#9733;</span> {r.rating}/5
                    </p>
                    <p className="mt-1 text-sm text-muted">{r.comment}</p>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted">{txt(st, "listing.noReviews")}</p>}
          </Block>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <h2 className="text-xl font-semibold">{txt(st, "listing.sendTitle")}</h2>
            {sent && <div className="mt-3"><Banner>{txt(st, "listing.sent")}</Banner></div>}
            {error === "missing" && <div className="mt-3"><Banner tone="bad">{txt(st, "listing.errMissing")}</Banner></div>}
            {error === "booked" && <div className="mt-3"><Banner tone="bad">{txt(st, "listing.errBooked")}</Banner></div>}
            <form action={submitInquiry} className="mt-4 space-y-3">
              <input type="hidden" name="listingId" value={l.id} />
              <input type="hidden" name="back" value={back} />
              <input name="name" required placeholder={txt(st, "form.phName")} className="input" />
              <input name="phone" required placeholder={txt(st, "form.phPhone")} className="input" />
              <input name="email" type="email" placeholder={txt(st, "form.phEmail")} className="input" />
              <div className="grid grid-cols-2 gap-3">
                <input name="eventDate" type="date" className="input" />
                <input name="guests" type="number" min={0} placeholder={txt(st, "listing.phGuests")} className="input" />
              </div>
              <textarea name="message" rows={3} placeholder={txt(st, "listing.phMessage")} className="input" />
              <button type="submit" className="btn btn-primary w-full">{txt(st, "listing.send")}</button>
            </form>
          </div>

          <div className="card space-y-2 p-6 text-sm">
            <h2 className="text-xl font-semibold">{txt(st, "listing.contact")}</h2>
            {l.contact.phone && <p><a href={`tel:${l.contact.phone}`} className="hover:text-wine-600">{l.contact.phone}</a></p>}
            {wa && <p><a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="text-ok hover:underline">{txt(st, "ui.chatWhatsapp")}</a></p>}
            {l.contact.email && <p><a href={`mailto:${l.contact.email}`} className="hover:text-wine-600">{l.contact.email}</a></p>}
            {socials.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-2">
                {socials.map(([k, url]) => (
                  <a key={k} href={url} target="_blank" rel="noopener noreferrer" className="capitalize text-wine-600 hover:underline">{k}</a>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}