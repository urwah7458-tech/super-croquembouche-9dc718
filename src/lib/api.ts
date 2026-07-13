export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  bio: string;
  photoUrl: string | null;
  service: "skin" | "dental" | string;
  sortOrder: number;
}

export interface PageContentRow {
  id: number;
  pageKey: string;
  title: string;
  description: string;
  servicesJson: string;
  updatedAt: string | null;
}

export interface ServiceItem {
  name: string;
  description: string;
}

export interface TimeSlot {
  id: number;
  date: string;
  time: string;
  service: string;
  isBooked: boolean;
}

export interface AppointmentRow {
  id: number;
  customerName: string;
  contact: string;
  service: string;
  notes: string | null;
  createdAt: string | null;
  slotDate: string;
  slotTime: string;
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export async function fetchContent(): Promise<{ doctors: Doctor[]; pageContent: PageContentRow[] }> {
  const res = await fetch("/api/content");
  return handle(res);
}

export async function fetchSlots(service?: string): Promise<{ slots: TimeSlot[] }> {
  const url = service ? `/api/slots?service=${encodeURIComponent(service)}` : "/api/slots";
  const res = await fetch(url);
  return handle(res);
}

export async function createBooking(payload: {
  slotId: number;
  customerName: string;
  contact: string;
  service: string;
  notes?: string;
}): Promise<{ appointment: unknown }> {
  const res = await fetch("/api/book", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export function getServices(pageContent: PageContentRow[], pageKey: string): ServiceItem[] {
  const row = pageContent.find((p) => p.pageKey === pageKey);
  if (!row) return [];
  try {
    return JSON.parse(row.servicesJson) as ServiceItem[];
  } catch {
    return [];
  }
}

// --- Admin API ---

const TOKEN_KEY = "asc_admin_token";

export function getAdminToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

export async function adminLogin(password: string): Promise<string> {
  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data = await handle<{ token: string }>(res);
  return data.token;
}

function adminHeaders(): HeadersInit {
  const token = getAdminToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { "x-admin-token": token } : {}),
  };
}

export async function fetchAppointments(): Promise<{ appointments: AppointmentRow[] }> {
  const res = await fetch("/api/admin/appointments", { headers: adminHeaders() });
  return handle(res);
}

export async function createSlot(payload: { date: string; time: string; service: string }) {
  const res = await fetch("/api/admin/slots", {
    method: "POST",
    headers: adminHeaders(),
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function updateAdminContent(payload: {
  doctors?: Array<Partial<Doctor> & { id: number }>;
  pageContent?: Array<Partial<PageContentRow> & { pageKey: string }>;
}): Promise<{ doctors: Doctor[]; pageContent: PageContentRow[] }> {
  const res = await fetch("/api/admin/content", {
    method: "PUT",
    headers: adminHeaders(),
    body: JSON.stringify(payload),
  });
  return handle(res);
}
