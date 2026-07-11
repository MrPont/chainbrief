"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
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

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const contactRateLimit = new Map<string, RateLimitEntry>();
const rateLimitWindowMs = 10 * 60 * 1000;
const maxSubmissionsPerWindow = 4;
const genericSuccessMessage = "Thanks. Your message has been sent to ChainBrief.";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isOnlyNumbers(value: string) {
  return /^\d+$/.test(value.replace(/\s+/g, ""));
}

function isOneShortWord(value: string) {
  const words = value.trim().split(/\s+/).filter(Boolean);

  return words.length === 1 && words[0].length < 20;
}

function normalizeProjectWebsite(value: string) {
  const website = value.trim();

  if (!website || /\s/.test(website)) {
    return null;
  }

  const withProtocol = /^https?:\/\//i.test(website) ? website : `https://${website}`;

  try {
    const url = new URL(withProtocol);
    const hostname = url.hostname.toLowerCase();

    if (
      !["http:", "https:"].includes(url.protocol) ||
      !hostname.includes(".") ||
      hostname.startsWith(".") ||
      hostname.endsWith(".")
    ) {
      return null;
    }

    const parts = hostname.split(".");
    const tld = parts[parts.length - 1];

    if (!tld || tld.length < 2) {
      return null;
    }

    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

function isGenericMessengerContact(value: string | null) {
  if (!value) {
    return false;
  }

  return ["people", "person", "test", "testing", "none", "no", "n/a", "na"].includes(
    value.toLowerCase(),
  );
}

async function getClientFingerprint() {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = headerList.get("x-real-ip")?.trim();
  const vercelIp = headerList.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  const userAgent = headerList.get("user-agent")?.slice(0, 80) || "unknown-agent";

  return `${forwardedFor || realIp || vercelIp || "unknown-ip"}:${userAgent}`;
}

async function isRateLimited() {
  const fingerprint = await getClientFingerprint();
  const now = Date.now();
  const currentEntry = contactRateLimit.get(fingerprint);

  if (!currentEntry || currentEntry.resetAt <= now) {
    contactRateLimit.set(fingerprint, {
      count: 1,
      resetAt: now + rateLimitWindowMs,
    });
    return false;
  }

  if (currentEntry.count >= maxSubmissionsPerWindow) {
    return true;
  }

  contactRateLimit.set(fingerprint, {
    ...currentEntry,
    count: currentEntry.count + 1,
  });

  return false;
}

export async function submitContactRequest(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  if (getString(formData, "website_url_confirm")) {
    return {
      status: "success",
      message: genericSuccessMessage,
    };
  }

  const name = getString(formData, "name");
  const email = getString(formData, "email");
  const message = getString(formData, "message");
  const companyProject = getNullableString(formData, "company_or_project");
  const inquiryType = getNullableString(formData, "inquiry_type");
  const messengerContact = getNullableString(formData, "messenger_contact");
  const projectWebsiteInput = getString(formData, "project_website");
  const projectWebsite = projectWebsiteInput
    ? normalizeProjectWebsite(projectWebsiteInput)
    : null;

  if (await isRateLimited()) {
    return {
      status: "error",
      message: "Too many recent submissions. Please wait a few minutes and try again.",
    };
  }

  if (name.length < 2) {
    return {
      status: "error",
      message: "Please enter your name.",
    };
  }

  if (!isValidEmail(email)) {
    return {
      status: "error",
      message: "Please enter a valid email address.",
    };
  }

  if (!companyProject || companyProject.length < 2) {
    return {
      status: "error",
      message: "Please enter your company or project name.",
    };
  }

  if (isValidEmail(companyProject)) {
    return {
      status: "error",
      message: "Please enter a company or project name, not an email address.",
    };
  }

  if (projectWebsiteInput && !projectWebsite) {
    return {
      status: "error",
      message:
        "Please enter a valid project website, such as project.com, or leave it blank.",
    };
  }

  if (!inquiryType) {
    return {
      status: "error",
      message: "Please select an inquiry type.",
    };
  }

  if (message.length < 30) {
    return {
      status: "error",
      message: "Please add a message with at least 30 characters.",
    };
  }

  if (isOnlyNumbers(message) || isOneShortWord(message)) {
    return {
      status: "error",
      message: "Please add a real message describing your campaign or request.",
    };
  }

  if (isGenericMessengerContact(messengerContact)) {
    return {
      status: "error",
      message: "Please add a real Telegram or WhatsApp contact, or leave it blank.",
    };
  }

  const submittedAt = new Date().toISOString();
  const payload: Record<string, string | null> = {
    name,
    email,
    company_project: companyProject,
    project_website: projectWebsite,
    inquiry_type: inquiryType,
    messenger_contact: messengerContact,
    message,
    status: "new",
    updated_at: submittedAt,
  };
  let { error } = await supabaseAdmin.from("contact_requests").insert(payload);

  for (let attempt = 0; error && attempt < 2; attempt += 1) {
    const messageLower = error.message.toLowerCase();

    if (messageLower.includes("project_website")) {
      delete payload.project_website;
    } else if (messageLower.includes("messenger_contact")) {
      delete payload.messenger_contact;
    } else {
      break;
    }

    const retryResult = await supabaseAdmin.from("contact_requests").insert(payload);
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
      projectWebsite,
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
    message: genericSuccessMessage,
  };
}
