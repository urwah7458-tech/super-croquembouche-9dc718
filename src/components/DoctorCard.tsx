import type { Doctor } from "../lib/api";

const initialsOf = (name: string) =>
  name
    .replace(/^Dr\.?\s*/i, "")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-clinic-ink/5">
      <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-clinic-teal via-clinic-tealdark to-clinic-ink">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_35%)]" />
        <span className="font-display text-4xl font-medium text-white/90">
          {initialsOf(doctor.name)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-6">
        <p className="font-display text-lg text-clinic-ink">{doctor.name}</p>
        <p className="font-body text-xs font-semibold uppercase tracking-wide text-clinic-coral">
          {doctor.specialty}
        </p>
        <p className="font-body text-sm leading-relaxed text-clinic-ink/70">{doctor.bio}</p>
      </div>
    </div>
  );
}
