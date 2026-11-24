import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Analytics } from "@vercel/analytics/react";
import { CASES, CERTS, JOBS, LINKS, NOTES, REPOS, SITES, STATS, TESTIMONIALS } from "./data";

const ease = [0.22, 1, 0.36, 1];
const NAV = [["Work", "work"], ["Clients", "clients"], ["Open source", "code"], ["Experience", "experience"], ["Certifications", "certs"], ["Notes", "notes"]];

function Reveal({ children, className = "", delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, ease, delay }} className={className}>
      {children}
    </motion.div>
  );
}

function Arrow({ className = "" }) {
  return <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg>;
}

/* ---------- header: menus que abrem no hover, logo troca para a marca K\ ao descer ---------- */

function Wordmark({ className = "" }) {
  return <span className={`whitespace-nowrap font-semibold tracking-[0.16em] ${className}`}>KEVIN MATOS</span>;
}

const MENUS = () => [
  ["Work", [["Products", CASES.map((c) => [c.name, `#project/${c.id}`])], ["Open source", REPOS.slice(0, 4).map((r) => [r.name, `${LINKS.github}/${r.name}`])]]],
  ["Clients", [["Client sites", SITES.slice(0, 6).map((x) => [x.name, x.url])], ["More", [["All 40+ sites", "#clients"], ["Client feedback", "#feedback"], ["Comply studio", LINKS.studio]]]]],
  ["About", [["Career", [["Experience", "#experience"], ["Certifications", "#certs"], ["Engineering notes", "#notes"]]], ["Contact", [["Email", `mailto:${LINKS.email}`], ["LinkedIn", LINKS.linkedin], ["GitHub", LINKS.github]]]]],
];

