import { revalidatePath } from "next/cache";
import { runRssImport } from "../../../../lib/rssImport";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonResponse(
  body: {
    success: boolean;
    imported?: number;
    skipped?: number;
    skippedDuplicates?: number;
    skippedInvalid?: number;
    sourceCount?: number;
    errors?: string[];
    error?: string;
  },
  status = 200,
) {
  return Response.json(body, { status });
}

function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length).trim();
}

async function handleImportRequest(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return jsonResponse(
      {
        success: false,
        error: "CRON_SECRET is not configured.",
      },
      500,
    );
  }

  const url = new URL(request.url);
  const token = getBearerToken(request) || url.searchParams.get("secret");

  if (token !== cronSecret) {
    return jsonResponse(
      {
        success: false,
        error: "Unauthorized.",
      },
      401,
    );
  }

  try {
    const result = await runRssImport();

    revalidatePath("/admin");
    revalidatePath("/admin/articles");
    revalidatePath("/admin/import");

    return jsonResponse({
      success: true,
      imported: result.imported,
      skipped: result.skipped,
      skippedDuplicates: result.skippedDuplicates,
      skippedInvalid: result.skippedInvalid,
      sourceCount: result.sourceCount,
      errors: result.errors,
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown import error.",
      },
      500,
    );
  }
}

export async function GET(request: Request) {
  return handleImportRequest(request);
}

export async function POST(request: Request) {
  return handleImportRequest(request);
}
