import { VIDEO_MODEL, VIDEO_MODELS } from "@/lib/gmi";

export function GET() {
  return Response.json({ models: VIDEO_MODELS, default: VIDEO_MODEL });
}
