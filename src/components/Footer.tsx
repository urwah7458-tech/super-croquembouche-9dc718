export default function Footer() {
  return (
    <footer className="border-t border-clinic-ink/10 bg-clinic-ink text-clinic-sand">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-3">
        <div>
          <p className="font-display text-xl">Asma &amp; Safi</p>
          <p className="mt-1 font-body text-xs uppercase tracking-[0.2em] text-clinic-sand/60">
            Skin &amp; Dental Clinic
          </p>
          <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-clinic-sand/70">
            Two specialties, one clinic. We've been treating skin and teeth on the same street corner
            since 2014.
          </p>
        </div>
        <div>
          <p className="font-body text-sm font-medium uppercase tracking-widest text-clinic-sand/50">
            Visit us
          </p>
          <address className="mt-3 font-body text-sm leading-relaxed text-clinic-sand/80 not-italic">
            14 Bloomview Lane<br />
            Gulshan-e-Fatima, Karachi<br />
            Sindh 75300
          </address>
        </div>
        <div>
          <p className="font-body text-sm font-medium uppercase tracking-widest text-clinic-sand/50">
            Get in touch
          </p>
          <ul className="mt-3 space-y-1 font-body text-sm text-clinic-sand/80">
            <li>
              <a href="tel:+922134551029" className="hover:text-clinic-coral">
                +92 21 3455 1029
              </a>
            </li>
            <li>
              <a href="mailto:hello@asmaandsafi.clinic" className="hover:text-clinic-coral">
                hello@asmaandsafi.clinic
              </a>
            </li>
            <li className="pt-2 text-clinic-sand/60">Mon–Sat, 9:00 AM – 7:00 PM</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-clinic-sand/10 px-6 py-5 text-center font-body text-xs text-clinic-sand/40">
        © {new Date().getFullYear()} Asma and Safi Skin and Dental Clinic. All rights reserved.
      </div>
    </footer>
  );
}
