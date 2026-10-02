import { getApps } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { firestore } from "./admin-sdk";

export function bucket() {
  if (!firestore()) return null;
  const app = getApps()[0];
  if (!app) return null;
  const name = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebasestorage.app`;
  return getStorage(app).bucket(name);
}

export const dlUrl = (bucketName: string, path: string, token: string) =>
  `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;