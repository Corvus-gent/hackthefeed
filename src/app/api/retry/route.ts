import { z } from "zod";
import { FALLBACK_VIDEO_MODEL, submitVideo } from "@/lib/gmi";

const Body = z.object({ prompt: z.string().min(1), imageUrl: z.string().url().optional() });

// POST: re-render a clip on the fallback model, used when Veo's safety filter blocks a render.
export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return Response.json({ error: parsed.error.message }, { status: 400 });
  try {
    const job = await submitVideo(parsed.data.prompt, parsed.data.imageUrl, FALLBACK_VIDEO_MODEL);
    return Response.json({ requestId: job.request_id });
  } catch (err) {
    return Response.json({ error: err instanceof Error ? err.message : String(err) }, { status: 502 });
  }
}
