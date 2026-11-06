import "server-only";
import { z } from "zod";
import { chat } from "./gmi";

// Base identities. Each source video gets two different ones so variants never share a face.
// The LLM dresses and places them to fit the original video's vibe.
const PEOPLE = [
  "a 26-year-old white woman with long messy brown hair",
  "a 30-year-old Black man with a short fade and a trimmed beard",
  "a 23-year-old East Asian woman with a high ponytail",
  "a 34-year-old Latino man with curly dark hair",
  "a 28-year-old South Asian woman with long dark wavy hair",
  "a 25-year-old white man with a blond buzz cut and freckles",
  "a 32-year-old Black woman with box braids",
  "a 27-year-old Middle Eastern man with thick dark hair and stubble",
] as const;

const VariantSchema = z.object({
  outfit: z.string(),
  setting: z.string(),
  expression: z.string(),
  action: z.string(),
  line: z.string(),
});
const ScriptsSchema = z.object({ variants: z.array(VariantSchema).length(2) });

export type Variant = { person: string; line: string; imagePrompt: string; videoPrompt: string };

const SYSTEM = `You recreate viral short-form videos for a different brand.
You get a viral video's data from Oriane (transcript, caption, on-screen text, stats) and a company brief.
Keep what made the original work: the hook, the character bit, the energy, the setting type.
Swap the competitor for the company's product. Each clip is ONE continuous 8-second selfie shot of one person.

For each of the 2 variants return:
- outfit: what the given person wears, fitting the original's vibe
- setting: where they are, concrete and visual
- expression: their face in the first frame
- action: what they physically do during the 8 seconds, holding the can
- line: the exact words they say, max 18 words, spoken naturally, mention the brand name once

Make the 2 variants different takes on the same format.
Reply with JSON only: {"variants":[{"outfit":"","setting":"","expression":"","action":"","line":""},{...}]}`;

/** Turn one Oriane video + company brief into two image and video prompts with different people. */
export async function remix(company: string, oriane: string, seed: number): Promise<Variant[]> {
  const people = [PEOPLE[(seed * 2) % PEOPLE.length], PEOPLE[(seed * 2 + 1) % PEOPLE.length]];
  const raw = await chat(SYSTEM, `COMPANY:\n${company}\n\nPEOPLE: 1) ${people[0]} 2) ${people[1]}\n\nORIANE VIDEO:\n${oriane}`);
  const json = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
  const { variants } = ScriptsSchema.parse(JSON.parse(json));

  return variants.map((v, i) => ({
    person: people[i],
    line: v.line,
    imagePrompt:
      `Candid vertical iPhone front-camera selfie photo, raw camera output. ${people[i]}, wearing ${v.outfit}, ${v.setting}. ` +
      `Holding the exact can from the reference image toward the camera, label facing camera and legible. ${v.expression}. ` +
      "Natural available light, real skin texture, slightly imperfect framing, no studio lighting. " +
      "Clean full-bleed photo: no phone screen, no app interface, no status bar, no captions, no text overlays, no watermark.",
    videoPrompt:
      `Handheld iPhone selfie video, vertical. ${v.action} They look into the camera and say: "${v.line}" ` +
      "Natural lip sync, casual real voice, ambient sound only, no music, no subtitles, keep the can label unchanged.",
  }));
}
