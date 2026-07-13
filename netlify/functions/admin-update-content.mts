import type { Config } from "@netlify/functions";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { doctors, pageContent } from "../../db/schema.ts";
import { isAuthorized, unauthorizedResponse } from "./_admin-auth.mts";

interface UpdateBody {
  doctors?: Array<{
    id: number;
    name?: string;
    specialty?: string;
    bio?: string;
    photoUrl?: string;
  }>;
  pageContent?: Array<{
    pageKey: string;
    title?: string;
    description?: string;
    servicesJson?: string;
  }>;
}

// Admin endpoint: update doctor profiles and/or skin/dental page copy.
export default async (req: Request) => {
  if (!isAuthorized(req)) return unauthorizedResponse();

  if (req.method !== "PUT") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body: UpdateBody;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (body.doctors) {
    for (const doc of body.doctors) {
      if (!doc.id) continue;
      await db
        .update(doctors)
        .set({
          ...(doc.name !== undefined ? { name: doc.name } : {}),
          ...(doc.specialty !== undefined ? { specialty: doc.specialty } : {}),
          ...(doc.bio !== undefined ? { bio: doc.bio } : {}),
          ...(doc.photoUrl !== undefined ? { photoUrl: doc.photoUrl } : {}),
        })
        .where(eq(doctors.id, doc.id));
    }
  }

  if (body.pageContent) {
    for (const pc of body.pageContent) {
      if (!pc.pageKey) continue;
      await db
        .update(pageContent)
        .set({
          ...(pc.title !== undefined ? { title: pc.title } : {}),
          ...(pc.description !== undefined ? { description: pc.description } : {}),
          ...(pc.servicesJson !== undefined ? { servicesJson: pc.servicesJson } : {}),
          updatedAt: new Date(),
        })
        .where(eq(pageContent.pageKey, pc.pageKey));
    }
  }

  const [allDoctors, allPageContent] = await Promise.all([
    db.select().from(doctors),
    db.select().from(pageContent),
  ]);

  return Response.json({ doctors: allDoctors, pageContent: allPageContent });
};

export const config: Config = {
  path: "/api/admin/content",
  method: "PUT",
};
