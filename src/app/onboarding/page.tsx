import type { Metadata } from "next";
import Onboarding from "@/components/onboarding/Onboarding";

export const metadata: Metadata = {
  title: "Onboarding · HackTheFeed",
  description: "Set up your company, products, niche, competitors and edge, then pick the viral videos to learn from.",
};

export default function OnboardingPage() {
  return <Onboarding />;
}
