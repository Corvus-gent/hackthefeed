import "server-only";
import { z } from "zod";
import { chat } from "./gmi";

// Distinct on-camera people. Each source video gets two different ones so variants never share a face.
const PERSONAS = [
  "a 24-year-old Black woman with natural curly hair, gold hoops, oversized beige hoodie",
  "a 31-year-old South Asian man with a short beard, navy crewneck, wire glasses",
  "a 27-year-old East Asian woman with a sleek low bun, white tank top, minimal makeup",
  "a 38-year-old white man with salt-and-pepper stubble, flannel shirt, rolled sleeves",
  "a 22-year-old Latina woman with long wavy brown hair, cropped denim jacket",
  "a 45-year-old Middle Eastern woman with shoulder-length dark hair, cream blazer",
  "a 29-year-old mixed-race man with a buzz cut, black t-shirt, small chain necklace",
  "a 34-year-old red-haired woman with freckles, green knit sweater",
] as const;

const REALISM =
  "Shot on iPhone front camera, vertical 9:16, natural window light, handheld micro-shake, real skin texture with pores, " +
  "authentic UGC TikTok style, no text overlays, no music, speaks directly to camera with natural lip sync.";

const ScriptsSchema = z.object({
  variants: z
    .array(z.object({ hook: z.string(), script: z.string(), scene: z.string() }))
    .length(2),
});

export type Variant = { persona: string; hook: string; script: string; prompt: string };

/** Turn one Oriane video (raw JSON or text) + company brief into two video prompts with different people. */
export async function remix(company: string, oriane: string, seed: number): Promise<Variant[]> {
  const personas = [PERSONAS[(seed * 2) % PERSONAS.length], PERSONAS[(seed * 2 + 1) % PERSONAS.length]];

  const system =
    "You adapt viral short-form videos for a new brand. Keep the hook structure, pacing and format of the original " +
    "but rewrite everything for the new company. Scripts must be spoken in under 8 seconds (max ~20 words). " +
    'Reply with JSON only: {"variants":[{"hook":"","script":"","scene":""},{"hook":"","script":"","scene":""}]}. ' +
    "scene = setting and action in one sentence. Make the two variants different takes.";
  const user = `COMPANY:\n${company}\n\nVIRAL VIDEO FROM ORIANE:\n${oriane}`;

  let variants: z.infer<typeof ScriptsSchema>["variants"];
  try {
    const raw = await chat(system, user);
    const json = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
    variants = ScriptsSchema.parse(JSON.parse(json)).variants;
  } catch (err) {
    // LLM down or malformed: fall back to a generic take so the demo still renders.
    console.error("remix LLM failed", err);
    const name = company.split("\n")[0].slice(0, 60);
    variants = [
      { hook: "Nobody talks about this", script: `Okay nobody talks about this, but ${name} genuinely changed how I do things.`, scene: "sitting in a car, talking to camera" },
      { hook: "POV you found it", script: `POV: you finally found ${name}. Thank me later.`, scene: "standing in a bright kitchen, holding a phone" },
    ];
  }

  return variants.map((v, i) => ({
    persona: personas[i],
    hook: v.hook,
    script: v.script,
    prompt: `${personas[i]}, ${v.scene}. They say: "${v.script}" ${REALISM}`,
  }));
}
