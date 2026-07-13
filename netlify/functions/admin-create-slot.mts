import type { Config } from "@netlify/functions";
import { db } from "../../db/index.ts";
import { timeSlots } from "../../db/schema.ts";
import { isAuthorized, unauthorizedResponse } from "./_admin-auth.mts";

interface NewSlotBody {
  date: string;
  time: string;
  service: string;
}

// Admin endpoint: publish a new bookable time slot.
export default async (req: Request) => {
  if (!isAuthorized(req)) return unauthorizedResponse();

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body: NewSlotBody;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { date, time, service } = body;

  if (!date || !time || !["skin", "dental"].includes(service)) {
    return Response.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  const [slot] = await db
    .insert(timeSlots)
    .values({ date, time, service, isBooked: false })
    .returning();

  return Response.json({ slot }, { status: 201 });
};

export const config: Config = {
  path: "/api/admin/slots",
  method: "POST",
};
