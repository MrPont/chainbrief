"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

export type ProjectSubmissionState = {
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

export async function submitProjectSubmission(
  _previousState: ProjectSubmissionState,
  formData: FormData,
): Promise<ProjectSubmissionState> {
  const projectName = getString(formData, "project_name");
  const contactEmail = getString(formData, "contact_email");
  const shortDescription = getString(formData, "short_description");
  const campaignInterests = formData
    .getAll("campaign_interests")
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);

  if (!projectName || !contactEmail || !shortDescription) {
    return {
      status: "error",
      message: "Please add project name, contact email, and a short description.",
    };
  }

  const { error } = await supabaseAdmin.from("project_submissions").insert({
    project_name: projectName,
    website: getNullableString(formData, "website"),
    category: getNullableString(formData, "category"),
    chain: getNullableString(formData, "chain"),
    token_symbol: getNullableString(formData, "token_symbol"),
    contact_email: contactEmail,
    telegram: getNullableString(formData, "telegram"),
    twitter: getNullableString(formData, "twitter"),
    short_description: shortDescription,
    campaign_interests: campaignInterests,
    status: "new",
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return {
      status: "error",
      message: "We could not submit your project. Please try again.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/requests");
  revalidatePath("/admin/requests/projects");

  return {
    status: "success",
    message: "Thanks. Your project submission has been received.",
  };
}
