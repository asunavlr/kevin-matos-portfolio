import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useScroll, useTransform } from "motion/react";
import { Analytics } from "@vercel/analytics/react";
import { RUNNERS } from "./runners";
import { CASES, CERTS, JOBS, LINKS, NOTES, REPOS, SITES, STATS, TESTIMONIALS } from "./data";

const ease = [0.22, 1, 0.36, 1];
const W = "mx-auto max-w-[1440px] px-5 sm:px-[68px]";
const ext = (href) => (href.startsWith("http") || href.endsWith(".pdf") ? { target: "_blank", rel: "noreferrer" } : {});

/* Trava o scroll da página por trás de menus e modais. */
/* Trava a rolagem da página sem mexer em overflow: assim a barra de rolagem do Chrome
   não some e volta (era isso que fazia a tela piscar ao abrir menus e modais).
   Só rola o que estiver dentro de um elemento com data-scroll. */
let locks = 0;
const block = (e) => { if (!e.target.closest?.("[data-scroll]")) e.preventDefault(); };
function useLock(on) {
  useEffect(() => {
    if (!on) return;
    if (!locks++) {
      addEventListener("wheel", block, { passive: false });
      addEventListener("touchmove", block, { passive: false });
    }
    return () => {
      if (!--locks) {
        removeEventListener("wheel", block);
        removeEventListener("touchmove", block);
      }
    };
  }, [on]);
}

