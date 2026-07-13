import type { Config } from "@netlify/functions";
import { getDatabase } from "@netlify/database";

interface BookingBody {
  slotId: number;
  customerName: string;
  contact: string;
  service: string;
  notes?: string;
}

// Public endpoint: book an open time slot. Uses a transaction with a
// conditional UPDATE (only succeeds if the slot is still unbooked) so two
// simultaneous requests for the same slot cannot both succeed.
export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body: BookingBody;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { slotId, customerName, contact, service, notes } = body;

  if (!slotId || !customerName?.trim() || !contact?.trim() || !service) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const database = getDatabase();
  const client = await database.pool.connect();

  try {
    await client.query("BEGIN");

    const slotResult = await client.query(
      `UPDATE time_slots SET is_booked = true WHERE id = $1 AND is_booked = false RETURNING *`,
      [slotId],
    );

    if (slotResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return Response.json(
        { error: "This time slot has already been booked. Please choose another." },
        { status: 409 },
      );
    }

    const appointmentResult = await client.query(
      `INSERT INTO appointments (slot_id, customer_name, contact, service, notes)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [slotId, customerName.trim(), contact.trim(), service, notes ?? ""],
    );

    await client.query("COMMIT");

    return Response.json({ appointment: appointmentResult.rows[0] }, { status: 201 });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Booking failed", err);
    return Response.json({ error: "Booking failed. Please try again." }, { status: 500 });
  } finally {
    client.release();
  }
};

export const config: Config = {
  path: "/api/book",
  method: "POST",
};
