import "server-only";

import nodemailer from "nodemailer";

type ContactNotification = {
  name: string;
  email: string;
  companyProject: string | null;
  projectWebsite: string | null;
  inquiryType: string | null;
  messengerContact: string | null;
  message: string;
  submittedAt: string;
};

function getSmtpPort() {
  const port = Number(process.env.SMTP_PORT || 587);

  return Number.isFinite(port) ? port : 587;
}

function getSmtpSecure() {
  const configuredValue = process.env.SMTP_SECURE?.toLowerCase();

  if (configuredValue === "true") {
    return true;
  }

  if (configuredValue === "false") {
    return false;
  }

  return getSmtpPort() === 465;
}

function hasSmtpConfig() {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS,
  );
}

function formatValue(value: string | null) {
  return value?.trim() || "Not provided";
}

export async function sendContactNotificationEmail(
  notification: ContactNotification,
) {
  if (!hasSmtpConfig()) {
    console.warn("Contact notification email skipped: SMTP is not configured.");
    return;
  }

  const notificationEmail =
    process.env.CONTACT_NOTIFICATION_EMAIL || "media@chainbrief.net";
  const fromEmail = process.env.CONTACT_FROM_EMAIL || notificationEmail;
  const inquiryType = formatValue(notification.inquiryType);
  const companyProject = formatValue(notification.companyProject);
  const projectWebsite = formatValue(notification.projectWebsite);
  const messengerContact = formatValue(notification.messengerContact);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: getSmtpPort(),
    secure: getSmtpSecure(),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: fromEmail,
    to: notificationEmail,
    replyTo: notification.email,
    subject: `New ChainBrief inquiry: ${inquiryType} - ${companyProject}`,
    text: [
      "New ChainBrief contact request",
      "",
      `Name: ${notification.name}`,
      `Email: ${notification.email}`,
      `Company/project: ${companyProject}`,
      `Project website: ${projectWebsite}`,
      `Inquiry type: ${inquiryType}`,
      `Telegram / WhatsApp: ${messengerContact}`,
      `Submitted: ${notification.submittedAt}`,
      "",
      "Message:",
      notification.message,
      "",
      "Admin note: this request was also saved in Supabase for review.",
    ].join("\n"),
  });
}
