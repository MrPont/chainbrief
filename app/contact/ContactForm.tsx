"use client";

import { useActionState } from "react";
import { submitContactRequest, type ContactFormState } from "./actions";

const initialState: ContactFormState = {
  status: "idle",
  message: "",
};

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactRequest,
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
          Name
          <input name="name" minLength={2} required type="text" placeholder="Your name" />
        </label>
        <label>
          Email
          <input name="email" required type="email" placeholder="Your email address" />
        </label>
        <label>
          Company/project
          <input
            name="company_or_project"
            minLength={2}
            required
            type="text"
            placeholder="Company or project name"
          />
        </label>
        <label>
          Project website (optional)
          <input
            autoCapitalize="none"
            autoComplete="url"
            inputMode="url"
            name="project_website"
            type="text"
            placeholder="https://project.com or project.com"
          />
        </label>
        <label>
          Inquiry type
          <select name="inquiry_type" defaultValue="" required>
            <option value="" disabled>
              Select inquiry type
            </option>
            <option value="Editorial">Editorial</option>
            <option value="Advertising">Advertising</option>
            <option value="Media kit">Media kit</option>
            <option value="Pricing request">Pricing request</option>
            <option value="Campaign plan">Campaign plan</option>
            <option value="Project submission">Project submission</option>
            <option value="Partnership">Partnership</option>
          </select>
        </label>
        <label>
          Telegram / WhatsApp
          <input
            name="messenger_contact"
            type="text"
            placeholder="@username, t.me/username, or WhatsApp number"
          />
        </label>
        <label className="form-wide">
          Message
          <textarea
            name="message"
            minLength={30}
            required
            placeholder="Tell us your requested item, campaign type, project, timeline, budget range if useful, and goals."
          />
        </label>
      </div>

      <label
        aria-hidden="true"
        style={{ display: "none" }}
      >
        Website URL confirm
        <input
          autoComplete="off"
          name="website_url_confirm"
          tabIndex={-1}
          type="text"
        />
      </label>

      <p className="form-note">
        ChainBrief stores this request securely in Supabase for admin review.
      </p>

      <button className="button button-primary" disabled={isPending} type="submit">
        {isPending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
