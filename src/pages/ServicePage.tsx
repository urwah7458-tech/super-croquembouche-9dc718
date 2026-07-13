import { Link } from "react-router-dom";
import { useClinicContent } from "../lib/useClinicContent";
import { getServices } from "../lib/api";
import DoctorCard from "../components/DoctorCard";

interface Props {
  pageKey: "skin" | "dental";
  accent: string;
  fallbackTitle: string;
  fallbackDescription: string;
}

export default function ServicePage({ pageKey, accent, fallbackTitle, fallbackDescription }: Props) {
  const { doctors, pageContent, loading } = useClinicContent();

  const content = pageContent.find((p) => p.pageKey === pageKey);
  const services = getServices(pageContent, pageKey);
  const team = doctors.filter((d) => d.service === pageKey);

  const title = content?.title || fallbackTitle;
  const description = content?.description || fallbackDescription;

  return (
    <div>
      <section className="border-b border-clinic-ink/5 bg-clinic-mist px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <span
            className="font-body text-xs font-semibold uppercase tracking-widest"
            style={{ color: accent }}
          >
            {pageKey === "skin" ? "Dermatology" : "Dentistry"}
          </span>
          <h1 className="mt-2 font-display text-4xl text-clinic-ink md:text-5xl">
            {loading ? fallbackTitle : title}
          </h1>
          <p className="mt-5 max-w-2xl font-body text-lg leading-relaxed text-clinic-ink/70">
            {loading ? fallbackDescription : description}
          </p>
          <Link
            to="/booking"
            className="mt-7 inline-block rounded-full px-7 py-3 font-body text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
            style={{ backgroundColor: accent }}
          >
            Book a {pageKey} visit
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-2xl text-clinic-ink">What we treat</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading && services.length === 0
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-2xl bg-clinic-ink/5" />
              ))
            : services.map((s) => (
                <div
                  key={s.name}
                  className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-clinic-ink/5"
                >
                  <p className="font-display text-lg text-clinic-ink">{s.name}</p>
                  <p className="mt-2 font-body text-sm leading-relaxed text-clinic-ink/70">
                    {s.description}
                  </p>
                </div>
              ))}
        </div>
      </section>

      {team.length > 0 && (
        <section className="bg-clinic-sand px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-2xl text-clinic-ink">
              {pageKey === "skin" ? "Our dermatologists" : "Our dental team"}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((doc) => (
                <DoctorCard key={doc.id} doctor={doc} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
