import { useEffect, useMemo, useState } from "react";
import { fetchSlots, createBooking, type TimeSlot } from "../lib/api";

type ServiceFilter = "skin" | "dental";

export default function Booking() {
  const [service, setService] = useState<ServiceFilter>("skin");
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const loadSlots = (svc: ServiceFilter) => {
    setLoadingSlots(true);
    setSelectedSlot(null);
    fetchSlots(svc)
      .then((data) => setSlots(data.slots))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  };

  useEffect(() => {
    loadSlots(service);
  }, [service]);

  const grouped = useMemo(() => {
    const map = new Map<string, TimeSlot[]>();
    for (const slot of slots) {
      const list = map.get(slot.date) ?? [];
      list.push(slot);
      map.set(slot.date, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [slots]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setError("Please choose a time slot first.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await createBooking({
        slotId: selectedSlot,
        customerName: name,
        contact,
        service,
        notes,
      });
      setSuccess(true);
      setName("");
      setContact("");
      setNotes("");
      loadSlots(service);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      loadSlots(service);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-clinic-teal/10">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-clinic-teal" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-6 font-display text-3xl text-clinic-ink">You're booked in.</h1>
        <p className="mt-3 font-body text-clinic-ink/70">
          We've reserved your slot. If anything changes, call the clinic directly and we'll adjust it.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-8 rounded-full bg-clinic-teal px-6 py-3 font-body text-sm font-semibold text-white"
        >
          Book another visit
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-display text-4xl text-clinic-ink">Book a visit</h1>
      <p className="mt-3 font-body text-clinic-ink/70">
        Choose a service, pick an open slot, and tell us how to reach you.
      </p>

      <div className="mt-8 flex gap-2">
        {(["skin", "dental"] as ServiceFilter[]).map((svc) => (
          <button
            key={svc}
            onClick={() => setService(svc)}
            className={`rounded-full px-5 py-2 font-body text-sm font-medium capitalize transition-colors ${
              service === svc
                ? "bg-clinic-teal text-white"
                : "bg-white text-clinic-ink/70 ring-1 ring-clinic-ink/10 hover:bg-clinic-mist"
            }`}
          >
            {svc}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 className="font-body text-sm font-semibold uppercase tracking-widest text-clinic-ink/50">
            Available times
          </h2>
          <div className="mt-4 space-y-5">
            {loadingSlots ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-2xl bg-clinic-ink/5" />
              ))
            ) : grouped.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-clinic-ink/15 p-8 text-center font-body text-sm text-clinic-ink/60">
                No open slots for {service} right now. Please check back soon or call the clinic.
              </div>
            ) : (
              grouped.map(([date, daySlots]) => (
                <div key={date}>
                  <p className="font-body text-sm font-medium text-clinic-ink/80">
                    {new Date(date + "T00:00:00").toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {daySlots.map((slot) => (
                      <button
                        type="button"
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot.id)}
                        className={`rounded-xl px-4 py-2 font-body text-sm transition-colors ${
                          selectedSlot === slot.id
                            ? "bg-clinic-coral text-white"
                            : "bg-white text-clinic-ink ring-1 ring-clinic-ink/10 hover:bg-clinic-mist"
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-clinic-ink/5">
          <h2 className="font-body text-sm font-semibold uppercase tracking-widest text-clinic-ink/50">
            Your details
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="font-body text-xs text-clinic-ink/60">Full name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-clinic-ink/15 px-4 py-2.5 font-body text-sm focus:border-clinic-teal focus:outline-none"
                placeholder="Zara Ahmed"
              />
            </div>
            <div>
              <label className="font-body text-xs text-clinic-ink/60">Phone or email</label>
              <input
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="mt-1 w-full rounded-xl border border-clinic-ink/15 px-4 py-2.5 font-body text-sm focus:border-clinic-teal focus:outline-none"
                placeholder="0300 1234567"
              />
            </div>
            <div>
              <label className="font-body text-xs text-clinic-ink/60">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-xl border border-clinic-ink/15 px-4 py-2.5 font-body text-sm focus:border-clinic-teal focus:outline-none"
                placeholder="Anything we should know before your visit?"
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 font-body text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-full bg-clinic-teal px-6 py-3 font-body text-sm font-semibold text-white transition-opacity disabled:opacity-50"
          >
            {submitting ? "Booking…" : "Confirm booking"}
          </button>
        </div>
      </form>
    </div>
  );
}
