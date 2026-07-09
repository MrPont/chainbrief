import type { Metadata } from "next";
import SubmitProjectForm from "./SubmitProjectForm";

export const metadata: Metadata = {
  title: "Submit Project",
  description:
    "Submit a crypto project for future ChainBrief directory, ranking, sponsored content, banner, influencer, AMA or launch campaign consideration.",
  alternates: {
    canonical: "/submit-project",
  },
  openGraph: {
    title: "Submit a Crypto Project | ChainBrief",
    description:
      "Share your crypto project with ChainBrief for future directory, ranking, media and campaign consideration.",
    images: ["/chainbrief-market-intelligence.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Submit a Crypto Project | ChainBrief",
    description:
      "Static project submission page for ChainBrief directory and marketing consideration.",
    images: ["/chainbrief-market-intelligence.png"],
  },
};

export default function SubmitProjectPage() {
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Project submissions</p>
        <h1>Submit Your Crypto Project</h1>
        <p>
          Share your project for future ChainBrief directory coverage, ranking
          research, sponsored visibility, or marketing campaign planning.
        </p>
      </section>

      <SubmitProjectForm />
    </>
  );
}
