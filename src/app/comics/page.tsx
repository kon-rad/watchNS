import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ComicsClient from "./ComicsClient";

export const metadata: Metadata = {
  title: "Comic Studio — WatchNS",
  description:
    "Turn your Network School story into a four-panel comic. Describe the scene, speak or type your prompt, and generate a shareable NS comic.",
};

export default function ComicsPage() {
  return (
    <div className="min-h-screen">
      <ComicsClient />
      <Footer />
    </div>
  );
}
