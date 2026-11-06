# HackTheFeed

Paste Oriane viral-video data and a company brief. Each video becomes two new 9:16 UGC clips with different on-camera people, generated on GMI Cloud.

## Pipeline
1. A GMI LLM (`deepseek-ai/DeepSeek-V4-Flash`) rewrites the hook and script for the company (`src/lib/remix.ts`).
2. Each variant gets a different persona and a realism prompt.
3. The clip renders on the GMI request queue (`src/lib/gmi.ts`), default `veo-3.1-lite-generate-001` (native audio + lip sync, $0.05/s at 720p, about $0.40 per 8s clip).

## Run
```bash
cp .env.example .env.local  # add GMI_API_KEY
npm run dev
```
