import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  normalizeUrl,
  rowToTool,
  seedHasSlug,
  seedHasUrl,
  slugify,
  type SubmissionRow,
} from "./catalog";
import { submitSchema } from "./submit-schema";
import type { Tool } from "./types";

const reviewSchema = z.object({
  id: z.string().min(1).max(80),
  action: z.enum(["approve", "reject"]),
  key: z.string().min(1).max(80),
});

const REVIEW_KEY = "valdir-review";
const MAX_PENDING = 60;

async function sqlClient() {
  const { getSql } = await import("@/lib/db");
  return getSql();
}

function asRows(rows: SubmissionRow[]): Tool[] {
  return rows.map(rowToTool);
}

export const listApprovedSubmissions = createServerFn({ method: "GET" }).handler(
  async (): Promise<Tool[]> => {
    try {
      const sql = await sqlClient();
      const rows = await sql<SubmissionRow>`
        select id, slug, name, website_url, category, short_description,
               description, platforms, pricing, review_status, created_at
        from submissions
        where review_status = 'approved'
        order by created_at desc
      `;
      return asRows(rows);
    } catch (err) {
      console.error("[valdir] listApprovedSubmissions", err);
      return [];
    }
  },
);

export const listPendingSubmissions = createServerFn({ method: "POST" })
  .validator(z.object({ key: z.string().min(1).max(80) }))
  .handler(
    async ({
      data,
    }): Promise<
      { ok: true; tools: Tool[] } | { ok: false; error: string }
    > => {
      if (data.key !== REVIEW_KEY) {
        return { ok: false, error: "Wrong review key." };
      }
      try {
        const sql = await sqlClient();
        const rows = await sql<SubmissionRow>`
          select id, slug, name, website_url, category, short_description,
                 description, platforms, pricing, review_status, created_at
          from submissions
          where review_status = 'pending'
          order by created_at desc
        `;
        return { ok: true, tools: asRows(rows) };
      } catch (err) {
        console.error("[valdir] listPendingSubmissions", err);
        return { ok: false, error: "Could not load the queue." };
      }
    },
  );

export const getSubmissionBySlug = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string().min(1).max(80) }))
  .handler(async ({ data }): Promise<Tool | null> => {
    try {
      const sql = await sqlClient();
      const rows = await sql<SubmissionRow>`
        select id, slug, name, website_url, category, short_description,
               description, platforms, pricing, review_status, created_at
        from submissions
        where slug = ${data.slug} and review_status <> 'rejected'
        limit 1
      `;
      return rows[0] ? rowToTool(rows[0]) : null;
    } catch (err) {
      console.error("[valdir] getSubmissionBySlug", err);
      return null;
    }
  });

export const submitTool = createServerFn({ method: "POST" })
  .validator((d: unknown) => d)
  .handler(
    async ({
      data,
    }): Promise<{ ok: true; slug: string } | { ok: false; error: string }> => {
      const parsed = submitSchema.safeParse(data);
      if (!parsed.success) {
        return {
          ok: false,
          error:
            parsed.error.issues[0]?.message ?? "Check the form and try again.",
        };
      }
      const payload = parsed.data;

      let websiteUrl: string;
      try {
        websiteUrl = normalizeUrl(payload.websiteUrl);
      } catch {
        return { ok: false, error: "Enter a valid http(s) URL." };
      }

      if (seedHasUrl(websiteUrl)) {
        return {
          ok: false,
          error: "That site is already in the curated directory.",
        };
      }

      try {
        const sql = await sqlClient();

        const pendingCount = await sql<{ n: number }>`
          select count(*)::int as n from submissions where review_status = 'pending'
        `;
        if ((pendingCount[0]?.n ?? 0) >= MAX_PENDING) {
          return {
            ok: false,
            error: "The review queue is full. Try again later.",
          };
        }

        const existing = await sql<{ id: string; review_status: string }>`
          select id, review_status from submissions
          where lower(website_url) = ${websiteUrl.toLowerCase()}
          limit 1
        `;
        if (existing[0]) {
          if (existing[0].review_status === "rejected") {
            return {
              ok: false,
              error: "That site was already reviewed and not listed.",
            };
          }
          return {
            ok: false,
            error: "That URL is already in the queue or directory.",
          };
        }

        const id = crypto.randomUUID();
        let slug = slugify(payload.name);
        if (seedHasSlug(slug)) slug = `${slug}-${id.slice(0, 8)}`;
        const slugHit = await sql<{ id: string }>`
          select id from submissions where slug = ${slug} limit 1
        `;
        if (slugHit[0]) slug = `${slug}-${id.slice(0, 8)}`;

        await sql`
          insert into submissions (
            id, slug, name, website_url, category, short_description,
            description, platforms, pricing, review_status
          ) values (
            ${id},
            ${slug},
            ${payload.name},
            ${websiteUrl},
            ${payload.category},
            ${payload.shortDescription},
            ${payload.shortDescription},
            ${JSON.stringify(payload.platforms)},
            ${payload.pricing},
            ${"pending"}
          )
        `;

        return { ok: true, slug };
      } catch (err) {
        console.error("[valdir] submitTool", err);
        return {
          ok: false,
          error: "Could not save the listing. Try again in a moment.",
        };
      }
    },
  );

export const reviewSubmission = createServerFn({ method: "POST" })
  .validator(reviewSchema)
  .handler(
    async ({
      data,
    }): Promise<{ ok: true } | { ok: false; error: string }> => {
      if (data.key !== REVIEW_KEY) {
        return { ok: false, error: "Wrong review key." };
      }
      const next = data.action === "approve" ? "approved" : "rejected";
      const sql = await sqlClient();
      const updated = await sql<{ id: string }>`
        update submissions
        set review_status = ${next}, reviewed_at = now()
        where id = ${data.id}
          and review_status in ('pending', 'approved')
        returning id
      `;
      if (!updated[0]) {
        return { ok: false, error: "That listing cannot be updated." };
      }
      return { ok: true };
    },
  );
