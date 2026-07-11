"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  submitProjectSubmission,
  type ProjectSubmissionState,
} from "./actions";

const campaignInterests = [
  "Project listing",
  "Sponsored article",
  "Banner ads",
  "Influencer campaign",
  "AMA",
  "Launch campaign",
];

const initialState: ProjectSubmissionState = {
  status: "idle",
  message: "",
};

export default function SubmitProjectForm() {
  const [state, formAction, isPending] = useActionState(
    submitProjectSubmission,
    initialState,
  );

  return (
    <form action={formAction} className="form-panel">
      {state.status === "success" ? (
        <p className="form-success">{state.message}</p>
      ) : null}
      {state.status === "error" ? <p className="form-error">{state.message}</p> : null}

      <div className="form-grid">
        <label>
          Project name
          <input
            name="project_name"
            required
            type="text"
            placeholder="Example Protocol"
          />
        </label>
        <label>
          Website
          <input name="website" type="url" placeholder="https://example.com" />
        </label>
        <label>
          Category
          <input name="category" type="text" placeholder="Layer 2, DeFi, AI, GameFi..." />
        </label>
        <label>
          Chain
          <input name="chain" type="text" placeholder="Ethereum, Solana, Base..." />
        </label>
        <label>
          Token symbol
          <input name="token_symbol" type="text" placeholder="EXM" />
        </label>
        <label>
          Contact email
          <input
            name="contact_email"
            required
            type="email"
            placeholder="Team contact email"
          />
        </label>
        <label>
          Telegram
          <input name="telegram" type="text" placeholder="@projecthandle" />
        </label>
        <label>
          X/Twitter
          <input name="twitter" type="text" placeholder="@project" />
        </label>
        <label className="form-wide">
          Short description
          <textarea
            name="short_description"
            required
            placeholder="Briefly describe the project, category, traction, and campaign goals."
          />
        </label>
      </div>

      <fieldset className="checkbox-panel">
        <legend>Campaign interest</legend>
        {campaignInterests.map((interest) => (
          <label key={interest}>
            <input name="campaign_interests" type="checkbox" value={interest} />
            {interest}
          </label>
        ))}
      </fieldset>

      <p className="form-note">
        ChainBrief stores project submissions in Supabase for admin review.
      </p>

      <div className="hero-actions">
        <button className="button button-primary" disabled={isPending} type="submit">
          {isPending ? "Submitting..." : "Submit Project"}
        </button>
        <Link className="button button-secondary" href="/marketing">
          Explore Marketing Services
        </Link>
        <Link className="button button-secondary" href="/media-kit">
          View Media Kit
        </Link>
      </div>
    </form>
  );
}
