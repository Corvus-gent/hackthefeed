import { z } from "zod";
import { submitVideo, VIDEO_MODEL } from "@/lib/gmi";
import { remix } from "@/lib/remix";

const Body = z.object({
  company: z.string().min(1),
  videos: z.array(z.string().min(1)).min(1).max(5),
  model: z.string().optional(),
});

export type GenerateResponse = {
  results: {
    source: number;
    persona: string;
    hook: string;
    script: string;
    prompt: string;
    requestId?: string;
    error?: string;
  }[];
};

// POST: remix each Oriane video into 2 variants and queue them on GMI. Client polls /api/status/[id].
export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return Response.json({ error: parsed.error.message }, { status: 400 });
  const { company, videos, model = VIDEO_MODEL } = parsed.data;

  const perVideo = await Promise.all(
    videos.map(async (video, source) => {
      const variants = await remix(company, video, source);
      return Promise.all(
        variants.map(async (v) => {
          try {
            const job = await submitVideo(v.prompt, model);
            return { source, ...v, requestId: job.request_id };
          } catch (err) {
            return { source, ...v, error: err instanceof Error ? err.message : String(err) };
          }
        }),
      );
    }),
  );

  return Response.json({ results: perVideo.flat() } satisfies GenerateResponse);
}
