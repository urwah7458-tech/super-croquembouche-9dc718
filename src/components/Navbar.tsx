import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/skin", label: "Skin" },
  { to: "/dental", label: "Dental" },
  { to: "/booking", label: "Book a Visit" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-clinic-ink/10 bg-clinic-sand/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-medium tracking-tight text-clinic-ink">
            Asma <span className="text-clinic-coral">&amp;</span> Safi
          </span>
          <span className="hidden font-body text-xs uppercase tracking-[0.2em] text-clinic-teal sm:inline">
            Skin &amp; Dental Clinic
          </span>
        </NavLink>
        <ul className="flex items-center gap-1 font-body text-sm">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 transition-colors ${
                    isActive
                      ? "bg-clinic-teal text-white"
                      : "text-clinic-ink/70 hover:bg-clinic-ink/5 hover:text-clinic-ink"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
