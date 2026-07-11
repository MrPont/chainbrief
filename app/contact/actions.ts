"use server";

import { revalidatePath } from "next/cache";
import { sendContactNotificationEmail } from "../../lib/contactNotifications";
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
  const companyProject = getNullableString(formData, "company_or_project");
  const inquiryType = getNullableString(formData, "inquiry_type");
  const messengerContact = getNullableString(formData, "messenger_contact");

  if (!name || !email || !message) {
    return {
      status: "error",
      message: "Please add your name, email, and message.",
    };
  }

  const submittedAt = new Date().toISOString();
  const payload = {
    name,
    email,
    company_project: companyProject,
    inquiry_type: inquiryType,
    messenger_contact: messengerContact,
    message,
    status: "new",
    updated_at: submittedAt,
  };
  let { error } = await supabaseAdmin.from("contact_requests").insert(payload);

  if (error && error.message.toLowerCase().includes("messenger_contact")) {
    const legacyPayload = {
      name,
      email,
      company_project: companyProject,
      inquiry_type: inquiryType,
      message,
      status: "new",
      updated_at: submittedAt,
    };
    const retryResult = await supabaseAdmin.from("contact_requests").insert(legacyPayload);

    error = retryResult.error;
  }

  if (error) {
    return {
      status: "error",
      message: "We could not send your request. Please try again.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/requests");
  revalidatePath("/admin/requests/contact");

  try {
    await sendContactNotificationEmail({
      name,
      email,
      companyProject,
      inquiryType,
      messengerContact,
      message,
      submittedAt,
    });
  } catch (emailError) {
    console.error("Failed to send contact notification email:", emailError);
  }

  return {
    status: "success",
    message: "Thanks. Your message has been sent to ChainBrief.",
  };
}
