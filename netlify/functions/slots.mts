import type { Config } from "@netlify/functions";
import { eq, asc } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { timeSlots } from "../../db/schema.ts";

// Public read-only endpoint: unbooked time slots, optionally filtered by service.
export default async (req: Request) => {
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const service = new URL(req.url).searchParams.get("service");

  const rows = await db
    .select()
    .from(timeSlots)
    .where(eq(timeSlots.isBooked, false))
    .orderBy(asc(timeSlots.date), asc(timeSlots.time));

  const filtered = service ? rows.filter((r) => r.service === service) : rows;

  return Response.json({ slots: filtered });
};

export const config: Config = {
  path: "/api/slots",
  method: "GET",
};
