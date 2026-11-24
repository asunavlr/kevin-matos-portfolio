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

/* ---------- header: logo no centro encolhe para KM ao descer; fica escuro sobre o footer ---------- */

function Header() {
  const [compact, setCompact] = useState(false);
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => {
      setCompact(scrollY > 60);
      const f = document.getElementById("footer");
      setDark(!!f && f.getBoundingClientRect().top < innerHeight * 0.4);
    };
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);
  const pill = `rounded-full border px-4 py-2 text-[14px] transition-colors ${dark ? "border-white/15 hover:bg-white/10" : "border-line hover:bg-card"}`;
  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${dark ? "bg-[#141413] text-[#faf9f5]" : "bg-bg text-ink"}`}>
        <div className="mx-auto grid h-[72px] max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 sm:px-8">
          <nav className="hidden items-center gap-2 lg:flex">
            {NAV.slice(0, 4).map(([t, id]) => <a key={id} href={`#${id}`} className={pill}>{t}</a>)}
          </nav>
          <span className="lg:hidden" />
          <a href="#top" aria-label="Kevin Matos" className="relative grid h-8 place-items-center">
            <AnimatePresence mode="popLayout" initial={false}>
              {compact ? (
                <motion.span key="km" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3, ease }} className="text-[24px] font-extrabold tracking-[-0.04em]">K\M</motion.span>
              ) : (
                <motion.span key="full" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} transition={{ duration: 0.3, ease }} className="whitespace-nowrap text-[20px] font-bold tracking-[0.14em] sm:text-[26px]">KEVIN MATOS</motion.span>
              )}
            </AnimatePresence>
          </a>
          <div className="flex items-center justify-end gap-2">
            {NAV.slice(4).map(([t, id]) => <a key={id} href={`#${id}`} className={`hidden xl:block ${pill}`}>{t}</a>)}
            <a href={LINKS.cv} target="_blank" rel="noreferrer" className={`hidden sm:block ${pill}`}>Download CV</a>
            <button onClick={() => setOpen(true)} className={`grid size-10 place-items-center rounded-xl border ${dark ? "border-white/15" : "border-line"}`} aria-label="Open menu">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h10" /></svg>
            </button>
          </div>
        </div>
      </header>
      <div className="h-[72px]" />
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex flex-col bg-bg px-6 pb-10 pt-5">
            <div className="flex items-center justify-between">
              <span className="text-[20px] font-bold tracking-[0.14em]">KEVIN MATOS</span>
              <button onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-xl border border-line" aria-label="Close menu">✕</button>
            </div>
            <nav className="mx-auto mt-12 flex w-full max-w-3xl flex-col">
              {NAV.map(([t, id], i) => (
                <motion.a key={id} href={`#${id}`} onClick={() => setOpen(false)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i, ease }} className="border-b border-line py-4 font-serif text-3xl sm:text-5xl">{t}</motion.a>
              ))}
            </nav>
            <a href={LINKS.cv} target="_blank" rel="noreferrer" className="mx-auto mt-auto w-full max-w-3xl rounded-full bg-ink py-4 text-center font-medium text-bg">Download CV</a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------- topo ---------- */

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const inset = useTransform(scrollYProgress, [0.25, 1], [6, 0]);
  const radius = useTransform(scrollYProgress, [0.25, 1], [24, 0]);
  const clip = useTransform([inset, radius], ([i, r]) => `inset(0 ${i}% round ${r}px)`);
  const c = CASES[0];
  return (
    <section id="top">
      <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-14 sm:px-8 sm:pt-20">
        <Reveal>
          <h1 className="max-w-[1250px] text-[34px] leading-[1.12] tracking-[-0.02em] sm:text-[56px]">
            <span className="font-bold">Full stack & AI engineer building software that ships.</span>{" "}
            <span className="font-serif">Production SaaS, LLM agents and 40+ websites for real clients. Relocating to Dublin in January 2027.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.1} className="mt-10 flex flex-wrap gap-3">
          <a href="#work" className="rounded-xl bg-ink px-6 py-3 text-[15px] font-medium text-bg transition-opacity hover:opacity-85">See my work</a>
          <a href={`mailto:${LINKS.email}`} className="rounded-xl border border-line px-6 py-3 text-[15px] font-medium transition-colors hover:bg-card">Get in touch</a>
        </Reveal>
      </div>
      <motion.div ref={ref} style={{ clipPath: clip }} className="relative h-[85vh] min-h-[520px] overflow-hidden bg-[#8a8070]">
        <video src={c.video} poster={c.desktop} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/60" />
        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <p className="font-serif text-[44px] leading-[1.02] tracking-[-0.02em] sm:text-[96px]">{c.name}</p>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/85 sm:text-[22px]">{c.kind}, live in production. Built and run with my business partner.</p>
          <div className="mt-8 flex gap-3">
            <a href={`#project/${c.id}`} className="rounded-xl bg-white px-6 py-3 text-[15px] font-medium text-ink">Read the case</a>
            <a href="#work" className="rounded-xl bg-black/50 px-6 py-3 text-[15px] font-medium text-white backdrop-blur">All projects</a>
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
  return (
    <Section id="work" eyebrow="Selected work" title="Products I built, run or sold." sub="Real clients, real users. Click any project for the architecture and the decisions behind it.">
      <div className="space-y-6">
        {CASES.map((c, i) => (
          <Reveal key={c.id}>
            <button onClick={() => onOpen(c.id)} className="group grid w-full items-center gap-8 rounded-[28px] bg-card p-5 text-left transition-colors hover:bg-card2 sm:p-8 md:grid-cols-[1fr_1.25fr] md:gap-12">
              <div className={i % 2 ? "md:order-2" : ""}>
                <p className="text-[13px] text-mute">{c.kind} · {c.year}</p>
                <h3 className="mt-2 font-serif text-[30px] leading-tight tracking-tight sm:text-[38px]">{c.name}</h3>
                <p className="mt-4 text-[16px] leading-relaxed text-mute">{c.lede}</p>
                <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
                  {c.metrics?.slice(0, 2).map(([n, l]) => (
                    <div key={l}><div className="font-serif text-2xl">{n}</div><div className="mt-0.5 max-w-[16ch] text-[13px] leading-snug text-mute">{l}</div></div>
                  ))}
                </div>
                <span className="mt-7 inline-flex items-center gap-1.5 text-[14px] font-medium">Read the case <Arrow className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
              </div>
              <div className="overflow-hidden rounded-2xl border border-line bg-bg">
                <img src={c.desktop} alt={c.name} loading="lazy" className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]" />
              </div>
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
        <p className="text-[34px] font-bold tracking-[0.12em] sm:text-[44px]">KEVIN MATOS</p>
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
