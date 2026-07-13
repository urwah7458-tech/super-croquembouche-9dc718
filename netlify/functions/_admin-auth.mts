// Shared helpers for admin authentication across admin-only functions.
//
// This is a small clinic app, not a bank: we use a single shared password
// that lives only in server-side function code (never shipped to the
// client bundle). admin-login.mts checks the submitted password against
// ADMIN_PASSWORD and, on success, returns ADMIN_TOKEN. The browser stores
// that token in sessionStorage and sends it back as `x-admin-token` on every
// subsequent admin request. Each admin function re-validates the header
// against the same constant before doing anything privileged.
export const ADMIN_PASSWORD = "urwah67";

// A fixed session token derived from the password. Because it never changes,
// this is equivalent in strength to just checking the password on every
// request, while letting the browser avoid re-sending the raw password.
export const ADMIN_TOKEN = "asc-clinic-admin-9f3b7d2c1a";

export function isAuthorized(req: Request): boolean {
  const token = req.headers.get("x-admin-token");
  return token === ADMIN_TOKEN;
}

export function unauthorizedResponse(): Response {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
