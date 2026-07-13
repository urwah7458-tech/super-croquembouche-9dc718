import type { Config } from "@netlify/functions";
import { db } from "../../db/index.ts";
import { doctors, pageContent } from "../../db/schema.ts";

// Public read-only endpoint: doctors + skin/dental page copy.
export default async (req: Request) => {
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const [allDoctors, allPageContent] = await Promise.all([
    db.select().from(doctors),
    db.select().from(pageContent),
  ]);

  return Response.json({
    doctors: allDoctors,
    pageContent: allPageContent,
  });
};

export const config: Config = {
  path: "/api/content",
  method: "GET",
};
