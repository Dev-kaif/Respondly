import { Link } from '@tanstack/react-router'
import { ChartColumn, CheckCheck, Palette, WandSparkles } from 'lucide-react'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,#ffffff,#faf9ff)] font-sans text-[#0f0e17]">
      {/* NAV */}
      <nav className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-black/[0.06] bg-white/80 px-6 backdrop-blur-md md:px-10">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#7F77DD]" />
          <span className="text-[15px] font-semibold tracking-tight">Respondly</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/auth/login"
            className="hidden text-sm text-[#6b6b80] transition-colors hover:text-[#0f0e17] sm:block"
          >
            Sign in
          </Link>
          <Link
            to="/auth/signup"
            className="rounded-lg bg-[#0f0e17] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1a1a2e]"
          >
            Try it now
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-2 md:px-10 md:py-28">
        {/* Left */}
        <div className="flex flex-col gap-7">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#EEEDFE] px-3 py-1 text-xs font-medium tracking-wide text-[#534AB7]">
            <span className="size-1.5 rounded-full bg-[#7F77DD]" />
            Built for creators & startups
          </span>

          <h1 className="text-[clamp(38px,5vw,58px)] font-semibold leading-[1.07] tracking-[-0.03em]">
            Surveys that feel
            <br />
            like <span className="text-[#7F77DD]">yours</span>
          </h1>

          <p className="max-w-md text-[17px] leading-relaxed text-[#6b6b80]">
            Build branded surveys in minutes. Share a link, collect responses, and read them in one
            clean dashboard — no setup required.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/auth/signup"
              className="rounded-lg bg-[#7F77DD] px-6 py-3 text-[15px] font-semibold text-white shadow-lg shadow-[#7F77DD]/20 transition-all hover:-translate-y-px hover:bg-[#534AB7]"
            >
              Try it now
            </Link>
            <Link
              to="/auth/login"
              className="rounded-lg border border-black/10 px-5 py-3 text-[15px] text-[#6b6b80] transition-colors hover:border-black/20 hover:text-[#0f0e17]"
            >
              Sign in
            </Link>
          </div>

          <div className="flex items-center gap-5 pt-1">
            {[
              { n: '3', label: 'question types' },
              { n: '∞', label: 'responses' },
              { n: '5', label: 'brand themes' },
            ].map(({ n, label }) => (
              <div key={label} className="flex flex-col">
                <span className="text-xl font-semibold tracking-tight text-[#0f0e17]">{n}</span>
                <span className="text-xs text-[#9898aa]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Survey card demo */}
        <div className="flex justify-center md:justify-end">
          <div className="w-full max-w-[360px] overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_8px_40px_rgba(127,119,221,0.12)]">
            {/* card header */}
            <div className="flex items-center gap-3 border-b border-black/[0.06] px-5 py-4">
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#7F77DD]">
                <CheckCheck className="size-4 text-white" />
              </div>
              <div>
                <div className="text-[13px] font-medium text-[#0f0e17]">Product feedback</div>
                <div className="text-[11px] text-[#9898aa]">Acme Inc · 3 questions</div>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <span className="size-2 rounded-full bg-green-400" />
                <span className="text-[11px] text-[#9898aa]">Live</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 p-5">
              {/* Q1 text */}
              <div>
                <div className="mb-2 flex items-center gap-2 text-[12px] font-medium text-[#0f0e17]">
                  <span className="flex size-[18px] items-center justify-center rounded-[4px] bg-[#EEEDFE] text-[10px] font-semibold text-[#534AB7]">
                    1
                  </span>
                  What's your name?
                </div>
                <div className="h-9 rounded-md border border-black/[0.08] bg-[#f8f8fb] px-3 text-[12px] leading-9 text-[#9898aa]">
                  Your answer…
                </div>
              </div>

              {/* Q2 choice */}
              <div>
                <div className="mb-2 flex items-center gap-2 text-[12px] font-medium text-[#0f0e17]">
                  <span className="flex size-[18px] items-center justify-center rounded-[4px] bg-[#EEEDFE] text-[10px] font-semibold text-[#534AB7]">
                    2
                  </span>
                  How did you hear about us?
                </div>
                <div className="flex flex-col gap-1.5">
                  {['A friend or colleague', 'Social media', 'Search engine'].map((opt, i) => (
                    <div
                      key={opt}
                      className={`flex items-center gap-2.5 rounded-md border px-3 py-2 text-[12px] transition-colors ${
                        i === 0
                          ? 'border-[#7F77DD] bg-[#EEEDFE] text-[#534AB7]'
                          : 'border-black/[0.08] text-[#0f0e17]'
                      }`}
                    >
                      <span
                        className={`flex size-3.5 items-center justify-center rounded-full border ${i === 0 ? 'border-[#7F77DD]' : 'border-black/20'}`}
                      >
                        {i === 0 && <span className="size-1.5 rounded-full bg-[#7F77DD]" />}
                      </span>
                      {opt}
                    </div>
                  ))}
                </div>
              </div>

              {/* Q3 rating */}
              <div>
                <div className="mb-2 flex items-center gap-2 text-[12px] font-medium text-[#0f0e17]">
                  <span className="flex size-[18px] items-center justify-center rounded-[4px] bg-[#EEEDFE] text-[10px] font-semibold text-[#534AB7]">
                    3
                  </span>
                  Rate your experience
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      className={`text-xl ${s <= 4 ? 'text-amber-400' : 'text-gray-200'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="mt-1 w-full rounded-lg bg-[#7F77DD] py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#534AB7]"
              >
                Submit response
              </button>
            </div>

            <div className="border-t border-black/[0.06] py-2.5 text-center text-[11px] text-[#9898aa]">
              Powered by <span className="font-medium text-[#7F77DD]">Respondly</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-t border-black/[0.06]" id="features">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10">
          <div className="mb-3 text-xs font-medium uppercase tracking-widest text-[#7F77DD]">
            How it works
          </div>
          <h2 className="mb-14 max-w-lg text-[clamp(26px,3.5vw,40px)] font-semibold leading-[1.15] tracking-[-0.025em]">
            Everything you need, nothing you don't.
          </h2>

          <div className="grid grid-cols-1 gap-px border border-black/[0.06] bg-black/[0.04] sm:grid-cols-3 rounded-2xl overflow-hidden">
            {[
              {
                icon: <WandSparkles className="size-5 text-[#7F77DD]" />,
                title: 'Build in minutes',
                body: 'Drag questions into place, configure each one, mark required. Short text, multiple choice, and star rating — the three you actually need.',
              },
              {
                icon: <Palette className="size-5 text-[#7F77DD]" />,
                title: 'Brand it as yours',
                body: 'Set your primary color, drop in a logo, pick from 5 themes. Every public survey renders in your identity — not ours.',
              },
              {
                icon: <ChartColumn className="size-5 text-[#7F77DD]" />,
                title: 'Read every response',
                body: 'Responses land in your dashboard instantly. Click into any one to read each answer in context — no exports, no spreadsheets.',
              },
            ].map(({ icon, title, body }) => (
              <div
                key={title}
                className="group flex flex-col gap-4 bg-white p-8 transition-colors hover:bg-[#f5f4fe]"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#EEEDFE] transition-colors group-hover:bg-[#dddcfa]">
                  {icon}
                </div>
                <div>
                  <h3 className="mb-2 text-[15px] font-semibold tracking-tight">{title}</h3>
                  <p className="text-sm leading-relaxed text-[#6b6b80]">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="border-t border-black/[0.06]">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-20 text-center md:px-10">
          <h2 className="text-[clamp(26px,3.5vw,40px)] font-semibold tracking-[-0.025em]">
            Ready to build your first survey?
          </h2>
          <p className="max-w-sm text-[15px] text-[#6b6b80]">
            No credit card. No configuration. Just a form that works.
          </p>
          <Link
            to="/auth/signup"
            className="rounded-lg bg-[#7F77DD] px-8 py-3.5 text-[15px] font-medium text-white transition-all hover:bg-[#534AB7] hover:-translate-y-px"
          >
            Try it now — it's free
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-black/[0.06]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 md:px-10">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#7F77DD]" />
            <span className="text-sm font-semibold">Respondly</span>
          </div>
          <div className="flex flex-wrap gap-5">
            <a
              href="#features"
              className="text-sm text-[#6b6b80] transition-colors hover:text-[#0f0e17]"
            >
              Features
            </a>

            <Link
              to="/auth/login"
              className="text-sm text-[#6b6b80] transition-colors hover:text-[#0f0e17]"
            >
              Sign in
            </Link>

            <Link
              to="/auth/signup"
              className="text-sm text-[#6b6b80] transition-colors hover:text-[#0f0e17]"
            >
              Create account
            </Link>
          </div>
          <span className="text-xs text-[#9898aa]">© 2026 Respondly</span>
        </div>
      </footer>
    </div>
  )
}
