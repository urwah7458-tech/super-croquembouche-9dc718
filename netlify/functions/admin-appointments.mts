import type { Config } from "@netlify/functions";
import { desc, eq } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { appointments, timeSlots } from "../../db/schema.ts";
import { isAuthorized, unauthorizedResponse } from "./_admin-auth.mts";

// Admin endpoint: list all appointments, newest first, joined with slot info.
export default async (req: Request) => {
  if (!isAuthorized(req)) return unauthorizedResponse();

  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const rows = await db
    .select({
      id: appointments.id,
      customerName: appointments.customerName,
      contact: appointments.contact,
      service: appointments.service,
      notes: appointments.notes,
      createdAt: appointments.createdAt,
      slotDate: timeSlots.date,
      slotTime: timeSlots.time,
    })
    .from(appointments)
    .innerJoin(timeSlots, eq(appointments.slotId, timeSlots.id))
    .orderBy(desc(appointments.createdAt));

  return Response.json({ appointments: rows });
};

export const config: Config = {
  path: "/api/admin/appointments",
  method: "GET",
};
