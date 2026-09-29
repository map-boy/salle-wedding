"use server";

import { redirect } from "next/navigation";
import { mutate, newId, readDb } from "../db";
import { SLOTS, isBookable, isDateStr, takenSlots } from "../appointments";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

export async function submitAppointment(fd: FormData): Promise<void> {
  const date = str(fd, "date");
  const time = str(fd, "time");
  const name = str(fd, "name");
  const phone = str(fd, "phone");
  if (!isBookable(date)) redirect("/planning?error=invalid");
  const cfg = (await readDb()).settings.appointmentSlots ?? [];
  const slots = cfg.length ? cfg : SLOTS;
  if (!name || !phone || !slots.includes(time)) redirect(`/planning?date=${date}&error=missing`);
  const wedding = str(fd, "eventDate");
  const note = str(fd, "message");
  let taken = false as boolean;
  await mutate((d) => {
    if (takenSlots(d.inquiries).has(`${date}|${time}`)) { taken = true; return; }
    d.inquiries.unshift({
      id: newId(), listingId: "", name, phone, email: str(fd, "email"),
      eventDate: isDateStr(wedding) ? wedding : "", guests: 0,
      message: `Appointment: ${date} ${time}${note ? `\n${note}` : ""}`,
      status: "new", createdAt: new Date().toISOString(),
    });
  });
  if (taken) redirect(`/planning?date=${date}&error=taken`);
  redirect("/planning?sent=1");
}