function Reveal({ children, className = "", delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -60px 0px" }} transition={{ duration: 0.8, ease, delay }} className={className}>
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
      const fs = parseFloat(getComputedStyle(box.current).fontSize);
      const fit = kw - fs * 0.08; /* tira o tracking do K e aproxima a \\ */
      const left = W / 2 - (fit + sw) / 2;
      const next = [Math.round(left - kl), Math.round(left + fit - sll)];
      setDx((d) => (d[0] === next[0] && d[1] === next[1] ? d : next));
    };
    measure();
    document.fonts?.ready.then(measure);
    const t = setTimeout(measure, 800);
    addEventListener("resize", measure);
    return () => { clearTimeout(t); removeEventListener("resize", measure); };
  }, []);
  /* Recolhendo: o K anda até o centro empurrando "EVIN MA", que some no caminho;
     o "OS" some logo, e só então a \ desliza e encaixa no K. Abrindo: o contrário. */
  const ez = "ease-[cubic-bezier(.45,0,.2,1)]";
  /* A \\ segue o K: é empurrada junto e, na reta final, desliza para encaixar,
     chegando no centro no mesmo instante que ele. */
  const kx = useMotionValue(0);
  const dir = useRef(compact);
  dir.current = compact;
  const dxr = useRef(dx);
  dxr.current = dx;
  useEffect(() => {
    const c = animate(kx, compact ? dx[0] : 0, { duration: 0.8, ease: [0.45, 0, 0.2, 1] });
    return () => c.stop();
  }, [compact, dx, kx]);
  /* Na volta, a \\ só acompanha o K em linha reta até o lugar dela, sem passar por cima do "OS". */
  const slx = useTransform(kx, (v) => {
    const dx = dxr.current;
    if (!dx[0]) return 0;
    const p = Math.min(1, Math.max(0, v / dx[0]));
    return dx[1] * p; /* ida e volta: a \\ anda em linha reta, no ritmo do K */
    const t = Math.min(1, Math.max(0, (p - 0.7) / 0.3));
    const q = t * t * (3 - 2 * t);
    return v * (1 - q) + dx[1] * q;
  });
  const kMove = `inline-block transition-transform duration-[350ms] ${ez} ${compact ? "" : "delay-100"}`;
  const slMove = `inline-block transition-transform duration-500 ${ez} ${compact ? "delay-[300ms]" : ""}`;
  const pushed = `inline-block whitespace-pre transition-[transform,opacity] [transition-duration:800ms,250ms] ${ez} ${compact ? "opacity-0" : "opacity-100 [transition-delay:0ms,450ms]"}`;
  const fade = `inline-block whitespace-pre transition-opacity ${compact ? "opacity-0 duration-200" : "opacity-100 duration-200 delay-300"}`;
  return (
    <span ref={box} className={`relative inline-flex whitespace-nowrap font-bold tracking-[0.07em] ${className}`}>
      <motion.span ref={k} className="inline-block" style={{ x: kx }}>K</motion.span>
      <span className={pushed} style={{ transform: `translateX(${compact ? dx[0] : 0}px)` }}>EVIN MA</span>
      {/* A \ é empurrada junto com o K e depois volta para encaixar nele. */}
      <motion.span
        ref={sl}
        className="inline-block"
        style={{ x: slx }}
      >{"\\"}</motion.span>
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

/* Mosaico circular de miniaturas dos trabalhos, numa imagem só (leve), girando devagar. */
if (typeof window !== "undefined") addEventListener("load", () => setTimeout(() => { new Image().src = "/kevin/shots/mosaic.png"; }, 1500));

const TOP = ["Avodah SAC", "Goiás Direto", "AgroPujante", "RAG", "Go", "Anthropic", "English C2"];

function Search({ q, onClose }) {
  useLock(true);
  const all = [
    ...CASES.map((c) => ["Project", c.name, `#project/${c.id}`, c.lede]),
    ...SITES.map((x) => ["Client site", x.name, x.url, x.what]),
    ...REPOS.map((r) => ["Open source", r.name, `${LINKS.github}/${r.name}`, `${r.lang} · ${r.desc}`]),
    ...CERTS.map((c) => ["Certificate", c.name, c.verify || c.url, c.org]),
    ...NOTES.map((n) => ["Note", n.title, "#notes", n.tldr]),
  ];
  const term = q.trim().toLowerCase();
  const hits = term ? all.filter((h) => `${h[1]} ${h[3]} ${h[0]}`.toLowerCase().includes(term)).slice(0, 10) : [];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} data-scroll id="search-scroll" className="fixed inset-0 z-40 overflow-y-auto bg-bg pt-[84px]">
      <div className={`${W} grid min-h-[calc(100svh-84px)] items-center gap-10 py-10 lg:grid-cols-[1fr_340px]`}>
        <div className="relative mx-auto hidden aspect-square w-full max-w-[440px] lg:block">
          <img src="/kevin/shots/mosaic.png" alt="" className="absolute inset-0 h-full w-full animate-[spin_240s_linear_infinite,reveal_1.1s_ease-out_both]" />
        </div>
        <div>
          {!term ? (
            <>
              <p className="text-[16px] font-semibold">Top searches</p>
              <div className="mt-4 flex flex-col items-start gap-2">
                {TOP.map((t) => <span key={t} data-top={t} className="cursor-pointer rounded-full border border-line bg-card px-3.5 py-1 text-[13px] hover:bg-card2">{t}</span>)}
              </div>
            </>
          ) : (
            <>
              <p className="text-[13px] text-mute">{hits.length ? `${hits.length} results` : "Nothing found."}</p>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {hits.map(([k, t, href, sub]) => (
                  <li key={k + t}>
                    <a href={href} onClick={onClose} {...ext(href)} className="block py-3.5 hover:opacity-70">
                      <span className="flex items-baseline justify-between gap-4"><span className="text-[15px] font-medium">{t}</span><span className="shrink-0 text-[12px] text-mute">{k}</span></span>
                      {sub && <span className="mt-0.5 line-clamp-1 block text-[13px] text-mute">{sub}</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
      <Footer inSearch />
    </motion.div>
  );
}

/* Menu cheio, escuro, como o da referência: duas colunas que rolam separadas.
   À esquerda, os projetos num feed que nunca acaba; à direita, a navegação. */
function FullMenu({ onClose, closing = false }) {
  const [sub, setSub] = useState(null);
  /* Três cópias do feed; o scroll começa na do meio e, ao chegar perto de uma ponta,
     pula uma volta inteira sem que dê para perceber. Assim rola infinito para os dois lados. */
  const feedRef = useRef(null);
  const laps = 3;
  useEffect(() => {
    const el = feedRef.current;
    if (el) el.scrollTop = el.scrollHeight / 3;
  }, []);
  useLock(true);
  useEffect(() => {
    const k = (e) => e.key === "Escape" && onClose();
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [onClose]);
  const feed = Array.from({ length: laps }, (_, lap) => [...CASES, STUDIO].map((c) => [lap, c])).flat();
  const more = (e) => {
    const el = e.currentTarget;
    const lap = el.scrollHeight / 3;
    if (el.scrollTop < lap * 0.5) el.scrollTop += lap;
    else if (el.scrollTop > lap * 1.5) el.scrollTop -= lap;
  };
  const rows = [
    ["Open source", REPOS.map((r) => [r.name, `${LINKS.github}/${r.name}`])],
    ["Experience", JOBS.map((j) => [j.co, "#experience"])],
    ["Certifications", CERTS.map((c) => [c.name, c.verify || c.url])],
    ["Client sites", SITES.map((x) => [x.name, x.url])],
  ];
  return (
    <motion.div
      /* Entrada por CSS e camada fixa (will-change): o Chrome não recompõe a tela no fim do fade, que era o que piscava. */
      className={`fixed inset-0 z-[70] ${closing ? "animate-[fadeout_.2s_ease-in_both]" : "animate-[fadein_.25s_ease-out_both]"} bg-[#141413] text-[#faf9f5] will-change-[opacity]`}
    >
      <div className={`${W} grid h-full grid-cols-1 overflow-hidden lg:grid-cols-2 lg:gap-16`}>
        <div data-scroll ref={feedRef} onScroll={more} className="hidden overflow-y-auto overscroll-contain py-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:block">
          {feed.map(([lap, c], i) => {
            const wide = (i % (CASES.length + 1)) % 3 === 2; /* mesmo padrão em cada volta */
            return (
              <a key={`${lap}-${c.id}`} href={c.id === "comply" ? c.url : `#project/${c.id}`} {...(c.id === "comply" ? ext(c.url) : {})} onClick={onClose} className={`group mb-20 block ${wide ? "w-full" : "max-w-[300px]"}`}>
                <p className="flex gap-4 text-[13px] text-white/45"><span>{c.kind}</span><span>{c.year}</span></p>
                <img src={`/kevin/shots/card-${c.id}.jpg`} alt="" loading="lazy" className={`mt-3 w-full object-cover transition-opacity group-hover:opacity-70 ${wide ? "aspect-[16/9]" : "aspect-square"}`} style={{ objectPosition: wide ? "left top" : POS[c.id] }} />
                <p className="mt-4 max-w-[300px] text-[17px] font-semibold leading-snug">{c.name}</p>
              </a>
            );
          })}
        </div>
        <div data-scroll className="flex min-h-0 min-w-0 flex-col overflow-y-auto overflow-x-hidden overscroll-contain pb-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="sticky top-0 z-10 flex h-[84px] shrink-0 items-center justify-between bg-[#141413] lg:justify-end">
            <span className="text-[26px] font-bold lg:hidden">K{"\\"}</span>
            <button onClick={onClose} className="grid size-8 place-items-center rounded-[10px] border border-white/15 bg-white/5 hover:bg-white/10" aria-label="Close menu">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
          </div>
          <nav className="pt-4 lg:pt-10">
            <a href="#top" onClick={onClose} className="block py-1 text-[34px] font-semibold sm:text-[40px]">Home</a>
            {MENUS.map(([t, cols]) => (
              <div key={t}>
                <button onClick={() => setSub(sub === t ? null : t)} className={`flex items-center gap-4 py-1.5 text-[34px] font-semibold transition-colors sm:text-[40px] ${sub === t ? "text-white" : "text-white/45 hover:text-white"}`}>{t}<Chev up={sub === t} className="size-4" /></button>
                <AnimatePresence initial={false}>
                  {sub === t && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }} className="overflow-hidden">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-6 pb-5 pt-2">
                        {cols.map(([h, items]) => (
                          <ul key={h} className="space-y-2.5">
                            {items.map(([l, href]) => <li key={l}><a href={href} onClick={onClose} {...ext(href)} className="break-words text-[14px] text-white/60 hover:text-white sm:text-[15px]">{l}</a></li>)}
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
          <div className="mt-14 lg:hidden">
            <Carousel dark items={[...CASES, STUDIO]} render={(c) => (
              <a href={c.id === "comply" ? c.url : `#project/${c.id}`} {...(c.id === "comply" ? ext(c.url) : {})} onClick={onClose} className="block">
                <p className="flex gap-4 text-[13px] text-white/45"><span>{c.kind}</span><span>{c.year}</span></p>
                <img src={`/kevin/shots/card-${c.id}.jpg`} alt="" loading="lazy" className="mt-3 aspect-[4/3] w-full object-cover" style={{ objectPosition: POS[c.id] }} />
                <p className="mt-3 text-[17px] font-semibold leading-snug">{c.name}</p>
              </a>
            )} />
          </div>
          <div className="mt-14 border-b border-white/15 lg:mt-24">{rows.map(([t, items]) => <FootRow key={t} title={t} items={items} />)}</div>
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
  const [cut, setCut] = useState(84);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(null);
  const [search, setSearch] = useState(false);
  /* Saída do menu também por CSS: some com fade e só depois desmonta. */
  const [closing, setClosing] = useState(false);
  const closeMenu = () => {
    setClosing(true);
    setTimeout(() => { setOpen(false); setClosing(false); }, 200);
  };
  const [q, setQ] = useState("");
  const closeSearch = () => { setSearch(false); setQ(""); dispatchEvent(new Event("search-closed")); };
  useEffect(() => {
    if (!search) return;
    const k = (e) => e.key === "Escape" && closeSearch();
    const pick = (e) => { const t = e.target.closest?.("[data-top]"); if (t) setQ(t.dataset.top); };
    addEventListener("keydown", k); addEventListener("click", pick);
    return () => { removeEventListener("keydown", k); removeEventListener("click", pick); };
  }, [search]);
  useEffect(() => {
    /* Vale para a página e para a tela de busca, que tem rolagem própria. */
    const on = () => {
      const sc = document.getElementById("search-scroll");
      setCompact((sc ? sc.scrollTop : scrollY) > 40);
      const f = document.getElementById(sc ? "search-footer" : "footer");
      /* O footer sobe por baixo do header: o fundo claro encolhe até onde o footer começa,
         e o texto inverte quando o footer passa do meio dos botões. */
      const top = f ? f.getBoundingClientRect().top : 9999;
      setCut(Math.max(0, Math.min(84, top)));
      setDark(top < 42);
    };
    on();
    const t = setTimeout(on, 50);
    addEventListener("scroll", on, { passive: true, capture: true });
    return () => { clearTimeout(t); removeEventListener("scroll", on, { capture: true }); };
  }, [search]);
  const line = dark ? "border-white/15 hover:border-white/40" : "border-line hover:border-ink/25";
  const pill = (on) => `flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-[13px] transition-colors duration-200 ${on ? (dark ? "border-white bg-white text-ink" : "border-ink bg-ink text-bg") : dark ? line : "border-line bg-card hover:bg-card2"}`;
  return (
    <>
      <header onMouseLeave={() => setMenu(null)} className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${dark ? "text-[#faf9f5]" : "text-ink"}`}>
        <span className="absolute inset-x-0 top-0 -z-10 bg-bg" style={{ height: cut }} />
        <div className={`${W} flex h-[84px] items-center justify-between gap-4 lg:grid lg:grid-cols-[1fr_auto_1fr]`}>
          <nav className="hidden items-center gap-2.5 lg:flex">
            {MENUS.map(([t]) => <button key={t} onMouseEnter={() => setMenu(t)} onClick={() => setMenu(menu === t ? null : t)} className={pill(menu === t)}>{t}<Chev up={menu === t} /></button>)}
            <a href="#certs" onMouseEnter={() => setMenu(null)} className={pill(false)}>Certifications</a>
          </nav>
          <a href="#top" onClick={(e) => { e.preventDefault(); if (search) closeSearch(); history.pushState(null, "", location.pathname); dispatchEvent(new HashChangeEvent("hashchange")); scrollTo({ top: 0, behavior: "smooth" }); }} aria-label="Kevin Matos" className="text-[26px] font-bold tracking-[-0.01em] lg:hidden">K{"\\"}</a>
          <a href="#top" onClick={(e) => { e.preventDefault(); if (search) closeSearch(); setMenu(null); history.pushState(null, "", location.pathname); dispatchEvent(new HashChangeEvent("hashchange")); scrollTo({ top: 0, behavior: "smooth" }); }} aria-label="Kevin Matos" className="relative hidden h-8 w-[220px] place-items-center lg:grid">
            <Wordmark compact={compact} className="text-[24px]" />
          </a>
          <div className="flex items-center justify-end gap-2.5">
            {search ? (
              <>
                <motion.label initial={{ width: 32 }} animate={{ width: innerWidth < 640 ? innerWidth - 40 - 32 - 32 - 20 : Math.min(420, Math.round(innerWidth * 0.4)) }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="flex h-8 shrink-0 items-center gap-2.5 overflow-hidden rounded-[10px] border border-line bg-card px-[7px] focus-within:border-ink/30">
                  <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></svg>
                  <motion.input initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Enter search..." className="w-full min-w-0 bg-transparent text-[14px] outline-none placeholder:text-mute" />
                </motion.label>
                <button onClick={closeSearch} className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-ink text-bg" aria-label="Close search">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
                </button>
              </>
            ) : (
              <>
                <motion.a initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.15 }} href={LINKS.cv} target="_blank" rel="noreferrer" onMouseEnter={() => setMenu(null)} className={`flex ${pill(false)}`}><span className="sm:hidden">CV</span><span className="hidden sm:inline">Download CV</span></motion.a>
                <button onClick={() => setSearch(true)} className={`grid size-8 place-items-center rounded-[10px] border transition-colors ${dark ? `${line} hover:bg-white/10` : "border-line bg-card hover:bg-card2"}`} aria-label="Search">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></svg>
                </button>
              </>
            )}
            <button onClick={() => setOpen(true)} className={`grid size-8 place-items-center rounded-[10px] border transition-colors ${dark ? `${line} hover:bg-white/10` : "border-line bg-card hover:bg-card2"}`} aria-label="Open menu">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 7h16M4 12h12M4 17h8" /></svg>
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menu && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18, ease }} className="absolute left-1/2 top-[70px] hidden w-[1440px] max-w-full -translate-x-1/2 px-5 sm:px-10 lg:block">
              <div className="w-[460px] rounded-2xl border border-line bg-bg px-6 py-4 text-ink shadow-[0_16px_40px_rgba(0,0,0,.07)]">
                <div className="grid grid-cols-2 gap-8">
                  {MENUS.find((m) => m[0] === menu)[1].map(([h, items]) => (
                    <div key={h}>
                      <p className="text-[13px] text-mute">{h}</p>
                      <ul className="mt-1.5">
                        {items.map(([t, href]) => <li key={t}><a href={href} onClick={() => setMenu(null)} {...ext(href)} className="-mx-3 block rounded-lg px-3 py-2 text-[14px] transition-colors hover:bg-card2">{t}</a></li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <div className="h-[84px]" />
      <AnimatePresence>{search && <Search q={q} onClose={closeSearch} />}</AnimatePresence>
      {open && <FullMenu closing={closing} onClose={closeMenu} />}
    </>
  );
}

/* ---------- topo ---------- */

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const inset = useTransform(scrollYProgress, [0.3, 1], [8, 0]);
  const clip = useTransform(inset, (i) => `inset(0 ${i}% round ${i * 2}px)`);
  return (
    <section id="top">
      <div className={`${W} select-none pb-14 pt-12 sm:pt-16`}>
        <Reveal>
          <h1 className="w-fit max-w-[1340px] select-text text-[26px] leading-[1.22] tracking-[-0.015em] sm:text-[34px]">
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
          <Reveal className="mt-10" delay={0.08}>{children}</Reveal>
        </div>
      </div>
    </section>
  );
}

/* Carrossel do celular: arrasta para o lado, com setas e contador "03 / 08". */
function Carousel({ items, render, dark = false, item = "w-[82%]" }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  const go = (d) => {
    const el = ref.current;
    const w = el.firstChild?.offsetWidth + 16 || el.clientWidth;
    el.scrollBy({ left: d * w, behavior: "smooth" });
  };
  const on = () => {
    const el = ref.current;
    const w = el.firstChild?.offsetWidth + 16 || 1;
    setN(Math.round(el.scrollLeft / w));
  };
  const btn = `grid size-8 place-items-center rounded-[10px] border ${dark ? "border-white/20" : "border-line bg-card"}`;
  return (
    <div>
      <div ref={ref} onScroll={on} className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 sm:mx-0 sm:scroll-px-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((it, i) => <div key={i} className={`${item} shrink-0 snap-start`}>{render(it, i)}</div>)}
      </div>
      <div className="mt-8 flex items-center justify-between">
        <button onClick={() => go(-1)} className={btn} aria-label="Previous">←</button>
        <span className={`font-mono text-[13px] ${dark ? "text-white/60" : "text-mute"}`}>{String(n + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
        <button onClick={() => go(1)} className={btn} aria-label="Next">→</button>
      </div>
    </div>
  );
}

/* ---------- projetos: cards editoriais, os outros esmaecem no hover ---------- */

/* Que parte de cada print aparece no recorte vertical. */
const POS = { avodah: "22% center", goias: "18% top", agro: "50% top", farm: "70% center", school: "75% center", prospect: "50% center", corvus: "20% center", comply: "18% center" };
/* A Comply entra como último card, levando para o site do estúdio. */
const STUDIO = { id: "comply", name: "Comply", kind: "Studio", year: "2026", lede: "My studio: custom web apps, internal systems and 40+ websites for business clients.", url: LINKS.studio };

function WorkCard({ c, onOpen }) {
  return (
    <button onClick={() => (c.id === "comply" ? open(c.url, "_blank") : onOpen(c.id))} className="block w-full text-left">
      <p className="flex items-center gap-2.5 text-[13px] text-mute"><span className="rounded-full bg-card px-2 leading-5 tracking-widest">···</span>{c.kind}</p>
      <img src={`/kevin/shots/card-${c.id}.jpg`} alt={c.name} loading="lazy" className="mt-3 aspect-[4/5] w-full object-cover" style={{ objectPosition: POS[c.id] ?? "left top" }} />
      <h3 className="mt-4 text-[20px] font-semibold leading-snug">{c.name}</h3>
      <p className="mt-1.5 line-clamp-3 text-[14.5px] leading-relaxed text-mute">{c.lede}</p>
    </button>
  );
}

function Work({ onOpen }) {
  return (
    <Section id="work" eyebrow="Selected work" title="Products I built, run or sold." sub="Real clients, real users. Open any project for the architecture and the decisions behind it.">
      <Carousel items={[...CASES, STUDIO]} item="w-[82%] sm:w-[calc((100%-16px)/2)] lg:w-[calc((100%-48px)/4)]" render={(c) => <WorkCard c={c} onOpen={onOpen} />} />
    </Section>
  );
}

/* Case em página cheia, no estilo de artigo: título grande, imagem larga e o resto em coluna de leitura. */
function CaseModal({ id, onClose }) {
  const c = CASES.find((x) => x.id === id);
  useLock(!!c);
  useEffect(() => {
    if (!c) return;
    const k = (e) => e.key === "Escape" && onClose();
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [c, onClose]);
  const i = CASES.findIndex((x) => x.id === id);
  const next = CASES[(i + 1) % CASES.length];
  return (
    <AnimatePresence>
      {c && (
        <motion.div key={c.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ duration: 0.4, ease }} data-scroll className="fixed inset-0 z-[75] overflow-y-auto overscroll-contain bg-bg">
          <div className={`${W} sticky top-0 z-10 flex h-[84px] items-center justify-between bg-bg/90 backdrop-blur`}>
            <p className="text-[13px] text-mute">Work / <span className="text-ink">{c.name}</span></p>
            <button onClick={onClose} className="grid size-8 place-items-center rounded-[10px] border border-line bg-card hover:bg-card2" aria-label="Close">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
          </div>
          <article className={`${W} pb-24`}>
            <div className="grid items-center gap-10 pt-6 sm:pt-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
            <header>
              <p className="text-[13px] text-mute">{c.kind} · {c.year} · {c.badge}</p>
              <h1 className="mt-3 font-serif text-[42px] leading-[1.05] tracking-[-0.02em] sm:text-[60px]">{c.name}</h1>
              <p className="mt-5 text-[17px] leading-relaxed text-mute sm:text-[20px]">{c.lede}</p>
              {c.url && <a href={c.url} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-[14px] font-medium text-bg">Visit live <Arrow /></a>}
            </header>
            <img src={`/kevin/shots/card-${c.id}.jpg`} alt={c.name} className="aspect-[4/3] w-full bg-card object-cover object-left-top" style={{ objectPosition: POS[c.id] }} />
            </div>
            {c.metrics && (
              <div className="mt-10 grid grid-cols-2 gap-6 border-b border-line pb-10 sm:grid-cols-3">
                {c.metrics.map(([n, l]) => <div key={l}><div className="font-serif text-[30px] leading-none sm:text-[38px]">{n}</div><p className="mt-2 text-[13px] leading-snug text-mute">{l}</p></div>)}
              </div>
            )}
            <div className="mt-12 grid gap-10 lg:grid-cols-[240px_1fr]">
              <p className="text-[13.5px] text-mute">What I built</p>
              <dl className="max-w-3xl divide-y divide-line border-y border-line">
                {c.points.map(([k, v]) => <div key={k} className="grid gap-1 py-4 sm:grid-cols-[170px_1fr] sm:gap-6"><dt className="text-[15px] font-semibold">{k}</dt><dd className="text-[15px] leading-relaxed text-mute">{v}</dd></div>)}
              </dl>
            </div>
            {c.gallery && (
              <div className="mt-14">
                <Carousel items={c.gallery} item="w-[82%] sm:w-[calc((100%-32px)/3)]" render={(g) => <img src={g} alt="" loading="lazy" className="aspect-[16/10] w-full bg-card object-cover object-top" />} />
              </div>
            )}
            <div className="mt-14 grid gap-10 lg:grid-cols-[240px_1fr]">
              <p className="text-[13.5px] text-mute">Why it matters</p>
              <div className="max-w-3xl">
                <p className="font-serif text-[24px] leading-snug sm:text-[30px]">{c.meaning}</p>
                <div className="mt-6 flex flex-wrap gap-1.5">{c.tags?.map((t) => <span key={t} className="rounded-full border border-line bg-card px-3 py-1 text-[12.5px] text-mute">{t}</span>)}</div>
              </div>
            </div>
            <a href={`#project/${next.id}`} className="group mt-20 flex items-center justify-between border-t border-line pt-8">
              <span><span className="block text-[13px] text-mute">Next project</span><span className="mt-1 block font-serif text-[28px] sm:text-[36px]">{next.name}</span></span>
              <Arrow className="size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </article>
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

/* Uma citação por vez, grande, como um destaque editorial. */
function Feedback() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setI((i + 1) % TESTIMONIALS.length), 7000);
    return () => clearTimeout(t);
  }, [i]);
  /* Tudo empilhado na mesma célula do grid: troca por crossfade, sem a altura pular. */
  const layer = (on) => `[grid-area:1/1] transition-opacity duration-[900ms] ease-in-out ${on ? "opacity-100 delay-300" : "pointer-events-none opacity-0"}`;
  return (
    <Section id="feedback" eyebrow="Client feedback" title="What clients said.">
      <div className="grid items-center gap-10 bg-card p-8 sm:p-14 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="grid">
            {TESTIMONIALS.map(([q, name, role], n) => (
              <div key={q} className={layer(n === i)} aria-hidden={n !== i}>
                <p className="font-serif text-[30px] leading-[1.2] sm:text-[42px]">“{q}”</p>
                <p className="mt-6 text-[14px]"><span className="font-semibold">{name}</span> <span className="text-mute">· {role}</span></p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex items-center gap-2">
            {TESTIMONIALS.map((t, n) => (
              <button key={t[0]} onClick={() => setI(n)} aria-label={`Quote ${n + 1}`} className={`h-1.5 rounded-full transition-all duration-500 ${n === i ? "w-8 bg-ink" : "w-1.5 bg-ink/25 hover:bg-ink/50"}`} />
            ))}
          </div>
        </div>
        <div className="grid">
          {TESTIMONIALS.map(([q, , , project], n) => {
            const site = SITES.find((x) => x.name === project);
            return site && (
              <a key={q} href={site.url} target="_blank" rel="noreferrer" className={`group block ${layer(n === i)}`} tabIndex={n === i ? 0 : -1}>
                <img src={site.shot} alt={site.name} className="aspect-[4/3] w-full object-cover object-top shadow-[0_20px_50px_rgba(0,0,0,.12)]" />
                <p className="mt-3 flex items-center gap-1.5 text-[13px] text-mute group-hover:text-ink">{site.name} <Arrow /></p>
              </a>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* ---------- listas: open source, experiência, certificações, notas ---------- */

/* Console ao vivo: roda no navegador a lógica central do repo. */
function Playground({ name }) {
  const r = RUNNERS[name];
  const [input, setInput] = useState("");
  const [lines, setLines] = useState([]);
  const [busy, setBusy] = useState(false);
  useEffect(() => { setLines([]); setInput(""); }, [name]);
  if (!r) return null;
  const go = async () => {
    setBusy(true);
    setLines([["$ run " + name, "cmd"]]);
    const t0 = performance.now();
    try { await r.run((t, k = "") => setLines((l) => [...l, [t, k]]), input); }
    catch (e) { setLines((l) => [...l, [String(e), "err"]]); }
    setLines((l) => [...l, [`finished in ${Math.round(performance.now() - t0)}ms`, "dim"]]);
    setBusy(false);
  };
  const tone = { ok: "text-[#8fd18b]", err: "text-[#f08a7a]", cmd: "text-white", dim: "text-white/40" };
  return (
    <div className="mt-4 bg-[#141413] text-[#e8e6dc]">
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 p-3">
        <span className="px-1 text-[12px] text-white/50">{r.label}</span>
        <input value={input} size={1} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !busy && go()} placeholder={r.placeholder} className="min-w-0 flex-1 rounded-md bg-white/5 px-3 py-1.5 font-mono text-[12.5px] outline-none placeholder:text-white/30 focus:bg-white/10" />
        <button onClick={go} disabled={busy} className="flex items-center gap-1.5 rounded-md bg-[#faf9f5] px-3 py-1.5 text-[13px] font-medium text-ink disabled:opacity-50">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8z" /></svg>{busy ? "Running" : "Run"}
        </button>
      </div>
      <div className="h-[220px] overflow-y-auto break-words p-4 font-mono text-[11.5px] sm:text-[12.5px] leading-relaxed">
        {lines.length ? lines.map(([t, k], i) => <div key={i} className={`whitespace-pre-wrap ${tone[k] ?? ""}`}>{t}</div>) : <span className="text-white/35">Press Run to execute this repo's core logic live in your browser.</span>}
      </div>
    </div>
  );
}

/* Lista à esquerda, detalhe à direita: o fluxo do sistema e um trecho real do código. */
function Code() {
  const [sel, setSel] = useState(0);
  const r = REPOS[sel];
  return (
    <Section id="code" eyebrow="Open source" title="The engineering, in public." sub="Small, focused repos with tests, each one proving a specific skill.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr] lg:gap-10">
        <ul className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] lg:mx-0 lg:block lg:border-t lg:border-line lg:px-0 lg:pb-0">
          {REPOS.map((x, n) => (
            <li key={x.name} className="shrink-0 lg:border-b lg:border-line">
              <button onClick={() => setSel(n)} onMouseEnter={(e) => matchMedia("(hover: hover)").matches && setSel(n)} className={`flex w-full items-center justify-between gap-3 rounded-full border px-3.5 py-2 text-left transition-colors lg:rounded-none lg:border-0 lg:px-0 lg:py-3.5 ${n === sel ? "border-ink text-ink" : "border-line text-mute hover:text-ink"}`}>
                <span className="flex items-center gap-2.5 whitespace-nowrap font-mono text-[13px] lg:text-[14px]"><span className="size-2 rounded-full" style={{ background: x.color }} />{x.name}</span>
                <span className="hidden text-[12px] lg:inline">{x.lang}</span>
              </button>
            </li>
          ))}
        </ul>
        <AnimatePresence mode="wait">
          <motion.div key={r.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease }} className="min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="break-all font-mono text-[18px] sm:text-[20px]">{r.name}</h3>
              <a href={`${LINKS.github}/${r.name}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[13.5px] font-medium hover:underline">View on GitHub <Arrow /></a>
            </div>
            <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-mute">{r.desc}</p>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-[13px]">
              {r.arch.map((a, n) => (
                <span key={a} className="flex items-center gap-2">
                  <span className="border border-line bg-card px-3 py-1.5">{a}</span>
                  {n < r.arch.length - 1 && <span className="text-mute">→</span>}
                </span>
              ))}
            </div>
            <Playground name={r.name} />
            <pre className="mt-6 overflow-x-auto bg-[#141413] p-4 font-mono text-[11.5px] sm:p-6 sm:text-[13px] leading-relaxed text-[#e8e6dc]">{r.code}</pre>
            <p className="mt-4 text-[13px] text-mute">{r.proof.join(" · ")}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  );
}

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
                <div className="max-w-3xl">
                  <div>
                    <h3 className="text-[17px] font-semibold">{j.co}</h3>
                    <p className="text-[14px] text-mute">{j.role}{j.via ? ` · ${j.via}` : ""}</p>
                    <ul className="mt-3 space-y-1.5">
                      {j.pts.map((p) => <li key={p} className="text-[14.5px] leading-relaxed text-mute">{p}</li>)}
                    </ul>
                  </div>
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

/* Idiomas em cima (o C2 mostra o certificado no hover), quatro destaques e o resto em lista. */
const FEATURED = ["AI Agents Course", "Claude with the Anthropic API", "Introduction to Model Context Protocol", "Intermediate Machine Learning"];

function Certs() {
  const [open, setOpen] = useState(null);
  useLock(!!open);
  const list = CERTS.filter((c) => !/EF SET/.test(c.name));
  const feat = FEATURED.map((n) => list.find((c) => c.name === n)).filter(Boolean);
  const rest = list.filter((c) => !feat.includes(c));
  const [tip, setTip] = useState(null);
  const last = useRef({ x: -999, y: -999 });
  if (tip) last.current = tip;
  return (
    <Section id="certs" eyebrow="Certifications & languages" title="Always learning, with proof." sub="Every certificate links to its public verification page.">
      <div className="grid gap-4 sm:grid-cols-2">
        <a href="https://cert.efset.org/en/tiiCCp" target="_blank" rel="noreferrer" onMouseMove={(e) => setTip({ x: e.clientX, y: e.clientY })} onMouseLeave={() => setTip(null)} className="group relative bg-card p-5">
          <p className="text-[13px] text-mute">English</p>
          <p className="mt-1 font-serif text-[28px] leading-tight underline-offset-4 group-hover:underline">C2 Proficient</p>
          <p className="mt-1 text-[13.5px] text-mute">EF SET 80/100 · Reading 76, Listening 84</p>
          <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium">Verify <Arrow /></span>
        </a>
        <div className="bg-card p-5">
          <p className="text-[13px] text-mute">Portuguese</p>
          <p className="mt-1 font-serif text-[28px] leading-tight">Native</p>
          <p className="mt-1 text-[13.5px] text-mute">Brazilian</p>
        </div>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {feat.map((c) => (
          <a key={c.name} href={c.verify || c.url} target="_blank" rel="noreferrer" className="group block">
            <p className="text-[13px] text-mute">{c.org}</p>
            <div className="mt-2.5 grid aspect-[4/3] place-items-center overflow-hidden bg-card p-5">
              <img src={c.img} alt={c.name} loading="lazy" className="max-h-full max-w-full shadow-[0_10px_30px_rgba(0,0,0,.12)] transition-transform duration-500 group-hover:scale-[1.03]" />
            </div>
            <p className="mt-3.5 text-[16px] font-semibold leading-snug">{c.name}</p>
            <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-mute">{c.note}</p>
            <p className="mt-2 inline-flex items-center gap-1 text-[13px] font-medium">{c.date} · Verify <Arrow /></p>
          </a>
        ))}
      </div>

      <p className="mt-14 text-[13.5px] text-mute">Also certified</p>
      <div className="mt-4 grid border-t border-line sm:grid-cols-2 sm:gap-x-10">
        {rest.map((c) => (
          <div key={c.name} className="flex items-baseline justify-between gap-4 border-b border-line py-3.5 text-[15px]">
            <button onClick={() => setOpen(c)} className="text-left hover:underline hover:underline-offset-4">{c.name} <span className="text-mute">· {c.org}</span></button>
            {c.verify && <a href={c.verify} target="_blank" rel="noreferrer" className="shrink-0 text-mute hover:text-ink" aria-label="Verify"><Arrow /></a>}
          </div>
        ))}
      </div>

      {/* Prévia do certificado que segue o cursor sobre o C2: sempre montada, só a opacidade muda (sem piscar no Chrome). */}
      <div style={{ transform: `translate3d(${(tip?.x ?? last.current.x) + 18}px, ${(tip?.y ?? last.current.y) + 18}px, 0)` }} className={`pointer-events-none fixed left-0 top-0 z-[90] hidden w-[384px] overflow-hidden rounded-lg bg-white shadow-[0_24px_60px_rgba(0,0,0,.22)] transition-opacity duration-300 ease-out will-change-[opacity,transform] sm:block ${tip ? "opacity-100" : "opacity-0"}`}>
        <img src="/kevin/certs/efset-english-wide.jpg" alt="" className="aspect-video w-full" />
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

function Footer({ inSearch = false }) {
  const rows = [
    ["Work", CASES.map((c) => [c.name, `#project/${c.id}`])],
    ["Client sites", SITES.map((s) => [s.name, s.url])],
    ["Open source", REPOS.map((r) => [r.name, `${LINKS.github}/${r.name}`])],
    ["Experience", JOBS.map((j) => [`${j.co} · ${j.when}`, "#experience"])],
    ["Certifications", CERTS.map((c) => [`${c.name} · ${c.org}`, c.verify || c.url])],
    ["Notes", NOTES.map((n) => [n.title, "#notes"])],
  ];
  return (
    <footer id={inSearch ? "search-footer" : "footer"} className="flex min-h-[100svh] flex-col justify-between bg-[#141413] pt-16 text-[#faf9f5]">
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
  /* Ao fechar a busca, o conteúdo da home volta com um fade. */
  const [fadeKey, setFadeKey] = useState(0);
  useEffect(() => {
    const on = () => setFadeKey((n) => n + 1);
    addEventListener("search-closed", on);
    return () => removeEventListener("search-closed", on);
  }, []);
  return (
    <>
      <Header />
      <main key={fadeKey} className={fadeKey ? "animate-[fadein_.6s_ease-out_both]" : ""}>
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
