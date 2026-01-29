import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/* ----------------- helpers ----------------- */

function requireAdmin(req: NextRequest) {
  const session = req.cookies.get("admin_session")?.value;

  if (session !== "1") {
    return {
      ok: false as const,
      res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { ok: true as const, res: null };
}

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яіїєґ]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}

async function ensureUniqueSlug(excludeId: string, base: string) {
  let slug = base;
  let i = 2;

  while (true) {
    const exists = await prisma.job.findUnique({ where: { slug } });
    if (!exists || exists.id === excludeId) return slug;
    slug = `${base}-${i}`;
    i++;
  }
}

function normalizeEmptyToNull<T>(v: T) {
  return (v as any) === "" ? (null as any) : v;
}

function normalizeJobTerm(term: unknown) {
  if (term === "SHORT") return "SHORT_TERM";
  if (term === "LONG") return "LONG_TERM";
  return term;
}

/* ----------------- GET ----------------- */

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(req);
  if (!auth.ok) return auth.res;

  const { id } = await ctx.params;

  try {
    const job = await prisma.job.findUnique({ where: { id } });

    if (!job) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(job, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load job" }, { status: 500 });
  }
}

/* ----------------- PATCH ----------------- */

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(req);
  if (!auth.ok) return auth.res;

  const { id } = await ctx.params;

  try {
    const body = await req.json().catch(() => ({}));
    const data: Record<string, any> = { ...body };

    for (const k of [
      "companyNameUa",
      "companyNameEn",
      "facilityTypeNoteJp",
      "facilityTypeNoteUa",
      "facilityTypeNoteEn",
      "titleUa",
      "titleEn",
      "locationUa",
      "locationEn",
      "salaryCurrency",
      "shortUa",
      "shortEn",
      "descriptionUa",
      "descriptionEn",
      "slug",
    ]) {
      if (k in data) data[k] = normalizeEmptyToNull(data[k]);
    }

    if ("jobTerm" in data) {
      data.jobTerm = normalizeJobTerm(data.jobTerm);
    }

    if ("slug" in data && data.slug) {
      const base = makeSlug(data.slug);
      data.slug = await ensureUniqueSlug(id, base);
    }

    const updated = await prisma.job.update({
      where: { id },
      data,
    });

    revalidatePath("/admin");
    revalidatePath("/admin/jobs");
    revalidatePath(`/admin/jobs/${id}`);
    revalidatePath("/jobs");
    revalidatePath(`/jobs/${updated.slug}`);

    return NextResponse.json(updated, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}