function Search({ onClose }) {
  const [q, setQ] = useState("");
  const all = [
    ...CASES.map((c) => ["Project", c.name, `#project/${c.id}`]),
    ...SITES.map((x) => ["Client site", x.name, x.url]),
    ...REPOS.map((r) => ["Open source", r.name, `${LINKS.github}/${r.name}`]),
    ...CERTS.map((c) => ["Certificate", `${c.name} · ${c.org}`, c.verify || c.url]),
    ...NOTES.map((n) => ["Note", n.title, "#notes"]),
  ];
  const hits = all.filter((h) => h[1].toLowerCase().includes(q.toLowerCase())).slice(0, 8);
  useEffect(() => {
    const k = (e) => e.key === "Escape" && onClose();
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[80] bg-ink/25 px-4 pt-[14vh] backdrop-blur-sm">
      <motion.div initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={(e) => e.stopPropagation()} className="mx-auto max-w-xl overflow-hidden rounded-2xl border border-line bg-bg shadow-2xl">
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects, clients, certificates..." className="w-full border-b border-line bg-transparent px-5 py-4 text-[16px] outline-none" />
        <ul className="max-h-[50vh] overflow-y-auto p-2">
          {hits.map(([k, t, href]) => (
            <li key={k + t}><a href={href} onClick={onClose} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="flex items-baseline justify-between gap-4 rounded-xl px-3 py-2.5 hover:bg-card"><span>{t}</span><span className="shrink-0 text-[13px] text-mute">{k}</span></a></li>
          ))}
          {!hits.length && <li className="px-3 py-6 text-center text-mute">Nothing found.</li>}
        </ul>
      </motion.div>
    </motion.div>
  );
}

function Header() {
  const [compact, setCompact] = useState(false);
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(null);
  const [search, setSearch] = useState(false);
  useEffect(() => {
    const on = () => {
      setCompact(scrollY > 60);
      const f = document.getElementById("footer");
      setDark(!!f && f.getBoundingClientRect().top < 72);
    };
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);
  const pill = (on) => `flex items-center gap-1.5 rounded-full border px-4 py-2 text-[14px] transition-colors duration-200 ${on ? (dark ? "border-white bg-white text-ink" : "border-ink bg-ink text-bg") : dark ? "border-white/15 hover:border-white/40" : "border-line hover:border-ink/30"}`;
  const Chev = ({ up }) => <svg className={`transition-transform duration-200 ${up ? "rotate-180" : ""}`} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="m6 9 6 6 6-6" /></svg>;
  return (
    <>
      <header onMouseLeave={() => setMenu(null)} className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${dark ? "bg-[#141413] text-[#faf9f5]" : "bg-bg text-ink"}`}>
        <div className="mx-auto grid h-[72px] max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 sm:px-8">
          <nav className="hidden items-center gap-2 lg:flex">
            {MENUS().map(([t]) => (
              <button key={t} onMouseEnter={() => setMenu(t)} onClick={() => setMenu(menu === t ? null : t)} className={pill(menu === t)}>{t}<Chev up={menu === t} /></button>
            ))}
            <a href="#certs" onMouseEnter={() => setMenu(null)} className={pill(false)}>Certifications</a>
          </nav>
          <span className="lg:hidden" />
          <a href="#top" aria-label="Kevin Matos" className="relative grid h-8 w-[190px] place-items-center overflow-hidden sm:w-[230px]">
            <span className={`absolute text-[19px] transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] sm:text-[24px] ${compact ? "-translate-y-3 opacity-0 blur-[2px]" : "translate-y-0 opacity-100"}`}><Wordmark /></span>
            <span className={`absolute text-[24px] font-bold tracking-[-0.02em] transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${compact ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0 blur-[2px]"}`}>K\</span>
          </a>
          <div className="flex items-center justify-end gap-2">
            <a href={LINKS.cv} target="_blank" rel="noreferrer" onMouseEnter={() => setMenu(null)} className={`hidden sm:flex ${pill(false)}`}>Download CV</a>
            <button onClick={() => setSearch(true)} className={`grid size-10 place-items-center rounded-full border transition-colors ${dark ? "border-white/15 hover:border-white/40" : "border-line hover:border-ink/30"}`} aria-label="Search">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            </button>
            <button onClick={() => setOpen(true)} className={`grid size-10 place-items-center rounded-xl border transition-colors ${dark ? "border-white/15 hover:border-white/40" : "border-line hover:border-ink/30"}`} aria-label="Open menu">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h10" /></svg>
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menu && (
            <motion.div key={menu} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2, ease }} className="absolute left-5 top-[64px] hidden min-w-[460px] rounded-2xl border border-line bg-bg p-6 text-ink shadow-[0_20px_50px_rgba(0,0,0,.08)] sm:left-8 lg:block">
              <div className="grid grid-cols-2 gap-10">
                {MENUS().find((m) => m[0] === menu)[1].map(([h, items]) => (
                  <div key={h}>
                    <p className="text-[14px] text-mute">{h}</p>
                    <ul className="mt-3 space-y-2.5">
                      {items.map(([t, href]) => <li key={t}><a href={href} onClick={() => setMenu(null)} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="text-[15px] transition-colors hover:text-clay">{t}</a></li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <div className="h-[72px]" />
      <AnimatePresence>{search && <Search onClose={() => setSearch(false)} />}</AnimatePresence>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-bg px-6 pb-10 pt-5">
            <div className="flex items-center justify-between">
              <Wordmark className="text-[19px]" />
              <button onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-xl border border-line" aria-label="Close menu">✕</button>
            </div>
            <nav className="mx-auto mt-12 flex w-full max-w-3xl flex-col">
              {NAV.map(([t, id], i) => (
                <motion.a key={id} href={`#${id}`} onClick={() => setOpen(false)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i, ease }} className="border-b border-line py-4 font-serif text-3xl sm:text-5xl">{t}</motion.a>
              ))}
            </nav>
            <a href={LINKS.cv} target="_blank" rel="noreferrer" className="mx-auto mt-10 w-full max-w-3xl rounded-full bg-ink py-4 text-center font-medium text-bg">Download CV</a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------- topo ---------- */

/* Arte em blocos, no espírito das ilustrações editoriais: cores da paleta, sem print de produto. */
function Art({ seed = 1, className = "" }) {
  const cols = ["#d97757", "#e8e6dc", "#6a9bcc", "#788c5d", "#bcd1ca", "#141413", "#ebcece", "#cbcadb"];
  let x = seed * 9301 + 49297;
  const r = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
  const cells = Array.from({ length: 48 }, () => cols[Math.floor(r() * cols.length)]);
  return (
    <div className={`grid grid-cols-8 grid-rows-6 ${className}`}>
      {cells.map((c, i) => <motion.span key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: (i % 8) * 0.03 + Math.floor(i / 8) * 0.03, duration: 0.6 }} style={{ background: c }} />)}
    </div>
  );
}

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const inset = useTransform(scrollYProgress, [0.25, 1], [6, 0]);
  const radius = useTransform(scrollYProgress, [0.25, 1], [16, 0]);
  const clip = useTransform([inset, radius], ([i, r]) => `inset(0 ${i}% round ${r}px)`);
  return (
    <section id="top">
      <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-14 sm:px-8 sm:pt-20">
        <Reveal>
          <h1 className="max-w-[1250px] text-[34px] leading-[1.12] tracking-[-0.02em] sm:text-[56px]">
            <span className="font-semibold">Full stack & AI engineer building software that ships.</span>{" "}
            <span className="font-serif">Production SaaS, LLM agents and 40+ websites for real clients. Relocating to Dublin in January 2027.</span>
          </h1>
        </Reveal>
      </div>
      <motion.div ref={ref} style={{ clipPath: clip }} className="relative h-[85vh] min-h-[520px] overflow-hidden bg-[#8b8173]">
        <Art seed={7} className="absolute inset-0 opacity-25 mix-blend-multiply" />
        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <p className="font-serif text-[48px] leading-[1.02] tracking-[-0.02em] sm:text-[104px]">From idea<br className="sm:hidden" /> to production</p>
          <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-white/90 sm:text-[22px]">Architecture, databases, APIs, AI agents and the server they run on. Python, TypeScript and Go.</p>
          <div className="mt-9 flex gap-3">
            <a href="#work" className="rounded-xl bg-white px-6 py-3 text-[15px] font-medium text-ink">See my work</a>
            <a href={`mailto:${LINKS.email}`} className="rounded-xl bg-ink px-6 py-3 text-[15px] font-medium text-white">Get in touch</a>
          </div>
        </div>
      </motion.div>
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 px-5 sm:grid-cols-4 sm:px-8">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.05} className={`py-10 pr-6 ${i ? "sm:border-l sm:border-line sm:pl-8" : ""}`}>
            <div className="font-serif text-[44px] leading-none tracking-tight">{s.prefix}{s.n}{s.suffix}</div>
            <p className="mt-3 text-[14px] leading-snug text-mute">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Section({ id, eyebrow, title, sub, children, className = "" }) {
  return (
    <section id={id} className={`scroll-mt-24 border-t border-line ${className}`}>
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-20 sm:py-28">
        <Reveal>
          <p className="text-[14px] text-mute">{eyebrow}</p>
          <h2 className="mt-3 max-w-3xl font-serif text-[34px] leading-[1.1] tracking-[-0.015em] sm:text-[48px]">{title}</h2>
          {sub && <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-mute">{sub}</p>}
        </Reveal>
        <div className="mt-14">{children}</div>
      </div>
    </section>
  );
}

/* ---------- projetos ---------- */

function Work({ onOpen }) {
  const tint = ["#e3dacc", "#d5e0d1", "#dfe6ee", "#efe3d3", "#e6e0ea", "#dcdcd4"];
  return (
    <Section id="work" eyebrow="Selected work" title="Products I built, run or sold." sub="Real clients, real users. Open any project for the architecture and the decisions behind it.">
      <div className="group/list grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {CASES.map((c, i) => (
          <Reveal key={c.id} delay={(i % 3) * 0.06}>
            <button onClick={() => onOpen(c.id)} className="group block w-full text-left transition-opacity duration-300 group-hover/list:opacity-45 hover:!opacity-100">
              <p className="flex items-center gap-3 text-[14px] text-mute"><span className="rounded-full bg-card px-2.5 py-0.5 tracking-widest">···</span>{c.kind}</p>
              <div className="relative mt-4 aspect-[4/5] overflow-hidden" style={{ background: tint[i % tint.length] }}>
                <Art seed={i + 2} className="absolute inset-0 opacity-30" />
                <img src={c.desktop} alt={c.name} loading="lazy" className="absolute bottom-0 left-[10%] h-[78%] w-[120%] max-w-none rounded-tl-xl object-cover object-left-top shadow-2xl transition-transform duration-700 group-hover:-translate-y-2" />
              </div>
              <h3 className="mt-5 text-[26px] font-semibold leading-tight tracking-[-0.01em]">{c.name}</h3>
              <p className="mt-2 line-clamp-3 text-[16px] leading-relaxed text-mute">{c.lede}</p>
            </button>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function CaseModal({ id, onClose }) {
  const c = CASES.find((x) => x.id === id);
  useEffect(() => {
    if (!c) return;
    document.body.style.overflow = "hidden";
    const k = (e) => e.key === "Escape" && onClose();
    addEventListener("keydown", k);
    return () => { document.body.style.overflow = ""; removeEventListener("keydown", k); };
  }, [c, onClose]);
  return (
    <AnimatePresence>
      {c && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] overflow-y-auto bg-ink/30 backdrop-blur-sm" onClick={onClose}>
          <motion.article initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ duration: 0.45, ease }} onClick={(e) => e.stopPropagation()} className="mx-auto my-0 min-h-full max-w-4xl bg-bg px-6 pb-16 pt-6 sm:my-10 sm:min-h-0 sm:rounded-[28px] sm:px-12">
            <div className="sticky top-0 -mx-6 flex justify-end bg-bg/90 px-6 py-3 backdrop-blur sm:-mx-12 sm:px-12">
              <button onClick={onClose} className="grid size-10 place-items-center rounded-full border border-line" aria-label="Close">✕</button>
            </div>
            <p className="text-[13px] text-mute">{c.kind} · {c.year} · {c.badge}</p>
            <h2 className="mt-2 font-serif text-[40px] leading-tight tracking-tight sm:text-[56px]">{c.name}</h2>
            <p className="mt-5 text-[18px] leading-relaxed text-mute">{c.lede}</p>
            {c.url && <a href={c.url} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-ink px-5 py-2.5 text-[14px] font-medium text-bg">Visit live <Arrow /></a>}
            <div className="mt-10 overflow-hidden rounded-2xl border border-line">
              {c.video ? <video src={c.video} poster={c.desktop} autoPlay muted loop playsInline className="w-full" /> : <img src={c.desktop} alt={c.name} className="w-full" />}
            </div>
            {c.metrics && (
              <div className="mt-10 grid gap-6 border-y border-line py-8 sm:grid-cols-3">
                {c.metrics.map(([n, l]) => <div key={l}><div className="font-serif text-3xl">{n}</div><p className="mt-1 text-[14px] text-mute">{l}</p></div>)}
              </div>
            )}
            <h3 className="mt-10 font-serif text-2xl">What I built</h3>
            <dl className="mt-5 divide-y divide-line">
              {c.points.map(([k, v]) => (
                <div key={k} className="grid gap-1 py-4 sm:grid-cols-[180px_1fr]"><dt className="font-medium">{k}</dt><dd className="text-mute">{v}</dd></div>
              ))}
            </dl>
            {c.gallery && (
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {c.gallery.map((g) => <img key={g} src={g} alt="" loading="lazy" className="rounded-xl border border-line" />)}
              </div>
            )}
            <blockquote className="mt-10 border-l-2 border-clay pl-5 font-serif text-[22px] leading-snug">{c.meaning}</blockquote>
            <div className="mt-8 flex flex-wrap gap-2">
              {c.tags?.map((t) => <span key={t} className="rounded-full border border-line px-3 py-1 text-[13px] text-mute">{t}</span>)}
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- sites de clientes e feedback ---------- */

function Clients() {
  return (
    <Section id="clients" eyebrow="Client sites · Comply studio" title="40+ websites for real businesses." sub="Through my studio, Comply. A few of them, with what the clients said.">
      <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {SITES.map((s, i) => {
          const fb = TESTIMONIALS.find((t) => t[3] === s.name);
          return (
            <Reveal key={s.name} delay={(i % 3) * 0.05}>
              <a href={s.url} target="_blank" rel="noreferrer" className="group block">
                <div className="overflow-hidden rounded-2xl border border-line bg-card">
                  <img src={s.shot} alt={s.name} loading="lazy" className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" />
                </div>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div><h3 className="font-medium">{s.name}</h3><p className="mt-0.5 text-[14px] text-mute">{s.what}</p></div>
                  <Arrow className="mt-1.5 shrink-0 text-mute transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" />
                </div>
                {fb && <p className="mt-3 font-serif text-[17px] italic leading-snug">“{fb[0]}”</p>}
              </a>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

function Feedback() {
  return (
    <section id="feedback" className="scroll-mt-24 bg-ink text-bg">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-20 sm:py-28">
        <p className="text-[14px] opacity-60">Client feedback</p>
        <div className="mt-10 grid gap-12 md:grid-cols-3">
          {TESTIMONIALS.map(([q, name, role]) => (
            <Reveal key={q}>
              <p className="font-serif text-[26px] leading-snug">“{q}”</p>
              <p className="mt-5 text-[14px] opacity-60">{name} · {role}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- open source ---------- */

function Code() {
  return (
    <Section id="code" eyebrow="Open source" title="The engineering, in public." sub="Small, focused repos with tests, each one proving a specific skill.">
      <div className="divide-y divide-line border-y border-line">
        {REPOS.map((r) => (
          <Reveal key={r.name}>
            <a href={`${LINKS.github}/${r.name}`} target="_blank" rel="noreferrer" className="group grid gap-3 py-7 md:grid-cols-[220px_1fr_auto] md:items-baseline md:gap-10">
              <div className="flex items-center gap-2.5"><span className="size-2.5 rounded-full" style={{ background: r.color }} /><span className="font-mono text-[15px]">{r.name}</span></div>
              <div>
                <p className="leading-relaxed text-mute">{r.desc}</p>
                <p className="mt-2 text-[13px] text-mute/80">{r.lang} · {r.proof.join(" · ")}</p>
              </div>
              <Arrow className="hidden text-mute transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink md:block" />
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------- experiência ---------- */

function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title="Where I've worked.">
      <div className="divide-y divide-line border-y border-line">
        {JOBS.map((j) => (
          <Reveal key={j.co}>
            <div className="grid gap-4 py-9 md:grid-cols-[260px_1fr] md:gap-10">
              <div>
                <p className="text-[14px] text-mute">{j.when}</p>
                <h3 className="mt-1 font-serif text-[22px] leading-snug">{j.co}</h3>
              </div>
              <div>
                <p className="font-medium">{j.role}</p>
                <ul className="mt-3 space-y-2">
                  {j.pts.map((p) => <li key={p} className="relative pl-5 leading-relaxed text-mute before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2.5 before:bg-mute/60">{p}</li>)}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <a href={LINKS.cv} target="_blank" rel="noreferrer" className="mt-10 inline-flex items-center gap-1.5 rounded-full border border-line px-5 py-2.5 text-[14px] font-medium hover:bg-card">Download the full CV (PDF) <Arrow /></a>
    </Section>
  );
}

/* ---------- certificações ---------- */

function Certs() {
  const [open, setOpen] = useState(null);
  return (
    <Section id="certs" eyebrow="Certifications" title="Always learning, with proof." sub="Every certificate links to its public verification page.">
      <div className="divide-y divide-line border-y border-line">
        {CERTS.map((c) => (
          <div key={c.name} className="grid items-baseline gap-2 py-5 sm:grid-cols-[180px_1fr_auto] sm:gap-8">
            <p className="text-[14px] text-mute">{c.org}</p>
            <div>
              <button onClick={() => setOpen(c)} className="text-left font-medium underline-offset-4 hover:underline">{c.name}</button>
              <p className="mt-1 text-[14px] leading-relaxed text-mute">{c.note}</p>
            </div>
            <div className="flex gap-4 text-[14px]">
              <span className="text-mute">{c.date}</span>
              {c.verify && <a href={c.verify} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium">Verify <Arrow /></a>}
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)} className="fixed inset-0 z-[70] grid place-items-center bg-ink/40 p-4 backdrop-blur-sm">
            <motion.img initial={{ scale: 0.96 }} animate={{ scale: 1 }} src={open.img} alt={open.name} className="max-h-[85vh] max-w-full rounded-xl shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}

/* ---------- notas ---------- */

function Notes() {
  const [open, setOpen] = useState(null);
  return (
    <Section id="notes" eyebrow="Engineering notes" title="Short write-ups from real projects.">
      <div className="divide-y divide-line border-y border-line">
        {NOTES.map((n) => {
          const on = open === n.slug;
          return (
            <div key={n.slug}>
              <button onClick={() => setOpen(on ? null : n.slug)} className="grid w-full gap-2 py-7 text-left md:grid-cols-[180px_1fr_auto] md:gap-8">
                <p className="text-[14px] text-mute">{n.project} · {n.read}</p>
                <div><h3 className="font-serif text-[22px] leading-snug">{n.title}</h3><p className="mt-2 leading-relaxed text-mute">{n.tldr}</p></div>
                <span className={`hidden size-8 place-items-center rounded-full border border-line transition-transform md:grid ${on ? "rotate-45" : ""}`}>+</span>
              </button>
              <AnimatePresence initial={false}>
                {on && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }} className="overflow-hidden">
                    <div className="max-w-3xl space-y-4 pb-10 leading-relaxed text-mute md:ml-[212px]">
                      {n.body?.map((p) => <p key={p}>{p}</p>)}
                      {n.code && <pre className="overflow-x-auto rounded-xl bg-card p-5 font-mono text-[13px] leading-relaxed text-ink">{n.code}</pre>}
                      {n.after?.map((p) => <p key={p}>{p}</p>)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/* ---------- contato e footer escuro ---------- */

function Contact() {
  return (
    <section id="contact" className="border-t border-line">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <h2 className="max-w-5xl text-[38px] leading-[1.08] tracking-[-0.02em] sm:text-[64px]"><span className="font-bold">Let's build something together.</span> <span className="font-serif">I reply within a day.</span></h2>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={`mailto:${LINKS.email}`} className="rounded-xl bg-ink px-6 py-3 text-[15px] font-medium text-bg hover:opacity-85">{LINKS.email}</a>
            <a href={LINKS.cv} target="_blank" rel="noreferrer" className="rounded-xl border border-line px-6 py-3 text-[15px] font-medium hover:bg-card">Download CV</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FootRow({ title, items }) {
  const [on, setOn] = useState(false);
  return (
    <div className="border-t border-white/15">
      <button onClick={() => setOn(!on)} className={`flex w-full items-center justify-between py-6 text-left text-[17px] transition-colors ${on ? "text-white" : "text-white/55 hover:text-white"}`}>
        {title}
        <svg className={`transition-transform duration-300 ${on ? "rotate-180" : ""}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      <AnimatePresence initial={false}>
        {on && (
          <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease }} className="grid overflow-hidden pb-2 sm:grid-cols-2">
            {items.map(([t, href]) => (
              <li key={t}><a href={href} target={href.startsWith("http") || href.endsWith(".pdf") ? "_blank" : undefined} rel="noreferrer" className="block py-2 text-[15px] text-white/75 hover:text-white">{t}</a></li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function FootMark() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 35%", "start 0%"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -20]);
  return <motion.p ref={ref} style={{ opacity, y }} className="self-start text-[34px] sm:text-[44px]"><Wordmark /></motion.p>;
}

function Footer() {
  const rows = [
    ["Work", CASES.map((c) => [c.name, `#project/${c.id}`])],
    ["Client sites", SITES.map((s) => [s.name, s.url])],
    ["Open source", REPOS.map((r) => [r.name, `${LINKS.github}/${r.name}`])],
    ["Experience", JOBS.map((j) => [`${j.co} · ${j.when}`, "#experience"])],
    ["Certifications", CERTS.map((c) => [`${c.name} · ${c.org}`, c.verify || c.url])],
    ["Notes", NOTES.map((n) => [n.title, "#notes"])],
  ];
  return (
    <footer id="footer" className="bg-[#141413] text-[#faf9f5]">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 pb-12 pt-24 sm:px-8 lg:grid-cols-[1fr_1.9fr]">
        <FootMark />
        <div className="border-b border-white/15">
          {rows.map(([t, items]) => <FootRow key={t} title={t} items={items} />)}
        </div>
      </div>
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 pb-16 pt-10 text-[15px] sm:px-8 lg:grid-cols-[1fr_1fr_0.9fr]">
        <div className="flex flex-col justify-end gap-5 text-white/60">
          <span>© 2026 Kevin Matos</span>
          <div className="flex gap-5">
            <a href={LINKS.github} target="_blank" rel="noreferrer" className="hover:text-white">GitHub</a>
            <a href={LINKS.linkedin} target="_blank" rel="noreferrer" className="hover:text-white">LinkedIn</a>
            <a href={`mailto:${LINKS.email}`} className="hover:text-white">Email</a>
          </div>
        </div>
        <div>
          <p className="text-white">About</p>
          <p className="mt-2 leading-relaxed text-white/60">Full stack and AI engineer from Brazil, founder of the Comply studio. Moving to Dublin in January 2027 to join a team that ships.</p>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-white">Elsewhere</p>
          <a href={LINKS.studio} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-white/75 hover:text-white">Comply studio <Arrow /></a>
          <a href={LINKS.cv} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-white/75 hover:text-white">CV (PDF) <Arrow /></a>
        </div>
      </div>
    </footer>
  );
}

function useHashCase() {
  const read = () => location.hash.match(/^#project\/(.+)$/)?.[1] ?? null;
  const [id, setId] = useState(read);
  useEffect(() => {
    const on = () => setId(read());
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);
  const open = (v) => { location.hash = `project/${v}`; };
  const close = () => { history.pushState(null, "", location.pathname + "#work"); setId(null); };
  return [id, open, close];
}

export default function App() {
  const [id, open, close] = useHashCase();
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Work onOpen={open} />
        <Clients />
        <Feedback />
        <Code />
        <Experience />
        <Certs />
        <Notes />
        <Contact />
      </main>
      <Footer />
      <CaseModal id={id} onClose={close} />
      <Analytics />
    </>
  );
}
