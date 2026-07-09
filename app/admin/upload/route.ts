import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export const runtime = "nodejs";

const ADMIN_COOKIE = "chainbrief_admin";
const DEFAULT_MAX_SIZE = 3 * 1024 * 1024;

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const folderLimits: Record<string, number> = {
  "articles/featured": 5 * 1024 * 1024,
  banners: 3 * 1024 * 1024,
  "projects/logos": 2 * 1024 * 1024,
  "brand/logos": 1 * 1024 * 1024,
};

const extensionByMimeType: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

function jsonResponse(body: { success: boolean; url?: string; error?: string }, status = 200) {
  return Response.json(body, { status });
}

function formatMegabytes(bytes: number) {
  return `${Math.round((bytes / 1024 / 1024) * 10) / 10} MB`;
}

function sanitizeFolder(folder: string) {
  return folder
    .split("/")
    .map((part) => part.toLowerCase().replace(/[^a-z0-9-]/g, "-"))
    .filter(Boolean)
    .join("/");
}

function sanitizeFileName(fileName: string) {
  const nameWithoutExtension = fileName.replace(/\.[^.]+$/, "");
  const safeName = nameWithoutExtension
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return safeName || "chainbrief-image";
}

function getExtension(file: File) {
  const extensionFromName = file.name.split(".").pop()?.toLowerCase();

  if (extensionFromName && /^[a-z0-9]+$/.test(extensionFromName)) {
    return extensionFromName;
  }

  return extensionByMimeType[file.type] || "img";
}

async function isAdminAuthenticated() {
  const cookieStore = await cookies();

  return cookieStore.get(ADMIN_COOKIE)?.value === "true";
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return jsonResponse({ success: false, error: "Unauthorized." }, 401);
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folderValue = formData.get("folder");
    const folder = typeof folderValue === "string" ? folderValue : "";

    if (!(file instanceof File) || file.size === 0) {
      return jsonResponse(
        { success: false, error: "Please choose an image file to upload." },
        400,
      );
    }

    if (!allowedMimeTypes.has(file.type)) {
      return jsonResponse(
        {
          success: false,
          error: "Unsupported image type. Use JPEG, PNG, WebP, GIF, or SVG.",
        },
        400,
      );
    }

    const safeFolder = sanitizeFolder(folder);
    const maxSize = folderLimits[safeFolder] || DEFAULT_MAX_SIZE;

    if (file.size > maxSize) {
      return jsonResponse(
        {
          success: false,
          error: `File is too large. Max size for this upload is ${formatMegabytes(maxSize)}.`,
        },
        400,
      );
    }

    const bucketName = process.env.SUPABASE_STORAGE_BUCKET || "chainbrief-media";
    const today = new Date().toISOString().slice(0, 10);
    const extension = getExtension(file);
    const safeName = sanitizeFileName(file.name);
    const storageFolder = safeFolder || "uploads";
    const storagePath = `${storageFolder}/${today}/${Date.now()}-${randomUUID().slice(
      0,
      8,
    )}-${safeName}.${extension}`;
    const bytes = await file.arrayBuffer();
    const { error } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(storagePath, bytes, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      return jsonResponse({ success: false, error: error.message }, 500);
    }

    const { data } = supabaseAdmin.storage.from(bucketName).getPublicUrl(storagePath);

    return jsonResponse({ success: true, url: data.publicUrl });
  } catch {
    return jsonResponse({ success: false, error: "Upload failed. Please try again." }, 500);
  }
}
