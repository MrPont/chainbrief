"use server";

import { revalidatePath } from "next/cache";
import OpenAI from "openai";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { requireAdmin } from "../actions";

type AiRewriteResult =
  | {
      ok: true;
      data: {
        title: string;
        slug: string;
        excerpt: string;
        content: string;
        seo_title: string;
        seo_description: string;
        ai_notes: string;
      };
      model: string;
    }
  | {
      ok: false;
      error: string;
    };

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function stripJsonFence(value: string) {
  return value
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function getStringField(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseAiJson(content: string) {
  const parsed = JSON.parse(stripJsonFence(content)) as Record<string, unknown>;
  const title = getStringField(parsed.title);
  const slug = slugify(getStringField(parsed.slug) || title);
  const excerpt = getStringField(parsed.excerpt);
  const articleContent = getStringField(parsed.content);
  const seoTitle = getStringField(parsed.seo_title);
  const seoDescription = getStringField(parsed.seo_description);
  const aiNotes = getStringField(parsed.ai_notes);

  if (!title || !slug || !excerpt || !articleContent) {
    throw new Error("AI response was missing required article fields.");
  }

  return {
    title,
    slug,
    excerpt,
    content: articleContent,
    seo_title: seoTitle || title,
    seo_description: seoDescription || excerpt.slice(0, 155),
    ai_notes: aiNotes || "Generated from imported RSS metadata and excerpt.",
  };
}

function buildRewritePrompt(article: {
  title?: string | null;
  excerpt?: string | null;
  source_name?: string | null;
  source_url?: string | null;
  original_source_url?: string | null;
  category?: string | null;
  published_at?: string | null;
}) {
  const sourceData = {
    title: article.title || "",
    excerpt: article.excerpt || "",
    source_name: article.source_name || "",
    source_url: article.source_url || "",
    original_source_url: article.original_source_url || "",
    category: article.category || "",
    published_at: article.published_at || "",
  };

  return `Write an original ChainBrief article based only on the imported RSS metadata below.

Source metadata:
${JSON.stringify(sourceData, null, 2)}

Style:
- English-language crypto media
- concise, professional, editorial
- similar to Bloomberg / CoinDesk style, but original
- not hype
- not financial advice
- no exaggerated claims

Rules:
- Do not copy the original RSS text verbatim except unavoidable factual names/tickers.
- Do not invent facts not present in the source metadata.
- If details are limited, write a careful market brief.
- Keep source attribution.
- Mention uncertainty when needed.
- Do not include investment advice.
- Do not say "this article is AI-generated".
- Do not include markdown headings unless useful.
- Avoid long em dashes.
- Use clean paragraphs.

Output JSON only:
{
  "title": "...",
  "slug": "...",
  "excerpt": "...",
  "content": "...",
  "seo_title": "...",
  "seo_description": "...",
  "ai_notes": "..."
}

Content length:
- 400 to 700 words for normal article
- 250 to 400 words if source data is thin`;
}

export async function generateArticleAiRewrite(articleId: string): Promise<AiRewriteResult> {
  await requireAdmin();

  if (process.env.AI_REWRITE_ENABLED !== "true") {
    return {
      ok: false,
      error: "AI rewrite is currently disabled. Manual editorial review is active.",
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-5.4-mini";

  if (!apiKey) {
    return {
      ok: false,
      error: "OPENAI_API_KEY is not configured.",
    };
  }

  const { data: article, error } = await supabaseAdmin
    .from("articles")
    .select(
      "id,title,excerpt,source_name,source_url,original_source_url,category,published_at",
    )
    .eq("id", articleId)
    .single();

  if (error || !article) {
    return {
      ok: false,
      error: error?.message || "Article not found.",
    };
  }

  try {
    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an editor for ChainBrief. Return valid JSON only and follow the source constraints exactly.",
        },
        {
          role: "user",
          content: buildRewritePrompt(article),
        },
      ],
    });
    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return {
        ok: false,
        error: "OpenAI returned an empty response.",
      };
    }

    const data = parseAiJson(content);
    const aiNotes = data.ai_notes;
    const { error: updateError } = await supabaseAdmin
      .from("articles")
      .update({
        ai_rewritten_at: new Date().toISOString(),
        ai_model: model,
        ai_status: "generated",
        ai_notes: aiNotes,
        needs_review: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", articleId);

    if (updateError) {
      return {
        ok: false,
        error: updateError.message,
      };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/articles");
    revalidatePath(`/admin/articles/${articleId}`);

    return {
      ok: true,
      data,
      model,
    };
  } catch (rewriteError) {
    return {
      ok: false,
      error:
        rewriteError instanceof Error &&
        /billing|quota|insufficient_quota|payment|credits/i.test(rewriteError.message)
          ? "OpenAI API quota is unavailable. Please check billing or continue with manual editing."
          : rewriteError instanceof Error
            ? rewriteError.message
            : "AI rewrite failed.",
    };
  }
}
