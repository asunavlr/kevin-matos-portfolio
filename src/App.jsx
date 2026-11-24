import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { Analytics } from "@vercel/analytics/react";
import { CASES, CERTS, JOBS, LINKS, NOTES, REPOS, SITES, STATS, TESTIMONIALS } from "./data";

const ease = [0.22, 1, 0.36, 1];
const W = "mx-auto max-w-[1280px] px-5 sm:px-10";
const ext = (href) => (href.startsWith("http") || href.endsWith(".pdf") ? { target: "_blank", rel: "noreferrer" } : {});

/* Trava o scroll da página por trás de menus e modais. */
function useLock(on) {
  useEffect(() => {
    if (!on) return;
    const el = document.documentElement;
    const prev = [el.style.overflow, document.body.style.overflow];
    el.style.overflow = document.body.style.overflow = "hidden";
    return () => { [el.style.overflow, document.body.style.overflow] = prev; };
  }, [on]);
}

function Reveal({ children, className = "", delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.6, ease, delay }} className={className}>
      {children}
    </motion.div>
  );
}

const Arrow = ({ className = "" }) => <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg>;
const Chev = ({ up, className = "" }) => <svg className={`transition-transform duration-200 ${up ? "rotate-180" : ""} ${className}`} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="m6 9 6 6 6-6" /></svg>;
/* KEVIN MA\OS: a barra entra no lugar do T. Compacto, as outras letras somem
   enquanto o K e a \ deslizam ao mesmo tempo para o meio, formando K\. */
function Wordmark({ compact = false, className = "" }) {
  const box = useRef(null);
  const k = useRef(null);
  const sl = useRef(null);
  const [dx, setDx] = useState([0, 0]);
  useEffect(() => {
    /* offsetLeft ignora o transform, então a medida vale mesmo no meio da animação. */
    const measure = () => {
      if (!box.current) return;
      const W = box.current.offsetWidth;
      const kl = k.current.offsetLeft, kw = k.current.offsetWidth;
      const sll = sl.current.offsetLeft, sw = sl.current.offsetWidth;
      const left = W / 2 - (kw + sw) / 2;
      setDx([left - kl, left + kw - sll]);
    };
    measure();
    document.fonts?.ready.then(measure);
    const t = setTimeout(measure, 800);
    addEventListener("resize", measure);
    return () => { clearTimeout(t); removeEventListener("resize", measure); };
  }, [compact]);
  const move = "inline-block transition-transform duration-[600ms] ease-[cubic-bezier(.65,0,.35,1)]";
  const fade = `inline-block whitespace-pre transition-opacity duration-300 ${compact ? "opacity-0" : "opacity-100 delay-200"}`;
  return (
    <span ref={box} className={`relative inline-flex whitespace-nowrap font-bold tracking-[0.07em] ${className}`}>
      <span ref={k} className={move} style={{ transform: `translateX(${compact ? dx[0] : 0}px)` }}>K</span>
      <span className={fade}>EVIN MA</span>
      <span ref={sl} className={move} style={{ transform: `translateX(${compact ? dx[1] : 0}px)` }}>{"\\"}</span>
      <span className={fade}>OS</span>
    </span>
  );
}

/* ---------- navegação ---------- */

const MENUS = [
  ["Work", [["Products", CASES.map((c) => [c.name, `#project/${c.id}`])], ["Open source", REPOS.slice(0, 5).map((r) => [r.name, `${LINKS.github}/${r.name}`])]]],
  ["Clients", [["Client sites", SITES.slice(0, 6).map((x) => [x.name, x.url])], ["More", [["All client sites", "#clients"], ["Client feedback", "#feedback"], ["Comply studio", LINKS.studio]]]]],
  ["About", [["Career", [["Experience", "#experience"], ["Certifications", "#certs"], ["Engineering notes", "#notes"]]], ["Contact", [["Email", `mailto:${LINKS.email}`], ["LinkedIn", LINKS.linkedin], ["GitHub", LINKS.github]]]]],
];

