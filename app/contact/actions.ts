"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function getNullableString(formData: FormData, key: string) {
  const value = getString(formData, key);

  return value.length > 0 ? value : null;
}

export async function submitContactRequest(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = getString(formData, "name");
  const email = getString(formData, "email");
  const message = getString(formData, "message");

  if (!name || !email || !message) {
    return {
      status: "error",
      message: "Please add your name, email, and message.",
    };
  }

  const { error } = await supabaseAdmin.from("contact_requests").insert({
    name,
    email,
    company_project: getNullableString(formData, "company_or_project"),
    inquiry_type: getNullableString(formData, "inquiry_type"),
    message,
    status: "new",
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return {
      status: "error",
      message: "We could not send your request. Please try again.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/requests");
  revalidatePath("/admin/requests/contact");

  return {
    status: "success",
    message: "Thanks. Your message has been sent to ChainBrief.",
  };
}
