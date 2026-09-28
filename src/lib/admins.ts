import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export type Admin = { email: string; name: string; addedBy: string; createdAt: string };

const DIR = path.join(process.cwd(), "data");
const FILE = path.join(DIR, "admins.json");

export const rootEmail = () => (process.env.ROOT_ADMIN_EMAIL ?? "").trim().toLowerCase();

let chain: Promise<unknown> = Promise.resolve();
function locked<T>(fn: () => Promise<T>): Promise<T> {
  const run = chain.then(fn, fn);
  chain = run.catch(() => undefined);
  return run;
}

async function readRaw(): Promise<Admin[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as Admin[];
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw e;
  }
}

async function writeRaw(list: Admin[]): Promise<void> {
  await fs.mkdir(DIR, { recursive: true });
  const tmp = `${FILE}.${randomUUID().slice(0, 8)}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(list, null, 2), "utf8");
  for (let i = 0; ; i++) {
    try {
      await fs.rename(tmp, FILE);
      return;
    } catch (e) {
      const code = (e as NodeJS.ErrnoException).code;
      if (i < 5 && (code === "EPERM" || code === "EBUSY" || code === "EACCES")) {
        await new Promise((r) => setTimeout(r, 50 * (i + 1)));
        continue;
      }
      await fs.rm(tmp, { force: true }).catch(() => undefined);
      throw e;
    }
  }
}

export const listAdmins = (): Promise<Admin[]> => locked(readRaw);

export const addAdmin = (email: string, name: string, addedBy: string): Promise<void> =>
  locked(async () => {
    const list = await readRaw();
    if (email === rootEmail() || list.some((a) => a.email === email)) return;
    list.push({ email, name, addedBy, createdAt: new Date().toISOString() });
    await writeRaw(list);
  });

export const removeAdmin = (email: string): Promise<void> =>
  locked(async () => {
    const list = await readRaw();
    await writeRaw(list.filter((a) => a.email !== email));
  });

export async function isAllowed(email: string): Promise<boolean> {
  const e = email.trim().toLowerCase();
  if (!e) return false;
  if (e === rootEmail()) return true;
  return (await listAdmins()).some((a) => a.email === e);
}