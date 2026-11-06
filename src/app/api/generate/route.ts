import { z } from "zod";
import { generateImage, submitVideo, VIDEO_MODEL } from "@/lib/gmi";
import { remix, type Variant } from "@/lib/remix";

export const maxDuration = 300;

const Body = z.object({
  company: z.string().min(1),
  productImage: z.string().url().optional(),
  videos: z.array(z.string().min(1)).min(1).max(5),
  model: z.string().optional(),
});

export type GenerateResponse = {
  results: {
    source: number;
    person: string;
    line: string;
    videoPrompt: string;
    imageUrl?: string;
    requestId?: string;
    error?: string;
  }[];
};

/**
 * POST: for each Oriane video write 2 scripts, render a photo of each person holding the
 * product, then queue image-to-video on GMI. The client polls /api/status/[id].
 */
export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return Response.json({ error: parsed.error.message }, { status: 400 });
  const { company, productImage, videos, model = VIDEO_MODEL } = parsed.data;
  const refs = productImage ? [productImage] : [];

  const render = async (source: number, { person, line, imagePrompt, videoPrompt }: Variant) => {
    let imageUrl: string | undefined;
    try {
      imageUrl = await generateImage(imagePrompt, refs);
      const job = await submitVideo(videoPrompt, imageUrl, model);
      return { source, person, line, videoPrompt, imageUrl, requestId: job.request_id };
    } catch (err) {
      return { source, person, line, videoPrompt, imageUrl, error: message(err) };
    }
  };

  try {
    const perVideo = await Promise.all(
      videos.map(async (video, source) => {
        const variants = await remix(company, video, source);
        return Promise.all(variants.map((v) => render(source, v)));
      }),
    );
    return Response.json({ results: perVideo.flat() } satisfies GenerateResponse);
  } catch (err) {
    return Response.json({ error: `Script writing failed: ${message(err)}` }, { status: 502 });
  }
}

const message = (err: unknown) => (err instanceof Error ? err.message : String(err));