function Search({ onClose }) {
  const [q, setQ] = useState("");
  useLock(true);
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
      <motion.div initial={{ y: -8 }} animate={{ y: 0 }} onClick={(e) => e.stopPropagation()} className="mx-auto max-w-lg overflow-hidden rounded-xl border border-line bg-bg shadow-2xl">
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects, clients, certificates" className="w-full border-b border-line bg-transparent px-4 py-3.5 text-[15px] outline-none" />
        <ul className="max-h-[50vh] overflow-y-auto p-1.5">
          {hits.map(([k, t, href]) => (
            <li key={k + t}><a href={href} onClick={onClose} {...ext(href)} className="flex items-baseline justify-between gap-4 rounded-lg px-3 py-2 text-[14px] hover:bg-card"><span>{t}</span><span className="shrink-0 text-[12px] text-mute">{k}</span></a></li>
          ))}
          {!hits.length && <li className="px-3 py-6 text-center text-[14px] text-mute">Nothing found.</li>}
        </ul>
      </motion.div>
    </motion.div>
  );
}

/* Menu cheio, escuro, como o da referência: duas colunas que rolam separadas.
   À esquerda, os projetos num feed que nunca acaba; à direita, a navegação. */
function FullMenu({ onClose }) {
  const [sub, setSub] = useState(null);
  const [laps, setLaps] = useState(2);
  useLock(true);
  useEffect(() => {
    const k = (e) => e.key === "Escape" && onClose();
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [onClose]);
  const feed = Array.from({ length: laps }, (_, lap) => [...CASES, STUDIO].map((c) => [lap, c])).flat();
  const more = (e) => {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight > el.scrollHeight - 600) setLaps((n) => n + 1);
  };
  const rows = [
    ["Open source", REPOS.map((r) => [r.name, `${LINKS.github}/${r.name}`])],
    ["Experience", JOBS.map((j) => [j.co, "#experience"])],
    ["Certifications", CERTS.map((c) => [c.name, c.verify || c.url])],
    ["Client sites", SITES.map((x) => [x.name, x.url])],
  ];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="fixed inset-0 z-[70] bg-[#141413] text-[#faf9f5]">
      <div className={`${W} grid h-full lg:grid-cols-2 lg:gap-16`}>
        <div onScroll={more} className="hidden overflow-y-auto overscroll-contain py-10 [scrollbar-width:none] lg:block">
          {feed.map(([lap, c], i) => {
            const wide = i % 3 === 2;
            return (
              <a key={`${lap}-${c.id}`} href={c.id === "comply" ? c.url : `#project/${c.id}`} {...(c.id === "comply" ? ext(c.url) : {})} onClick={onClose} className={`group mb-20 block ${wide ? "w-full" : "max-w-[300px]"}`}>
                <p className="flex gap-4 text-[13px] text-white/45"><span>{c.kind}</span><span>{c.year}</span></p>
                <img src={`/kevin/shots/card-${c.id}.jpg`} alt="" loading="lazy" className={`mt-3 w-full object-cover transition-opacity group-hover:opacity-70 ${wide ? "aspect-[16/9]" : "aspect-square"}`} style={{ objectPosition: wide ? "left top" : POS[c.id] }} />
                <p className="mt-4 max-w-[300px] text-[17px] font-semibold leading-snug">{c.name}</p>
              </a>
            );
          })}
        </div>
        <div className="flex flex-col overflow-y-auto overscroll-contain pb-10">
          <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between bg-[#141413] lg:justify-end">
            <Wordmark className="text-[17px] lg:hidden" />
            <button onClick={onClose} className="grid size-9 place-items-center rounded-lg border border-white/20 hover:border-white/50" aria-label="Close menu">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
          </div>
          <nav className="pt-10">
            <a href="#top" onClick={onClose} className="block py-1.5 text-[34px] font-semibold sm:text-[40px]">Home</a>
            {MENUS.map(([t, cols]) => (
              <div key={t}>
                <button onClick={() => setSub(sub === t ? null : t)} className={`flex items-center gap-4 py-1.5 text-[34px] font-semibold transition-colors sm:text-[40px] ${sub === t ? "text-white" : "text-white/45 hover:text-white"}`}>{t}<Chev up={sub === t} className="size-4" /></button>
                <AnimatePresence initial={false}>
                  {sub === t && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }} className="overflow-hidden">
                      <div className="grid grid-cols-2 gap-6 pb-5 pt-2">
                        {cols.map(([h, items]) => (
                          <ul key={h} className="space-y-2.5">
                            {items.map(([l, href]) => <li key={l}><a href={href} onClick={onClose} {...ext(href)} className="text-[15px] text-white/60 hover:text-white">{l}</a></li>)}
                          </ul>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            {[["Certifications", "#certs"], ["Contact", "#contact"]].map(([t, h]) => <a key={t} href={h} onClick={onClose} className="block py-1.5 text-[34px] font-semibold text-white/45 hover:text-white sm:text-[40px]">{t}</a>)}
          </nav>
          <div className="mt-24 border-b border-white/15">{rows.map(([t, items]) => <FootRow key={t} title={t} items={items} />)}</div>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a href={LINKS.cv} target="_blank" rel="noreferrer" className="rounded-lg border border-white/20 px-4 py-2 text-[14px] hover:border-white/50">Download CV</a>
            <a href={`mailto:${LINKS.email}`} className="rounded-lg border border-white/20 px-4 py-2 text-[14px] hover:border-white/50">Email me →</a>
            <span className="ml-auto flex gap-5 text-[14px] text-white/60">
              <a href={LINKS.github} target="_blank" rel="noreferrer" className="hover:text-white">GitHub</a>
              <a href={LINKS.linkedin} target="_blank" rel="noreferrer" className="hover:text-white">LinkedIn</a>
            </span>
          </div>
        </div>
      </div>
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
      setCompact(scrollY > 40);
      const f = document.getElementById("footer");
      setDark(!!f && f.getBoundingClientRect().top < 64);
    };
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  const line = dark ? "border-white/15 hover:border-white/40" : "border-line hover:border-ink/25";
  const pill = (on) => `flex items-center gap-1.5 rounded-full border px-3.5 py-[5px] text-[13.5px] transition-colors duration-200 ${on ? (dark ? "border-white bg-white text-ink" : "border-ink bg-ink text-bg") : line}`;
  return (
    <>
      <header onMouseLeave={() => setMenu(null)} className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${dark ? "bg-[#141413] text-[#faf9f5]" : "bg-bg text-ink"}`}>
        <div className={`${W} grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4`}>
          <nav className="hidden items-center gap-1.5 lg:flex">
            {MENUS.map(([t]) => <button key={t} onMouseEnter={() => setMenu(t)} onClick={() => setMenu(menu === t ? null : t)} className={pill(menu === t)}>{t}<Chev up={menu === t} /></button>)}
            <a href="#certs" onMouseEnter={() => setMenu(null)} className={pill(false)}>Certifications</a>
          </nav>
          <span className="lg:hidden" />
          <a href="#top" aria-label="Kevin Matos" className="relative grid h-7 w-[170px] place-items-center">
            <Wordmark compact={compact} className="text-[19px]" />
          </a>
          <div className="flex items-center justify-end gap-1.5">
            <a href={LINKS.cv} target="_blank" rel="noreferrer" onMouseEnter={() => setMenu(null)} className={`hidden sm:flex ${pill(false)}`}>Download CV</a>
            <button onClick={() => setSearch(true)} className={`grid size-8 place-items-center rounded-full border transition-colors ${line}`} aria-label="Search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            </button>
            <button onClick={() => setOpen(true)} className={`grid size-8 place-items-center rounded-lg border transition-colors ${line}`} aria-label="Open menu">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h10" /></svg>
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menu && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18, ease }} className="absolute left-1/2 top-[56px] hidden w-[1280px] max-w-full -translate-x-1/2 px-5 sm:px-10 lg:block">
              <div className="w-[440px] rounded-xl border border-line bg-bg p-5 text-ink shadow-[0_16px_40px_rgba(0,0,0,.07)]">
                <div className="grid grid-cols-2 gap-8">
                  {MENUS.find((m) => m[0] === menu)[1].map(([h, items]) => (
                    <div key={h}>
                      <p className="text-[13px] text-mute">{h}</p>
                      <ul className="mt-2.5 space-y-2">
                        {items.map(([t, href]) => <li key={t}><a href={href} onClick={() => setMenu(null)} {...ext(href)} className="text-[14px] hover:text-clay">{t}</a></li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <div className="h-16" />
      <AnimatePresence>{search && <Search onClose={() => setSearch(false)} />}</AnimatePresence>
      <AnimatePresence>{open && <FullMenu onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}

/* ---------- topo ---------- */

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const inset = useTransform(scrollYProgress, [0.3, 1], [5, 0]);
  const clip = useTransform(inset, (i) => `inset(0 ${i}% round ${i * 2}px)`);
  return (
    <section id="top">
      <div className={`${W} pb-14 pt-12 sm:pt-16`}>
        <Reveal>
          <h1 className="w-fit max-w-[1100px] text-[26px] leading-[1.22] tracking-[-0.015em] sm:text-[34px]">
            <span className="font-semibold">Full stack & AI engineer building software that ships.</span>{" "}
            <span className="font-serif text-[1.06em]">Production SaaS, LLM agents and 40+ websites for real clients, end to end: architecture, databases, APIs and deployment. Relocating to Dublin in January 2027.</span>
          </h1>
        </Reveal>
      </div>
      <motion.div ref={ref} style={{ clipPath: clip }} className="relative h-[78vh] min-h-[460px] select-none overflow-hidden bg-[#6b7280]">
        <img src="/kevin/shots/dublin.jpg" alt="The River Liffey and the Ha'penny Bridge, Dublin" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/55" />
        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <p className="font-serif text-[44px] leading-[1.02] tracking-[-0.02em] sm:text-[76px]">Next stop,<br /><span className="sm:ml-[1.4em]">Dublin</span></p>
          <p className="mt-6 max-w-md text-[16px] leading-relaxed text-white/90 sm:text-[18px]">Arriving January 2027 and looking for a full stack or AI engineering team to join.</p>
          <div className="mt-7 flex gap-2.5">
            <a href="#work" className="rounded-lg bg-white px-5 py-2.5 text-[14px] font-medium text-ink">See my work</a>
            <a href={`mailto:${LINKS.email}`} className="rounded-lg bg-ink px-5 py-2.5 text-[14px] font-medium text-white">Get in touch</a>
          </div>
        </div>
        <span className="absolute bottom-3 right-4 text-[11px] text-white/60">Photo: P. Hughes, CC BY 4.0</span>
      </motion.div>
      <div className={`${W} mt-16 grid grid-cols-2 gap-y-8 sm:mt-20 sm:grid-cols-4`}>
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.04} className={`py-2 pr-5 ${i ? "sm:border-l sm:border-line sm:pl-6" : ""}`}>
            <div className="font-serif text-[32px] leading-none">{s.prefix}{s.n}{s.suffix}</div>
            <p className="mt-2 text-[13px] leading-snug text-mute">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Section({ id, eyebrow, title, sub, children }) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className={`${W} py-16 sm:py-20`}>
        <div className="border-t border-line pt-8">
          <Reveal>
            <p className="text-[13.5px] text-mute">{eyebrow}</p>
            <h2 className="mt-2 font-serif text-[28px] leading-[1.15] sm:text-[34px]">{title}</h2>
            {sub && <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-mute">{sub}</p>}
          </Reveal>
          <div className="mt-10">{children}</div>
        </div>
      </div>
    </section>
  );
}

/* ---------- projetos: cards editoriais, os outros esmaecem no hover ---------- */

/* Que parte de cada print aparece no recorte vertical. */
const POS = { avodah: "22% center", goias: "18% top", agro: "50% top", farm: "70% center", school: "75% center", prospect: "50% center", corvus: "20% center", comply: "18% center" };
/* A Comply entra como último card, levando para o site do estúdio. */
const STUDIO = { id: "comply", name: "Comply", kind: "Studio", year: "2026", lede: "My studio: custom web apps, internal systems and 40+ websites for business clients.", url: LINKS.studio };

function Work({ onOpen }) {
  return (
    <Section id="work" eyebrow="Selected work" title="Products I built, run or sold." sub="Real clients, real users. Open any project for the architecture and the decisions behind it.">
      <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {[...CASES, STUDIO].map((c, i) => (
          <Reveal key={c.id} delay={(i % 4) * 0.05}>
            <button onClick={() => (c.id === "comply" ? open(c.url, "_blank") : onOpen(c.id))} className="block w-full text-left transition-opacity duration-300 hover:opacity-55">
              <p className="flex items-center gap-2.5 text-[13px] text-mute"><span className="rounded-full bg-card px-2 leading-5 tracking-widest">···</span>{c.kind}</p>
              <img src={`/kevin/shots/card-${c.id}.jpg`} alt={c.name} loading="lazy" className="mt-3 aspect-[4/5] w-full object-cover" style={{ objectPosition: POS[c.id] ?? "left top" }} />
              <h3 className="mt-4 text-[18px] font-semibold leading-snug">{c.name}</h3>
              <p className="mt-1.5 line-clamp-3 text-[14px] leading-relaxed text-mute">{c.lede}</p>
            </button>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function CaseModal({ id, onClose }) {
  const c = CASES.find((x) => x.id === id);
  useLock(!!c);
  useEffect(() => {
    if (!c) return;
    const k = (e) => e.key === "Escape" && onClose();
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [c, onClose]);
  return (
    <AnimatePresence>
      {c && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[75] overflow-y-auto overscroll-contain bg-ink/30 backdrop-blur-sm" onClick={onClose}>
          <motion.article initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} transition={{ duration: 0.4, ease }} onClick={(e) => e.stopPropagation()} className="mx-auto min-h-full max-w-3xl bg-bg px-6 pb-14 sm:my-10 sm:min-h-0 sm:rounded-2xl sm:px-10">
            <div className="sticky top-0 -mx-6 flex justify-end bg-bg/90 px-6 py-3 backdrop-blur sm:-mx-10 sm:px-10">
              <button onClick={onClose} className="grid size-8 place-items-center rounded-lg border border-line" aria-label="Close">✕</button>
            </div>
            <p className="text-[13px] text-mute">{c.kind} · {c.year} · {c.badge}</p>
            <h2 className="mt-1 font-serif text-[34px] leading-tight sm:text-[42px]">{c.name}</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-mute">{c.lede}</p>
            {c.url && <a href={c.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-[13.5px] font-medium text-bg">Visit live <Arrow /></a>}
            <div className="mt-8 overflow-hidden rounded-xl border border-line">
              {c.video ? <video src={c.video} poster={c.desktop} autoPlay muted loop playsInline className="w-full" /> : <img src={c.desktop} alt={c.name} className="w-full" />}
            </div>
            {c.metrics && (
              <div className="mt-8 grid gap-5 border-y border-line py-6 sm:grid-cols-3">
                {c.metrics.map(([n, l]) => <div key={l}><div className="font-serif text-[26px]">{n}</div><p className="mt-1 text-[13px] text-mute">{l}</p></div>)}
              </div>
            )}
            <h3 className="mt-8 text-[17px] font-semibold">What I built</h3>
            <dl className="mt-3 divide-y divide-line text-[15px]">
              {c.points.map(([k, v]) => <div key={k} className="grid gap-1 py-3 sm:grid-cols-[160px_1fr]"><dt className="font-medium">{k}</dt><dd className="text-mute">{v}</dd></div>)}
            </dl>
            {c.gallery && <div className="mt-8 grid gap-3 sm:grid-cols-2">{c.gallery.map((g) => <img key={g} src={g} alt="" loading="lazy" className="rounded-lg border border-line" />)}</div>}
            <blockquote className="mt-8 border-l-2 border-clay pl-4 font-serif text-[19px] leading-snug">{c.meaning}</blockquote>
            <div className="mt-6 flex flex-wrap gap-1.5">{c.tags?.map((t) => <span key={t} className="rounded-full border border-line px-2.5 py-0.5 text-[12.5px] text-mute">{t}</span>)}</div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- sites de clientes ---------- */

function Clients() {
  const [all, setAll] = useState(false);
  const list = all ? SITES : SITES.slice(0, 6);
  return (
    <Section id="clients" eyebrow="Client sites · Comply studio" title="40+ websites for real businesses." sub="Through my studio, Comply. A few of them.">
      <div className="grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => {
          const fb = TESTIMONIALS.find((t) => t[3] === s.name);
          return (
            <a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="group block">
              <img src={s.shot} alt={s.name} loading="lazy" className="aspect-[16/10] w-full border border-line object-cover object-top" />
              <div className="mt-3 flex items-baseline justify-between gap-3">
                <h3 className="text-[15px] font-semibold group-hover:underline group-hover:underline-offset-4">{s.name}</h3>
                <Arrow className="shrink-0 text-mute" />
              </div>
              <p className="text-[13.5px] text-mute">{s.what}</p>
              {fb && <p className="mt-2 font-serif text-[15px] italic leading-snug">“{fb[0]}”</p>}
            </a>
          );
        })}
      </div>
      {SITES.length > 6 && (
        <div className="mt-10 flex justify-center"><button onClick={() => setAll(!all)} className="rounded-full border border-line px-4 py-1.5 text-[13.5px] hover:border-ink/25">{all ? "Show less" : `Show all ${SITES.length} sites`}</button></div>
      )}
    </Section>
  );
}

function Feedback() {
  return (
    <Section id="feedback" eyebrow="Client feedback" title="What clients said.">
      <div className="grid gap-x-5 gap-y-10 md:grid-cols-3">
        {TESTIMONIALS.map(([q, name, role, project]) => {
          const site = SITES.find((x) => x.name === project);
          return (
            <Reveal key={q}>
              <a href={site?.url} target="_blank" rel="noreferrer" className="group block">
                {site && <img src={site.shot} alt={project} loading="lazy" className="aspect-[4/3] w-full object-cover object-top transition-opacity group-hover:opacity-80" />}
                <p className="mt-5 font-serif text-[22px] leading-snug">“{q}”</p>
                <p className="mt-3 text-[13px] text-mute">{name} · {role}</p>
              </a>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

/* ---------- listas: open source, experiência, certificações, notas ---------- */

function Code() {
  return (
    <Section id="code" eyebrow="Open source" title="The engineering, in public." sub="Small, focused repos with tests, each one proving a specific skill.">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {REPOS.map((r) => (
          <Reveal key={r.name}>
            <a href={`${LINKS.github}/${r.name}`} target="_blank" rel="noreferrer" className="group flex h-full flex-col bg-card p-5 transition-colors hover:bg-card2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-mono text-[13.5px]"><span className="size-2 rounded-full" style={{ background: r.color }} />{r.name}</span>
                <span className="text-[12px] text-mute">{r.lang}</span>
              </div>
              <p className="mt-3 text-[14px] leading-relaxed text-mute">{r.desc}</p>
              <pre className="mt-4 max-h-[150px] overflow-hidden bg-[#141413] p-4 font-mono text-[11.5px] leading-relaxed text-[#e8e6dc] [mask-image:linear-gradient(to_bottom,black_70%,transparent)]">{r.code}</pre>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-4">{r.proof.map((x) => <span key={x} className="rounded-full border border-line px-2.5 py-0.5 text-[12px] text-mute">{x}</span>)}</div>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* Print de cada trabalho, quando tem. */
const JOB_SHOT = { "Goiás Direto": "card-goias", "Avodah Optical": "card-avodah", "Comply (comply.website)": "card-comply", Pujante: "card-agro", "Agrios / MeuAT": "card-farm" };

function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title="Where I've worked.">
      <ol className="relative">
        <span className="absolute bottom-2 left-[5px] top-2 w-px bg-line md:left-[calc(200px+5px)]" />
        {JOBS.map((j) => (
          <Reveal key={j.co}>
            <li className="relative grid gap-2 pb-14 pl-8 md:grid-cols-[200px_1fr] md:gap-0 md:pl-0">
              <p className="pt-0.5 text-[13px] text-mute md:pr-8 md:text-right">{j.when}</p>
              <span className="absolute left-0 top-[7px] size-[11px] rounded-full border-2 border-bg bg-ink md:left-[200px]" />
              <div className="md:pl-10">
                <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
                  <div>
                    <h3 className="text-[17px] font-semibold">{j.co}</h3>
                    <p className="text-[14px] text-mute">{j.role}{j.via ? ` · ${j.via}` : ""}</p>
                    <ul className="mt-3 space-y-1.5">
                      {j.pts.map((p) => <li key={p} className="text-[14.5px] leading-relaxed text-mute">{p}</li>)}
                    </ul>
                  </div>
                  {JOB_SHOT[j.co] && <img src={`/kevin/shots/${JOB_SHOT[j.co]}.jpg`} alt="" loading="lazy" className="hidden aspect-[4/3] w-full object-cover object-left-top lg:block" />}
                </div>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
      <a href={LINKS.cv} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-1.5 text-[13.5px] hover:border-ink/25 md:ml-[240px]">Download the full CV <Arrow /></a>
    </Section>
  );
}

function Certs() {
  const [open, setOpen] = useState(null);
  useLock(!!open);
  return (
    <Section id="certs" eyebrow="Certifications & languages" title="Always learning, with proof." sub="Every certificate links to its public verification page.">
      <div className="mb-10 grid gap-4 sm:grid-cols-2">
        {[["English", "C2 Proficient", "EF SET 80/100 · Reading 76, Listening 84", "https://cert.efset.org/en/tiiCCp"], ["Portuguese", "Native", "Brazilian", null]].map(([l, lvl, note, href]) => (
          <div key={l} className="bg-card p-5">
            <p className="text-[13px] text-mute">{l}</p>
            <p className="mt-1 font-serif text-[26px] leading-tight">{lvl}</p>
            <p className="mt-1 text-[13.5px] text-mute">{note}</p>
            {href && <a href={href} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-[13.5px] font-medium">Verify <Arrow /></a>}
          </div>
        ))}
      </div>
      <div className="divide-y divide-line border-y border-line">
        {CERTS.map((c) => (
          <div key={c.name} className="grid items-baseline gap-1 py-4 sm:grid-cols-[160px_1fr_auto] sm:gap-8">
            <p className="text-[13px] text-mute">{c.org}</p>
            <div>
              <button onClick={() => setOpen(c)} className="text-left text-[15px] font-medium hover:underline hover:underline-offset-4">{c.name}</button>
              <p className="mt-0.5 text-[13.5px] leading-relaxed text-mute">{c.note}</p>
            </div>
            <div className="flex gap-4 text-[13px]">
              <span className="text-mute">{c.date}</span>
              {c.verify && <a href={c.verify} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium">Verify <Arrow /></a>}
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)} className="fixed inset-0 z-[75] grid place-items-center bg-ink/40 p-4 backdrop-blur-sm">
            <img src={open.img} alt={open.name} className="max-h-[85vh] max-w-full rounded-lg shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}

function Notes() {
  const [open, setOpen] = useState(null);
  return (
    <Section id="notes" eyebrow="Engineering notes" title="Short write-ups from real projects.">
      <div className="divide-y divide-line border-y border-line">
        {NOTES.map((n) => {
          const on = open === n.slug;
          return (
            <div key={n.slug}>
              <button onClick={() => setOpen(on ? null : n.slug)} className="grid w-full gap-1 py-5 text-left md:grid-cols-[200px_1fr_auto] md:gap-8">
                <p className="text-[13px] text-mute">{n.project} · {n.read}</p>
                <div><h3 className="text-[16px] font-semibold">{n.title}</h3><p className="mt-1 text-[14.5px] leading-relaxed text-mute">{n.tldr}</p></div>
                <Chev up={on} className="hidden size-3 text-mute md:block" />
              </button>
              <AnimatePresence initial={false}>
                {on && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease }} className="overflow-hidden">
                    <div className="max-w-2xl space-y-3 pb-8 text-[14.5px] leading-relaxed text-mute md:ml-[232px]">
                      {n.body?.map((p) => <p key={p}>{p}</p>)}
                      {n.code && <pre className="overflow-x-auto bg-card p-4 font-mono text-[12.5px] leading-relaxed text-ink">{n.code}</pre>}
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

/* ---------- contato e footer ---------- */

function Contact() {
  return (
    <section id="contact" className={`${W} pb-24 pt-10`}>
      <div className="border-t border-line pt-14">
        <Reveal>
          <h2 className="max-w-3xl text-[26px] leading-[1.22] tracking-[-0.015em] sm:text-[34px]"><span className="font-semibold">Let's build something together.</span> <span className="font-serif text-[1.06em]">I reply within a day.</span></h2>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <a href={`mailto:${LINKS.email}`} className="rounded-lg bg-ink px-5 py-2.5 text-[14px] font-medium text-bg hover:opacity-85">{LINKS.email}</a>
            <a href={LINKS.cv} target="_blank" rel="noreferrer" className="rounded-lg border border-line px-5 py-2.5 text-[14px] font-medium hover:border-ink/25">Download CV</a>
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
      <button onClick={() => setOn(!on)} className={`flex w-full items-center justify-between py-5 text-left text-[16px] transition-colors ${on ? "text-white" : "text-white/55 hover:text-white"}`}>{title}<Chev up={on} className="size-3" /></button>
      <AnimatePresence initial={false}>
        {on && (
          <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }} className="grid overflow-hidden pb-3 sm:grid-cols-2">
            {items.map(([t, href]) => <li key={t}><a href={href} {...ext(href)} className="block py-1.5 text-[14px] text-white/70 hover:text-white">{t}</a></li>)}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function FootMark() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 30%", "start 0%"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  return <motion.p ref={ref} style={{ opacity }} className="self-start text-[28px] sm:text-[34px]"><Wordmark /></motion.p>;
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
    <footer id="footer" className="flex min-h-[100svh] flex-col justify-between bg-[#141413] pt-16 text-[#faf9f5]">
      <div className={`${W} grid w-full gap-10 pb-10 pt-10 lg:grid-cols-[1fr_1.7fr]`}>
        <FootMark />
        <div className="border-b border-white/15">{rows.map(([t, items]) => <FootRow key={t} title={t} items={items} />)}</div>
      </div>
      <div className={`${W} grid w-full gap-8 pb-14 pt-6 text-[14px] lg:grid-cols-[1fr_1fr_0.8fr]`}>
        <div className="flex flex-col justify-end gap-4 text-white/55">
          <span>© 2026 Kevin Matos</span>
          <div className="flex gap-5">
            <a href={LINKS.github} target="_blank" rel="noreferrer" className="hover:text-white">GitHub</a>
            <a href={LINKS.linkedin} target="_blank" rel="noreferrer" className="hover:text-white">LinkedIn</a>
            <a href={`mailto:${LINKS.email}`} className="hover:text-white">Email</a>
          </div>
        </div>
        <div>
          <p className="text-white">About</p>
          <p className="mt-1.5 leading-relaxed text-white/55">Full stack and AI engineer from Brazil, founder of the Comply studio. Moving to Dublin in January 2027 to join a team that ships.</p>
        </div>
        <div className="flex flex-col gap-2.5">
          <p className="text-white">Elsewhere</p>
          <a href={LINKS.studio} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white">Comply studio <Arrow /></a>
          <a href={LINKS.cv} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white">CV (PDF) <Arrow /></a>
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
