import { getVideo } from "@/lib/gmi";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  try {
    const job = await getVideo(id);
    return Response.json({ status: job.status, videoUrl: job.outcome?.video_url ?? null });
  } catch (err) {
    return Response.json({ status: "error", error: err instanceof Error ? err.message : String(err) }, { status: 502 });
  }
}
