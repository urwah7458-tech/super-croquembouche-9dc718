import type { Config } from "@netlify/functions";
import { ADMIN_PASSWORD, ADMIN_TOKEN } from "./_admin-auth.mts";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (body.password !== ADMIN_PASSWORD) {
    return Response.json({ error: "Incorrect password" }, { status: 401 });
  }

  return Response.json({ token: ADMIN_TOKEN });
};

export const config: Config = {
  path: "/api/admin/login",
  method: "POST",
};
