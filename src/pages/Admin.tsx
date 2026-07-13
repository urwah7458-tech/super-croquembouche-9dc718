import { useEffect, useState } from "react";
import {
  adminLogin,
  clearAdminToken,
  createSlot,
  fetchAppointments,
  getAdminToken,
  setAdminToken,
  updateAdminContent,
  type AppointmentRow,
  type Doctor,
  type PageContentRow,
} from "../lib/api";
import { fetchContent, getServices, type ServiceItem } from "../lib/api";

export default function Admin() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(!!getAdminToken());
  }, []);

  if (!authed) {
    return <PasswordGate onSuccess={() => setAuthed(true)} />;
  }

  return <AdminPanel onLogout={() => setAuthed(false)} />;
}

function PasswordGate({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const token = await adminLogin(password);
      setAdminToken(token);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-clinic-ink px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl bg-clinic-sand p-8 shadow-soft"
      >
        <p className="font-body text-xs uppercase tracking-widest text-clinic-teal">Staff only</p>
        <h1 className="mt-2 font-display text-2xl text-clinic-ink">Admin sign in</h1>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mt-6 w-full rounded-xl border border-clinic-ink/15 px-4 py-2.5 font-body text-sm focus:border-clinic-teal focus:outline-none"
        />
        {error && <p className="mt-3 font-body text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="mt-5 w-full rounded-full bg-clinic-teal px-6 py-3 font-body text-sm font-semibold text-white disabled:opacity-50"
        >
          {submitting ? "Checking…" : "Enter"}
        </button>
      </form>
    </div>
  );
}

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<"appointments" | "slots" | "content">("appointments");

  return (
    <div className="min-h-screen bg-clinic-mist">
      <header className="flex items-center justify-between border-b border-clinic-ink/10 bg-white px-6 py-4">
        <p className="font-display text-xl text-clinic-ink">Clinic Admin</p>
        <button
          onClick={() => {
            clearAdminToken();
            onLogout();
          }}
          className="font-body text-sm text-clinic-ink/60 hover:text-clinic-ink"
        >
          Sign out
        </button>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex gap-2">
          {(
            [
              ["appointments", "Appointments"],
              ["slots", "Publish Slots"],
              ["content", "Site Content"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`rounded-full px-5 py-2 font-body text-sm font-medium transition-colors ${
                tab === key
                  ? "bg-clinic-teal text-white"
                  : "bg-white text-clinic-ink/70 ring-1 ring-clinic-ink/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "appointments" && <AppointmentsTab />}
          {tab === "slots" && <SlotsTab />}
          {tab === "content" && <ContentTab />}
        </div>
      </div>
    </div>
  );
}

function AppointmentsTab() {
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    fetchAppointments()
      .then((data) => setAppointments(data.appointments))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-clinic-ink/5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-clinic-ink">Appointments</h2>
        <button onClick={load} className="font-body text-xs text-clinic-teal hover:underline">
          Refresh
        </button>
      </div>
      {error && <p className="mt-3 font-body text-sm text-red-600">{error}</p>}
      {loading ? (
        <p className="mt-4 font-body text-sm text-clinic-ink/60">Loading…</p>
      ) : appointments.length === 0 ? (
        <p className="mt-4 font-body text-sm text-clinic-ink/60">No appointments yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left font-body text-sm">
            <thead>
              <tr className="border-b border-clinic-ink/10 text-clinic-ink/50">
                <th className="py-2 pr-4">Customer</th>
                <th className="py-2 pr-4">Contact</th>
                <th className="py-2 pr-4">Service</th>
                <th className="py-2 pr-4">Date &amp; time</th>
                <th className="py-2 pr-4">Booked</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="border-b border-clinic-ink/5">
                  <td className="py-3 pr-4 font-medium text-clinic-ink">{a.customerName}</td>
                  <td className="py-3 pr-4 text-clinic-ink/70">{a.contact}</td>
                  <td className="py-3 pr-4 capitalize text-clinic-ink/70">{a.service}</td>
                  <td className="py-3 pr-4 text-clinic-ink/70">
                    {a.slotDate} · {a.slotTime}
                  </td>
                  <td className="py-3 pr-4 text-clinic-ink/50">
                    {a.createdAt ? new Date(a.createdAt).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SlotsTab() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [service, setService] = useState<"skin" | "dental">("skin");
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      await createSlot({ date, time, service });
      setStatus("Slot published.");
      setDate("");
      setTime("");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed to publish slot");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md rounded-3xl bg-white p-6 shadow-soft ring-1 ring-clinic-ink/5">
      <h2 className="font-display text-xl text-clinic-ink">Publish a time slot</h2>
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label className="font-body text-xs text-clinic-ink/60">Date</label>
          <input
            required
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-xl border border-clinic-ink/15 px-4 py-2.5 font-body text-sm focus:border-clinic-teal focus:outline-none"
          />
        </div>
        <div>
          <label className="font-body text-xs text-clinic-ink/60">Time</label>
          <input
            required
            type="text"
            placeholder="10:30 AM"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 w-full rounded-xl border border-clinic-ink/15 px-4 py-2.5 font-body text-sm focus:border-clinic-teal focus:outline-none"
          />
        </div>
        <div>
          <label className="font-body text-xs text-clinic-ink/60">Service</label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value as "skin" | "dental")}
            className="mt-1 w-full rounded-xl border border-clinic-ink/15 px-4 py-2.5 font-body text-sm focus:border-clinic-teal focus:outline-none"
          >
            <option value="skin">Skin</option>
            <option value="dental">Dental</option>
          </select>
        </div>
        {status && <p className="font-body text-sm text-clinic-ink/70">{status}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-clinic-teal px-6 py-3 font-body text-sm font-semibold text-white disabled:opacity-50"
        >
          {submitting ? "Publishing…" : "Publish slot"}
        </button>
      </form>
    </div>
  );
}

function ContentTab() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [pageContent, setPageContent] = useState<PageContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchContent()
      .then((data) => {
        setDoctors(data.doctors);
        setPageContent(data.pageContent);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateDoctorField = (id: number, field: keyof Doctor, value: string) => {
    setDoctors((prev) => prev.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  };

  const saveDoctor = async (doctor: Doctor) => {
    setStatus(null);
    try {
      await updateAdminContent({
        doctors: [
          {
            id: doctor.id,
            name: doctor.name,
            specialty: doctor.specialty,
            bio: doctor.bio,
            photoUrl: doctor.photoUrl ?? "",
          },
        ],
      });
      setStatus(`Saved ${doctor.name}.`);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed to save");
    }
  };

  const updatePageField = (pageKey: string, field: "title" | "description", value: string) => {
    setPageContent((prev) =>
      prev.map((p) => (p.pageKey === pageKey ? { ...p, [field]: value } : p)),
    );
  };

  const updateServiceField = (
    pageKey: string,
    index: number,
    field: keyof ServiceItem,
    value: string,
  ) => {
    setPageContent((prev) =>
      prev.map((p) => {
        if (p.pageKey !== pageKey) return p;
        const services = getServices([p], pageKey);
        services[index] = { ...services[index], [field]: value };
        return { ...p, servicesJson: JSON.stringify(services) };
      }),
    );
  };

  const savePage = async (page: PageContentRow) => {
    setStatus(null);
    try {
      await updateAdminContent({
        pageContent: [
          {
            pageKey: page.pageKey,
            title: page.title,
            description: page.description,
            servicesJson: page.servicesJson,
          },
        ],
      });
      setStatus(`Saved ${page.pageKey} page.`);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed to save");
    }
  };

  if (loading) {
    return <p className="font-body text-sm text-clinic-ink/60">Loading content…</p>;
  }

  return (
    <div className="space-y-10">
      {status && (
        <p className="rounded-xl bg-clinic-teal/10 px-4 py-2 font-body text-sm text-clinic-teal">
          {status}
        </p>
      )}

      <div>
        <h2 className="font-display text-xl text-clinic-ink">Doctors &amp; team</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {doctors.map((doc) => (
            <div key={doc.id} className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-clinic-ink/5">
              <input
                value={doc.name}
                onChange={(e) => updateDoctorField(doc.id, "name", e.target.value)}
                className="w-full rounded-lg border border-clinic-ink/15 px-3 py-2 font-body text-sm font-medium"
              />
              <input
                value={doc.specialty}
                onChange={(e) => updateDoctorField(doc.id, "specialty", e.target.value)}
                className="mt-2 w-full rounded-lg border border-clinic-ink/15 px-3 py-2 font-body text-sm"
              />
              <textarea
                value={doc.bio}
                onChange={(e) => updateDoctorField(doc.id, "bio", e.target.value)}
                rows={3}
                className="mt-2 w-full rounded-lg border border-clinic-ink/15 px-3 py-2 font-body text-sm"
              />
              <input
                value={doc.photoUrl ?? ""}
                onChange={(e) => updateDoctorField(doc.id, "photoUrl", e.target.value)}
                placeholder="Photo URL (optional)"
                className="mt-2 w-full rounded-lg border border-clinic-ink/15 px-3 py-2 font-body text-sm"
              />
              <button
                onClick={() => saveDoctor(doc)}
                className="mt-3 rounded-full bg-clinic-teal px-4 py-1.5 font-body text-xs font-semibold text-white"
              >
                Save
              </button>
            </div>
          ))}
        </div>
      </div>

      {pageContent.map((page) => (
        <div key={page.pageKey}>
          <h2 className="font-display text-xl capitalize text-clinic-ink">{page.pageKey} page</h2>
          <div className="mt-4 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-clinic-ink/5">
            <label className="font-body text-xs text-clinic-ink/60">Title</label>
            <input
              value={page.title}
              onChange={(e) => updatePageField(page.pageKey, "title", e.target.value)}
              className="mt-1 w-full rounded-lg border border-clinic-ink/15 px-3 py-2 font-body text-sm"
            />
            <label className="mt-3 block font-body text-xs text-clinic-ink/60">Description</label>
            <textarea
              value={page.description}
              onChange={(e) => updatePageField(page.pageKey, "description", e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-clinic-ink/15 px-3 py-2 font-body text-sm"
            />

            <label className="mt-4 block font-body text-xs text-clinic-ink/60">Services</label>
            <div className="mt-2 space-y-3">
              {getServices([page], page.pageKey).map((service, i) => (
                <div key={i} className="rounded-lg border border-clinic-ink/10 p-3">
                  <input
                    value={service.name}
                    onChange={(e) => updateServiceField(page.pageKey, i, "name", e.target.value)}
                    className="w-full rounded-md border border-clinic-ink/15 px-2 py-1.5 font-body text-sm font-medium"
                  />
                  <textarea
                    value={service.description}
                    onChange={(e) =>
                      updateServiceField(page.pageKey, i, "description", e.target.value)
                    }
                    rows={2}
                    className="mt-1.5 w-full rounded-md border border-clinic-ink/15 px-2 py-1.5 font-body text-sm"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => savePage(page)}
              className="mt-4 rounded-full bg-clinic-teal px-4 py-1.5 font-body text-xs font-semibold text-white"
            >
              Save {page.pageKey} page
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
