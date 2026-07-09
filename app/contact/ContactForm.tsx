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
          <input name="name" required type="text" placeholder="Your name" />
        </label>
        <label>
          Email
          <input name="email" required type="email" placeholder="you@example.com" />
        </label>
        <label>
          Company/project
          <input
            name="company_or_project"
            type="text"
            placeholder="Company or project name"
          />
        </label>
        <label>
          Inquiry type
          <select name="inquiry_type" defaultValue="">
            <option value="" disabled>
              Select inquiry type
            </option>
            <option value="Editorial">Editorial</option>
            <option value="Advertising">Advertising</option>
            <option value="Project submission">Project submission</option>
            <option value="Partnership">Partnership</option>
          </select>
        </label>
        <label className="form-wide">
          Message
          <textarea
            name="message"
            required
            placeholder="Tell us what you need help with."
          />
        </label>
      </div>

      <p className="form-note">
        ChainBrief stores this request securely in Supabase for admin review.
      </p>

      <button className="button button-primary" disabled={isPending} type="submit">
        {isPending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
