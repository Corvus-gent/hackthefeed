import "server-only";
import { z } from "zod";

// GMI Cloud clients: request-queue (video) and OpenAI-compatible chat (LLM).
const QUEUE_URL = "https://console.gmicloud.ai/api/v1/ie/requestqueue/apikey";
const CHAT_URL = "https://api.gmi-serving.com/v1/chat/completions";

export const VIDEO_MODEL = process.env.GMI_VIDEO_MODEL ?? "veo-3.1-lite-generate-001";
const LLM_MODEL = process.env.GMI_LLM_MODEL ?? "deepseek-ai/DeepSeek-V4-Flash";

function headers() {
  const key = process.env.GMI_API_KEY;
  if (!key) throw new Error("GMI_API_KEY is missing. Add it to .env.local");
  return { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

async function gmiFetch<T extends z.ZodType>(url: string, schema: T, init?: RequestInit): Promise<z.infer<T>> {
  const res = await fetch(url, { ...init, headers: headers(), cache: "no-store" });
  const body: unknown = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`GMI ${res.status}: ${JSON.stringify(body)}`);
  return schema.parse(body);
}

const RequestSchema = z.object({
  request_id: z.string(),
  status: z.string(),
  outcome: z
    .object({ video_url: z.string().optional(), thumbnail_image_url: z.string().optional() })
    .passthrough()
    .nullish(),
});
export type VideoRequest = z.infer<typeof RequestSchema>;

// Talking-head capable models (native audio + lip sync). Price per second at 720p with audio.
export const VIDEO_MODELS = [
  "veo-3.1-lite-generate-001", // $0.05/s, best value
  "seedance-2-0-fast-260128", // $0.12/s
  "veo-3.1-fast-generate-001", // $0.15/s
  "seedance-2-5-260628", // $0.23/s, highest fidelity
] as const;

// Payload keys differ per provider: Veo uses camelCase, Seedance snake_case.
function videoPayload(model: string, prompt: string) {
  if (model.startsWith("veo")) {
    return { prompt, durationSeconds: 8, aspectRatio: "9:16", resolution: "720p", generateAudio: true, personGeneration: "allow_adult" };
  }
  return { prompt, duration: 8, ratio: "9:16", resolution: "720p", generate_audio: true, watermark: false };
}

const FALLBACK_MODEL = "seedance-2-0-fast-260128";

/**
 * Queue a text-to-video job. Veo on GMI randomly 500s on submit, so retry a few times,
 * then fall back to Seedance. Poll with getVideo until "success".
 */
export async function submitVideo(prompt: string, model = VIDEO_MODEL) {
  const submit = (m: string) =>
    gmiFetch(`${QUEUE_URL}/requests`, RequestSchema, {
      method: "POST",
      body: JSON.stringify({ model: m, payload: videoPayload(m, prompt) }),
    });

  const attempts = model === FALLBACK_MODEL ? [model, model, model] : [model, model, model, FALLBACK_MODEL];
  let lastError: unknown;
  for (const [i, m] of attempts.entries()) {
    try {
      return await submit(m);
    } catch (err) {
      lastError = err;
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw lastError;
}

export function getVideo(id: string) {
  return gmiFetch(`${QUEUE_URL}/requests/${encodeURIComponent(id)}`, RequestSchema);
}

const ChatSchema = z.object({
  choices: z.array(z.object({ message: z.object({ content: z.string() }) })),
});

/** Single-turn chat completion that returns the raw text reply. */
export async function chat(system: string, user: string) {
  const data = await gmiFetch(CHAT_URL, ChatSchema, {
    method: "POST",
    body: JSON.stringify({
      model: LLM_MODEL,
      temperature: 0.8,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  return data.choices[0]?.message.content ?? "";
}
