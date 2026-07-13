import { Link } from "react-router-dom";
import { useClinicContent } from "../lib/useClinicContent";
import { getServices } from "../lib/api";
import DoctorCard from "../components/DoctorCard";

export default function Home() {
  const { doctors, pageContent, loading } = useClinicContent();

  const skinServices = getServices(pageContent, "skin").slice(0, 3);
  const dentalServices = getServices(pageContent, "dental").slice(0, 3);
  const homeContent = pageContent.find((p) => p.pageKey === "home");
  const established = homeContent?.title || "Est. 2014";
  const location = homeContent?.description || "Karachi";

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-clinic-sand">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-clinic-teal/10 blur-3xl" />
        <div className="absolute -left-16 top-40 h-72 w-72 rounded-full bg-clinic-coral/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] md:py-28">
          <div className="flex flex-col justify-center">
            <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-clinic-teal/10 px-4 py-1.5 font-body text-xs font-medium uppercase tracking-widest text-clinic-teal">
              Skin &amp; Dental, one address
            </span>
            <h1 className="font-display text-5xl font-medium leading-[1.05] text-clinic-ink md:text-6xl">
              Two specialties.
              <br />
              <span className="italic text-clinic-teal">One unhurried</span> clinic.
            </h1>
            <p className="mt-6 max-w-md font-body text-lg leading-relaxed text-clinic-ink/70">
              Asma and Safi Skin and Dental Clinic pairs dermatology and dentistry under a single roof,
              so you're not juggling two waiting rooms for the care your face and smile actually need.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/booking"
                className="rounded-full bg-clinic-teal px-7 py-3 font-body text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-clinic-tealdark"
              >
                Book a visit
              </Link>
              <Link
                to="/skin"
                className="rounded-full border border-clinic-ink/15 bg-white px-7 py-3 font-body text-sm font-semibold text-clinic-ink transition-colors hover:border-clinic-ink/30"
              >
                Explore services
              </Link>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="relative aspect-square w-full max-w-sm rounded-[2.5rem] bg-gradient-to-br from-clinic-teal via-clinic-tealdark to-clinic-ink p-1 shadow-soft">
              <div className="flex h-full w-full flex-col justify-between rounded-[2.2rem] bg-clinic-ink/95 p-8">
                <div className="flex justify-between font-body text-xs uppercase tracking-widest text-clinic-sand/50">
                  <span>{established}</span>
                  <span>{location}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 font-display text-white">
                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-3xl">12k+</p>
                    <p className="mt-1 font-body text-xs text-clinic-sand/60">skin consults</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-3xl">8.5k</p>
                    <p className="mt-1 font-body text-xs text-clinic-sand/60">dental visits</p>
                  </div>
                </div>
                <p className="font-body text-sm text-clinic-sand/70">
                  "One clinic, no referral paperwork between them."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <h2 className="font-display text-3xl text-clinic-ink">
            Why patients come to us for both.
          </h2>
          <p className="font-body text-base leading-relaxed text-clinic-ink/70">
            Skin and teeth are more connected than people assume — inflammation, medication,
            and stress show up in both. Our dermatology and dental teams sit down the hall from
            each other and actually talk, so your treatment plan doesn't fall apart at the seams
            between specialties.
          </p>
        </div>
      </section>

      {/* Services overview */}
      <section className="bg-clinic-mist py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-8 shadow-soft ring-1 ring-clinic-ink/5">
              <span className="font-body text-xs font-semibold uppercase tracking-widest text-clinic-teal">
                Dermatology
              </span>
              <h3 className="mt-2 font-display text-2xl text-clinic-ink">Skin Care</h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-clinic-ink/70">
                {loading ? "Loading services…" : "Acne, pigmentation, eczema, and cosmetic treatments."}
              </p>
              <ul className="mt-5 space-y-3">
                {skinServices.map((s) => (
                  <li key={s.name} className="flex gap-3 font-body text-sm text-clinic-ink/80">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-clinic-coral" />
                    <span>
                      <span className="font-medium text-clinic-ink">{s.name}</span> — {s.description}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                to="/skin"
                className="mt-6 inline-block font-body text-sm font-semibold text-clinic-teal hover:underline"
              >
                View all skin services →
              </Link>
            </div>
            <div className="rounded-3xl bg-white p-8 shadow-soft ring-1 ring-clinic-ink/5">
              <span className="font-body text-xs font-semibold uppercase tracking-widest text-clinic-teal">
                Dentistry
              </span>
              <h3 className="mt-2 font-display text-2xl text-clinic-ink">Dental Care</h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-clinic-ink/70">
                {loading ? "Loading services…" : "Cleanings, root canals, braces, and restorations."}
              </p>
              <ul className="mt-5 space-y-3">
                {dentalServices.map((s) => (
                  <li key={s.name} className="flex gap-3 font-body text-sm text-clinic-ink/80">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-clinic-teal" />
                    <span>
                      <span className="font-medium text-clinic-ink">{s.name}</span> — {s.description}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                to="/dental"
                className="mt-6 inline-block font-body text-sm font-semibold text-clinic-teal hover:underline"
              >
                View all dental services →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-3xl text-clinic-ink">Meet the team</h2>
        <p className="mt-3 max-w-xl font-body text-base text-clinic-ink/70">
          Four specialists, two disciplines, one shared waiting room.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading && doctors.length === 0
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-72 animate-pulse rounded-3xl bg-clinic-ink/5" />
              ))
            : doctors.map((doc) => <DoctorCard key={doc.id} doctor={doc} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-clinic-teal px-8 py-10 text-white shadow-soft sm:flex-row sm:items-center">
          <div>
            <h3 className="font-display text-2xl">Ready to come in?</h3>
            <p className="mt-1 font-body text-sm text-white/80">
              Pick an open slot for skin or dental — no phone tag required.
            </p>
          </div>
          <Link
            to="/booking"
            className="rounded-full bg-white px-7 py-3 font-body text-sm font-semibold text-clinic-teal transition-transform hover:-translate-y-0.5"
          >
            Book a visit
          </Link>
        </div>
      </section>
    </div>
  );
}
