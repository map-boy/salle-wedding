import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { firestore } from "./admin-sdk";

export type VendorAcct = { email: string; name: string; addedBy: string; createdAt: string };

const DIR = process.env.VERCEL ? path.join(os.tmpdir(), "jeph-data") : path.join(process.cwd(), "data");
const FILE = path.join(DIR, "vendors.json");
const norm = (e: string) => e.trim().toLowerCase();

async function readLocal(): Promise<VendorAcct[]> {
  try { return JSON.parse(await fs.readFile(FILE, "utf8")) as VendorAcct[]; } catch { return []; }
}
async function writeLocal(l: VendorAcct[]): Promise<void> {
  await fs.mkdir(DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(l, null, 2), "utf8");
}

export async function listVendorAccounts(): Promise<VendorAcct[]> {
  const f = firestore();
  if (f) return (await f.collection("vendors").get()).docs.map((d) => d.data() as VendorAcct).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  return readLocal();
}

export async function hasVendorAccount(email: string): Promise<boolean> {
  const e = norm(email);
  const f = firestore();
  if (f) return (await f.collection("vendors").doc(e).get()).exists;
  return (await readLocal()).some((a) => a.email === e);
}

export async function addVendorAccount(email: string, name: string, addedBy: string): Promise<void> {
  const e = norm(email);
  if (!e) return;
  const f = firestore();
  if (f) {
    const ref = f.collection("vendors").doc(e);
    if ((await ref.get()).exists) return;
    await ref.set({ email: e, name, addedBy, createdAt: new Date().toISOString() });
    return;
  }
  const list = await readLocal();
  if (list.some((a) => a.email === e)) return;
  list.push({ email: e, name, addedBy, createdAt: new Date().toISOString() });
  await writeLocal(list);
}

export async function removeVendorAccount(email: string): Promise<void> {
  const e = norm(email);
  const f = firestore();
  if (f) { await f.collection("vendors").doc(e).delete(); return; }
  await writeLocal((await readLocal()).filter((a) => a.email !== e));
}