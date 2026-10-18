const NAV = [
  { heading: "Products", links: ["Guaraná Zero", "Blue Citrus", "Strawberry", "Grape", "Tutti Frutti"] },
  { heading: "Company",  links: ["About Fanta", "Sustainability", "Press", "Careers"] },
  { heading: "Support",  links: ["Find a Store", "FAQ", "Contact Us", "Wholesale"] },
];

const SOCIALS = ["Instagram", "TikTok", "YouTube", "Twitter"];

export default function Footer() {
  return (
    <footer id="footer" className="relative overflow-hidden bg-[#003D22] px-5 pt-12 pb-6 sm:px-10 sm:pt-16 lg:px-16">
      {/* top glow line */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2"
        style={{ background: "linear-gradient(90deg, transparent, #B7E11D55, transparent)" }}
      />
      {/* dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* ── top row: brand + social ── */}
        <div className="mb-8 flex items-center justify-between sm:mb-12">
          {/* logo */}
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#B7E11D]">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#003D22]" fill="currentColor">
                <path d="M12 2c3 3 5 6 5 9.5A5 5 0 0 1 7 11.5C7 8 9 5 12 2Z" />
              </svg>
            </span>
            <span className="font-display text-2xl tracking-wide text-white">FANTA</span>
          </div>
          {/* social icons */}
          <div className="flex gap-2">
            {SOCIALS.map((s) => (
              <button
                key={s}
                aria-label={s}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/60 transition-colors hover:border-[#B7E11D]/50 hover:bg-[#B7E11D]/15 hover:text-[#B7E11D]"
              >
                <span className="text-[10px] font-bold">{s[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── tagline (mobile only) ── */}
        <p className="mb-8 text-sm leading-relaxed text-white/45 sm:hidden">
          Bold guaraná taste. Five flavors. Zero sugar — just the full Fanta rush.
        </p>

        {/* ── nav columns ── */}
        {/* mobile: 3 equal columns side by side | desktop: 4 col with brand */}
        <div className="mb-8 grid grid-cols-3 gap-4 sm:mb-12 sm:grid-cols-[1.2fr_repeat(3,1fr)]">
          {/* brand copy — desktop only */}
          <p className="hidden text-sm leading-relaxed text-white/45 sm:block">
            Bold Amazonian guaraná taste. Five vibrant flavors. Zero sugar, zero compromise — just the full Fanta rush.
          </p>

          {NAV.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B7E11D]/70 sm:text-xs">
                {col.heading}
              </span>
              <ul className="flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-xs leading-snug text-white/45 transition-colors hover:text-white sm:text-sm">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── bottom legal row ── */}
        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Fanta Guaraná Zero Sugar. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4">
            {["Privacy Policy", "Terms of Use", "Cookie Settings"].map((l) => (
              <a key={l} href="#" className="text-xs text-white/30 transition-colors hover:text-white/60">
                {l}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
