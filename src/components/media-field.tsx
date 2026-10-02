"use client";

import { useState } from "react";
import { uploadFile } from "@/lib/upload-client";
import { ViewToggle, useView } from "@/components/view-toggle";
import { LibraryPicker } from "@/components/library-picker";

type Photo = { label: string; url: string };
type Job = { id: string; name: string; pct: number; err?: string };
const isVideoFile = (u: string) => /\.(mp4|webm|mov)(\?|$)/i.test(u);
const clean = (s: string) => s.replace(/[|\r\n]/g, " ").trim();

export function MediaField({ photos: p0, videos: v0 }: { photos: Photo[]; videos: string[] }) {
  const [photos, setPhotos] = useState<Photo[]>(p0);
  const [videos, setVideos] = useState<string[]>(v0);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [purl, setPurl] = useState("");
  const [vurl, setVurl] = useState("");
  const [view, setView] = useView();

  async function addFiles(files: FileList | null, kind: "photo" | "video") {
    if (!files) return;
    for (const f of Array.from(files)) {
      const id = Math.random().toString(36).slice(2);
      setJobs((j) => [...j, { id, name: f.name, pct: 0 }]);
      try {
        const url = await uploadFile(f, (p) => setJobs((j) => j.map((x) => (x.id === id ? { ...x, pct: p } : x))));
        if (kind === "photo") setPhotos((p) => [...p, { label: "", url }]); else setVideos((v) => [...v, url]);
        setJobs((j) => j.filter((x) => x.id !== id));
      } catch (e) {
        setJobs((j) => j.map((x) => (x.id === id ? { ...x, err: (e as Error).message } : x)));
      }
    }
  }

  const move = <T,>(arr: T[], i: number, d: number): T[] => {
    const k = i + d;
    if (k < 0 || k >= arr.length) return arr;
    const c = [...arr];
    [c[i], c[k]] = [c[k], c[i]];
    return c;
  };
  const uploading = jobs.some((j) => !j.err);

  const photoButtons = (i: number) => (
    <div className="flex flex-wrap gap-1">
      <button type="button" className="btn btn-outline btn-sm" onClick={() => setPhotos((a) => move(a, i, -1))}>Left</button>
      <button type="button" className="btn btn-outline btn-sm" onClick={() => setPhotos((a) => move(a, i, 1))}>Right</button>
      {i > 0 && <button type="button" className="btn btn-outline btn-sm" onClick={() => setPhotos((a) => [a[i], ...a.filter((_, k) => k !== i)])}>Cover</button>}
      <button type="button" className="btn btn-danger btn-sm" onClick={() => setPhotos((a) => a.filter((_, k) => k !== i))}>Remove</button>
    </div>
  );
  const videoButtons = (i: number) => (
    <div className="flex shrink-0 gap-1">
      <button type="button" className="btn btn-outline btn-sm" onClick={() => setVideos((a) => move(a, i, -1))}>Up</button>
      <button type="button" className="btn btn-outline btn-sm" onClick={() => setVideos((a) => move(a, i, 1))}>Down</button>
      <button type="button" className="btn btn-danger btn-sm" onClick={() => setVideos((a) => a.filter((_, k) => k !== i))}>Remove</button>
    </div>
  );
  const videoEl = (u: string, cls: string) =>
    isVideoFile(u)
      ? <video src={u} controls preload="metadata" className={cls} />
      : <a href={u} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1 truncate text-sm text-wine-600 underline">{u}</a>;

  return (
    <div className="space-y-6 sm:col-span-2">
      <textarea name="photos" readOnly tabIndex={-1} className="hidden" value={photos.map((p) => (clean(p.label) ? `${clean(p.label)} | ${p.url}` : p.url)).join("\n")} />
      <textarea name="videos" readOnly tabIndex={-1} className="hidden" value={videos.join("\n")} />

      <div className="flex flex-wrap items-center justify-end gap-2"><LibraryPicker onPick={(url, vid) => (vid ? setVideos((v) => [...v, url]) : setPhotos((p) => [...p, { label: "", url }]))} /><ViewToggle view={view} onChange={setView} /></div>

      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="label !mb-0">Photos ({photos.length}) - the first one is the cover</p>
          <label className="btn btn-outline btn-sm cursor-pointer">
            Upload photos
            <input type="file" accept="image/*" multiple hidden onChange={(e) => { addFiles(e.target.files, "photo"); e.target.value = ""; }} />
          </label>
        </div>
        {view === "grid" ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((p, i) => (
              <div key={p.url + i} className="rounded-xl border border-line p-2">
                <img src={p.url} alt="" className="h-28 w-full rounded-lg object-cover" />
                <input value={p.label} placeholder="Label (optional)" onChange={(e) => setPhotos((a) => a.map((x, k) => (k === i ? { ...x, label: e.target.value } : x)))} className="input mt-2 py-1 text-xs" />
                <div className="mt-2">{photoButtons(i)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {photos.map((p, i) => (
              <div key={p.url + i} className="flex flex-wrap items-center gap-3 rounded-xl border border-line p-2">
                <img src={p.url} alt="" className="h-14 w-20 shrink-0 rounded-lg object-cover" />
                <input value={p.label} placeholder="Label (optional)" onChange={(e) => setPhotos((a) => a.map((x, k) => (k === i ? { ...x, label: e.target.value } : x)))} className="input min-w-0 flex-1 py-1 text-xs" />
                {photoButtons(i)}
              </div>
            ))}
          </div>
        )}
        <div className="mt-3 flex gap-2">
          <input value={purl} onChange={(e) => setPurl(e.target.value)} placeholder="Or paste an image URL" className="input" />
          <button type="button" className="btn btn-outline btn-sm shrink-0" onClick={() => { if (purl.trim()) { setPhotos((a) => [...a, { label: "", url: purl.trim() }]); setPurl(""); } }}>Add URL</button>
        </div>
      </div>

      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="label !mb-0">Videos ({videos.length})</p>
          <label className="btn btn-outline btn-sm cursor-pointer">
            Upload videos
            <input type="file" accept="video/mp4,video/webm,video/quicktime" multiple hidden onChange={(e) => { addFiles(e.target.files, "video"); e.target.value = ""; }} />
          </label>
        </div>
        {view === "grid" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {videos.map((u, i) => (
              <div key={u + i} className="rounded-xl border border-line p-2">
                {videoEl(u, "h-40 w-full rounded-lg bg-black object-contain")}
                <div className="mt-2">{videoButtons(i)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {videos.map((u, i) => (
              <div key={u + i} className="flex flex-wrap items-center gap-3 rounded-xl border border-line p-2">
                {videoEl(u, "h-16 rounded-lg")}
                <div className="ml-auto">{videoButtons(i)}</div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-3 flex gap-2">
          <input value={vurl} onChange={(e) => setVurl(e.target.value)} placeholder="Or paste a YouTube / video URL" className="input" />
          <button type="button" className="btn btn-outline btn-sm shrink-0" onClick={() => { if (vurl.trim()) { setVideos((a) => [...a, vurl.trim()]); setVurl(""); } }}>Add URL</button>
        </div>
      </div>

      {jobs.length > 0 && (
        <div className="space-y-1 text-xs">
          {jobs.map((j) => (
            <p key={j.id} className={j.err ? "text-red-600" : "text-muted"}>
              {j.name}: {j.err ? j.err : `${j.pct}%`}
              {j.err && <button type="button" className="ml-2 underline" onClick={() => setJobs((a) => a.filter((x) => x.id !== j.id))}>dismiss</button>}
            </p>
          ))}
        </div>
      )}
      {uploading && <p className="text-xs font-medium text-wine-700">Uploading... wait for it to finish before you press Save.</p>}
    </div>
  );
}