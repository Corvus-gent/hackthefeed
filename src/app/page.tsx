"use client";

import { useEffect, useState } from "react";
import type { GenerateResponse } from "./api/generate/route";

type Result = GenerateResponse["results"][number] & { status?: string; videoUrl?: string | null };

const EXAMPLE_ORIANE = JSON.stringify(
  {
    url: "https://www.tiktok.com/@creator/video/123",
    platform: "tiktok",
    views: 2400000,
    likes: 310000,
    caption: "this changed my morning routine forever #productivity",
    transcript: "Stop scrolling. If you wake up tired every day, you need to hear this...",
    visual_tags: ["talking head", "bedroom", "morning light", "close-up"],
  },
  null,
  2,
);

export default function Home() {
  const [company, setCompany] = useState("");
  const [videos, setVideos] = useState([EXAMPLE_ORIANE]);
  const [models, setModels] = useState<string[]>([]);
  const [model, setModel] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/models")
      .then((r) => r.json())
      .then((d: { models: string[]; default: string }) => {
        setModels(d.models);
        setModel(d.default);
      });
  }, []);

  // Poll every pending job until it succeeds or fails.
  useEffect(() => {
    const pending = results.filter((r) => r.requestId && !r.videoUrl && !["failed", "cancelled"].includes(r.status ?? "") && !r.error);
    if (!pending.length) return;
    const t = setTimeout(async () => {
      const updates = await Promise.all(
        pending.map(async (r) => {
          const d: { status: string; videoUrl?: string | null } = await fetch(`/api/status/${r.requestId}`).then((x) => x.json());
          return [r.requestId, d] as const;
        }),
      );
      const byId = new Map(updates);
      setResults((prev) => prev.map((r) => (r.requestId && byId.has(r.requestId) ? { ...r, ...byId.get(r.requestId) } : r)));
    }, 5000);
    return () => clearTimeout(t);
  }, [results]);

  async function generate() {
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, videos: videos.filter((v) => v.trim()), model }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults((data as GenerateResponse).results);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl p-6 space-y-8">
      <h1 className="text-3xl font-semibold">HackTheFeed</h1>

      <section className="space-y-2">
        <label className="font-medium">Company</label>
        <textarea
          className="w-full h-28 rounded border border-neutral-700 bg-transparent p-3 text-sm"
          placeholder="Name, product, audience, tone..."
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="font-medium">Oriane videos</label>
          <button className="text-sm underline" onClick={() => setVideos([...videos, ""])}>
            Add video
          </button>
        </div>
        {videos.map((v, i) => (
          <div key={i} className="flex gap-2">
            <textarea
              className="w-full h-40 rounded border border-neutral-700 bg-transparent p-3 font-mono text-xs"
              placeholder="Paste Oriane output (JSON or text)"
              value={v}
              onChange={(e) => setVideos(videos.map((x, j) => (j === i ? e.target.value : x)))}
            />
            {videos.length > 1 && (
              <button className="text-sm" onClick={() => setVideos(videos.filter((_, j) => j !== i))}>
                Remove
              </button>
            )}
          </div>
        ))}
      </section>

      <div className="flex items-center gap-3">
        <select className="rounded border border-neutral-700 bg-transparent p-2 text-sm" value={model} onChange={(e) => setModel(e.target.value)}>
          {models.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <button
          className="rounded bg-white px-4 py-2 text-black disabled:opacity-50"
          disabled={loading || !company.trim()}
          onClick={generate}
        >
          {loading ? "Writing scripts..." : `Generate ${videos.filter((v) => v.trim()).length * 2} videos`}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {results.map((r, i) => (
          <div key={i} className="space-y-2">
            {r.videoUrl ? (
              <video src={r.videoUrl} controls playsInline className="aspect-[9/16] w-full rounded bg-black" />
            ) : (
              <div className="flex aspect-[9/16] w-full items-center justify-center rounded bg-neutral-900 text-sm text-neutral-400">
                {r.error ? "Failed" : (r.status ?? "queued")}
              </div>
            )}
            <p className="text-sm font-medium">
              Video {r.source + 1}: {r.hook}
            </p>
            <p className="text-sm">&ldquo;{r.script}&rdquo;</p>
            <p className="text-xs text-neutral-500">{r.persona}</p>
            {r.error && <p className="text-xs text-red-500 break-all">{r.error}</p>}
          </div>
        ))}
      </section>
    </main>
  );
}
