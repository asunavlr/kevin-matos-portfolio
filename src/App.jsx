import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Analytics } from "@vercel/analytics/react";
import {
  MotionConfig,
  AnimatePresence,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  animate,
} from "motion/react";
import { CAPS, CASES, CERTS, DEEP, JOBS, LINKS, NOTES, NOW, REPOS, SITES, STACK, STATS, TESTIMONIALS, USES } from "./data";

const ease = [0.22, 1, 0.36, 1];

/* ---------------- primitives ---------------- */

function Reveal({ children, delay = 0, y = 28, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/* words fade in from blur, one by one */
function BlurWords({ text, className = "", delay = 0 }) {
  return (
    <span className={className}>
      {text.split(" ").map((w, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: "0.35em" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: delay + i * 0.08, ease }}
        >
          {w}&nbsp;
        </motion.span>
      ))}
    </span>
  );
}

function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null);
  const x = useSpring(0, { stiffness: 200, damping: 15 });
  const y = useSpring(0, { stiffness: 200, damping: 15 });
  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className="inline-block"
      onPointerMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

function Button({ href, children, primary }) {
  return (
    <Magnetic>
      <a
        href={href}
        target={href.startsWith("#") ? undefined : "_blank"}
        rel="noreferrer"
        className={
          primary
            ? "group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-ink px-6 py-3 text-sm font-medium text-bg transition-transform active:scale-95"
            : "inline-flex items-center gap-2 rounded-full border border-line2 bg-white/[0.03] px-6 py-3 text-sm font-medium transition-colors hover:border-white/50 hover:bg-white/[0.06]"
        }
      >
        {primary && (
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-vio to-cy transition-transform duration-500 ease-out group-hover:translate-x-0" />
        )}
        <span className="relative z-10 transition-colors group-hover:text-white">{children}</span>
      </a>
    </Magnetic>
  );
}

function Counter({ to, prefix = "", suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.8, ease: "easeOut", onUpdate: (n) => setV(Math.round(n)) });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref}>
      {prefix}
      {v}
      {suffix}
    </span>
  );
}

/* card with a glow that follows the cursor */
function Spotlight({ children, className = "", as: Tag = "div", ...rest }) {
  const mx = useMotionValue(-300);
  const my = useMotionValue(-300);
  const bg = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, rgba(201,168,106,.16), transparent 45%)`;
  const MotionTag = motion[Tag];
  return (
    <MotionTag
      {...rest}
      className={`group relative overflow-hidden ${className}`}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
    >
      <motion.div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: bg }} />
      {children}
    </MotionTag>
  );
}

function SectionHead({ index, eyebrow, title, sub }) {
  return (
    <div className="mb-14 grid gap-6 md:mb-20 md:grid-cols-[220px_1fr]">
      <Reveal>
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-soft">
          <span className="grad font-medium">{index}</span>
          <span className="h-px w-8 bg-line2" />
          {eyebrow}
        </div>
      </Reveal>
      <div>
        <Reveal>
          <h2 className="font-display text-[clamp(38px,6vw,84px)] font-semibold leading-[0.95] tracking-[-0.04em]">{title}</h2>
        </Reveal>
        {sub && (
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-lg text-soft">{sub}</p>
          </Reveal>
        )}
      </div>
    </div>
  );
}

function Browser({ src, url, className = "", tall }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-line2 bg-card shadow-2xl shadow-black/60 ${className}`}>
      <div className="flex h-8 items-center gap-1.5 border-b border-line bg-[#141414] px-3">
        <i className="size-2.5 rounded-full bg-[#ff5f57]" />
        <i className="size-2.5 rounded-full bg-[#febc2e]" />
        <i className="size-2.5 rounded-full bg-[#28c840]" />
        {url && <span className="mx-auto truncate rounded-md bg-white/5 px-3 py-0.5 font-mono text-[10px] text-dim">{url.replace("https://", "")}</span>}
      </div>
      <div className="aspect-[16/10] overflow-hidden bg-white">
        <img src={src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
      </div>
    </div>
  );
}

function Phone({ src, className = "" }) {
  return (
    <div className={`rounded-[2rem] border border-line2 bg-[#0b0b0b] p-1.5 shadow-2xl shadow-black/70 ${className}`}>
      <div className="relative overflow-hidden rounded-[1.6rem]">
        <div className="absolute left-1/2 top-1.5 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-black" />
        <img src={src} alt="" loading="lazy" decoding="async" className="aspect-[9/19.5] w-full object-cover object-top" />
      </div>
    </div>
  );
}

/* ---------------- nav ---------------- */

const NAV = [
  ["work", "Work"],
  ["lab", "Lab"],
  ["skills", "Skills"],
  ["studio", "Studio"],
  ["path", "Experience"],
  ["notes", "Notes"],
];

const SECTIONS = [["work", "Work"], ["skills", "What I do"], ["lab", "Engineering lab"], ["studio", "Studio"], ["path", "Experience"], ["now", "Now building"], ["notes", "Engineering notes"], ["uses", "Uses"], ["ireland", "Working in Ireland"], ["contact", "Contact"]];

function CommandPalette({ open, setOpen }) {
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const input = useRef(null);
  const items = [
    ...CASES.map((c) => ({ group: "Projects", label: c.name, hint: c.kind, run: () => (location.hash = `project/${c.id}`) })),
    ...SECTIONS.map(([id, label]) => ({ group: "Go to", label, hint: `#${id}`, run: () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }) })),
    { group: "Links", label: "Copy email", hint: LINKS.email, run: () => navigator.clipboard?.writeText(LINKS.email) },
    { group: "Links", label: "Download CV", hint: "PDF", run: () => window.open(LINKS.cv, "_blank") },
    { group: "Links", label: "GitHub", hint: "@asunavlr", run: () => window.open(LINKS.github, "_blank") },
    { group: "Links", label: "LinkedIn", hint: "kevinmatoss", run: () => window.open(LINKS.linkedin, "_blank") },
    { group: "Links", label: "Prospect Comply demo", hint: "live", run: () => window.open("https://prospect-comply-production.up.railway.app/demo", "_blank") },
  ];
  const list = items.filter((x) => (x.label + " " + x.hint + " " + x.group).toLowerCase().includes(q.toLowerCase()));
  useEffect(() => {
    const k = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [setOpen]);
  useEffect(() => {
    if (open) {
      setQ("");
      setI(0);
      setTimeout(() => input.current?.focus(), 30);
    }
  }, [open]);
  const go = (x) => {
    setOpen(false);
    setTimeout(x.run, 60);
  };
  let last = "";
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[110] flex items-start justify-center px-4 pt-[14vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <motion.div
            initial={{ y: -12, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line2 bg-[#0c0c0c] shadow-2xl shadow-black"
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
              if (e.key === "ArrowDown") (e.preventDefault(), setI((v) => Math.min(v + 1, list.length - 1)));
              if (e.key === "ArrowUp") (e.preventDefault(), setI((v) => Math.max(v - 1, 0)));
              if (e.key === "Enter" && list[i]) go(list[i]);
            }}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <span className="text-dim">⌘</span>
              <input
                ref={input}
                value={q}
                onChange={(e) => (setQ(e.target.value), setI(0))}
                placeholder="Search projects, sections, links…"
                className="h-14 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-dim"
              />
              <kbd className="rounded border border-line2 px-1.5 font-mono text-[10px] text-dim">ESC</kbd>
            </div>
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {list.length === 0 && <div className="px-3 py-8 text-center text-sm text-dim">Nothing found.</div>}
              {list.map((x, n) => {
                const head = x.group !== last ? x.group : null;
                last = x.group;
                return (
                  <div key={x.group + x.label}>
                    {head && <div className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-widest text-dim">{head}</div>}
                    <button onMouseEnter={() => setI(n)} onClick={() => go(x)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm ${i === n ? "bg-white/[0.07] text-ink" : "text-soft"}`}>
                      <span>{x.label}</span>
                      <span className="font-mono text-[11px] text-dim">{x.hint}</span>
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between border-t border-line px-4 py-2.5 font-mono text-[10px] text-dim">
              <span>↑ ↓ navigate · ↵ open</span>
              <span>kevin matos · portfolio</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function Nav() {
  const [palette, setPalette] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [active, setActive] = useState("");
  const [hover, setHover] = useState(null);
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    NAV.forEach(([id]) => document.getElementById(id) && io.observe(document.getElementById(id)));
    return () => io.disconnect();
  }, []);
  return (
    <>
      <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-gradient-to-r from-vio to-cy" />
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.3, ease }}
        className="fixed inset-x-0 top-4 z-40 flex justify-center px-4"
      >
        <div className="flex items-center gap-1 rounded-full border border-line2 bg-bg/70 p-1.5 shadow-xl shadow-black/40 backdrop-blur-xl">
          <a href="#top" className="flex items-center gap-2 pl-1.5 pr-3" aria-label="Kevin Matos, home">
            <Mark className="size-8" />
            <span className="hidden font-display text-[15px] font-semibold tracking-tight md:inline">Kevin Matos</span>
          </a>
          <div className="hidden sm:flex" onPointerLeave={() => setHover(null)}>
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`} onPointerEnter={() => setHover(id)} className={`relative rounded-full px-4 py-2 text-sm transition-colors ${active === id ? "text-ink" : "text-soft hover:text-ink"}`}>
                {(hover ?? active) === id && <motion.span layoutId="navpill" className="absolute inset-0 rounded-full bg-white/[0.08]" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                <span className="relative">{label}</span>
              </a>
            ))}
          </div>
          <button onClick={() => setPalette(true)} className="hidden items-center gap-1.5 rounded-full px-3 py-2 font-mono text-[11px] text-dim transition-colors hover:text-ink lg:flex" aria-label="Open command palette">
            <kbd className="rounded border border-line2 px-1.5 py-0.5">⌘K</kbd>
          </button>
          <button onClick={() => setPalette(true)} className="rounded-full px-4 py-2 text-sm text-soft sm:hidden">
            Menu
          </button>
          <a href="#contact" className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-85">
            Hire me
          </a>
        </div>
      </motion.nav>
      <CommandPalette open={palette} setOpen={setPalette} />
    </>
  );
}


/* ---------------- brand mark: K drawn as a vertical stroke + code chevron ---------------- */

export function Mark({ className = "" }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <defs>
        <linearGradient id="mk" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e9e9e6" />
          <stop offset=".5" stopColor="#c9a86a" />
          <stop offset="1" stopColor="#e9e9e6" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="11" fill="#0b0b0b" stroke="url(#mk)" strokeWidth="1.5" />
      <path d="M13 10.5v19" stroke="#ededf0" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M28 10.5 19 20l9 9.5" fill="none" stroke="url(#mk)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="30.5" cy="20" r="1.9" fill="#e9e9e6" />
    </svg>
  );
}

/* ---------------- particles: three depth layers that drift and react to the mouse ---------------- */

function Particles({ mx, my, className = "", density = 1 }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    const ctx = cv.getContext("2d");
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let W = 0, H = 0, pts = [], id;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const size = () => {
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(110, Math.round((W * H) / 14000 * density));
      pts = Array.from({ length: n }, () => {
        const z = Math.random();
        return { x: Math.random() * W, y: Math.random() * H, z, vx: (Math.random() - 0.5) * 0.12, vy: -0.05 - Math.random() * 0.18 * (z + 0.3), tw: Math.random() * 6.28, hue: Math.random() < 0.6 ? "217,191,138" : "220,222,226" };
      });
    };
    size();
    addEventListener("resize", size);
    let last = 0;
    const draw = (t) => {
      id = requestAnimationFrame(draw);
      if (document.hidden || t - last < 33) return;
      last = t;
      ctx.clearRect(0, 0, W, H);
      const ox = (mx?.get() ?? 0) * 60, oy = (my?.get() ?? 0) * 40;
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10;
        const depth = 0.2 + p.z * 1.2;
        const x = p.x - ox * depth, y = p.y - oy * depth;
        const r = 0.4 + p.z * 1.8;
        const a = (0.15 + p.z * 0.6) * (0.65 + 0.35 * Math.sin(t / 700 + p.tw));
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.hue},${a})`;
        ctx.arc(x, y, r, 0, 6.283);
        ctx.fill();
        if (p.z > 0.85) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(${p.hue},${a * 0.15})`;
          ctx.arc(x, y, r * 4, 0, 6.283);
          ctx.fill();
        }
      }
      if (still) cancelAnimationFrame(id);
    };
    id = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(id); removeEventListener("resize", size); };
  }, [mx, my, density]);
  return <canvas ref={ref} className={`pointer-events-none absolute ${className || "inset-0 h-full w-full"}`} />;
}

/* ---------------- hero scene: real 3D planes with depth of field ---------------- */

const PRODUCT_LOGOS = [
  { name: "AgroPujante", src: "/kevin/logos/agro.png" },
  { name: "Dados Fazenda", src: "/kevin/logos/farm.png" },
  { name: "EscolaPujante", src: "/kevin/logos/school.png", light: true },
  { name: "Corvus", src: "/kevin/logos/corvus.png", light: true },
  { name: "Comply", src: "/kevin/logos/comply.svg", light: true },
];

/* what the SAC does all day, as a stream of events */
const FEED = [
  ["◉", "New WhatsApp message", "Ótica Vizzu · Juazeiro"],
  ["✦", "AI agent answered", "boleto 2ª via · 2.1s"],
  ["▤", "Ticket AVD-4412 opened", "→ Garantia e Assistência"],
  ["✓", "Customer served", "closed in 3 min"],
  ["⇄", "Handed to a human", "low confidence · full context"],
  ["▦", "pg_dump finished", "03:12 · restore tested"],
];

function LiveFeed() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setN((x) => x + 1), 1900);
    return () => clearInterval(t);
  }, []);
  const items = [0, 1, 2].map((k) => ({ key: n - k, e: FEED[(((n - k) % FEED.length) + FEED.length) % FEED.length] }));
  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {items.map(({ key, e: [icon, title, sub] }, k) => (
          <motion.div
            key={key}
            layout
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1 - k * 0.28, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.45, ease }}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0c0c0c]/95 p-3 shadow-2xl shadow-black"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#2dd4bf]/15 text-sm text-[#5eead4]">{icon}</span>
            <span className="min-w-0">
              <span className="block truncate text-[13px] text-ink">{title}</span>
              <span className="block truncate font-mono text-[10px] text-dim">{sub}</span>
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function HeroScene() {
  const ref = useRef(null);
  const mxRaw = useMotionValue(0);
  const myRaw = useMotionValue(0);
  const mx = useSpring(mxRaw, { stiffness: 60, damping: 20 });
  const my = useSpring(myRaw, { stiffness: 60, damping: 20 });
  const rotY = useTransform(mx, (v) => v * 10);
  const rotX = useTransform(my, (v) => 6 - v * 6);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const tilt = useTransform(scrollYProgress, [0.4, 0.9], [0, -8]);
  const rx = useTransform([rotX, tilt], ([a, b]) => a + b);
  // phones drift more than the screen: that difference is what reads as depth
  const nearX = useTransform(mx, (v) => v * -28);
  const nearY = useTransform(my, (v) => v * -18);
  const midX = useTransform(mx, (v) => v * -12);
  useEffect(() => {
    const move = (e) => {
      mxRaw.set(e.clientX / innerWidth - 0.5);
      myRaw.set(e.clientY / innerHeight - 0.5);
    };
    addEventListener("pointermove", move);
    return () => removeEventListener("pointermove", move);
  }, [mxRaw, myRaw]);
  return (
    <div ref={ref} className="relative mx-auto mt-16 max-w-5xl px-6 pb-16 sm:mt-20 sm:px-16 sm:pb-24">
      <div className="pointer-events-none absolute inset-x-10 top-10 bottom-10 bg-[radial-gradient(closest-side,rgba(201,168,106,.16),transparent)]" />
      <div className="relative [perspective:1600px]">
        <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.4, ease }}>
          <motion.div style={{ rotateX: rx, rotateY: rotY, transformStyle: "preserve-3d" }} className="relative">
            <div style={{ transform: "translateZ(-60px)" }}>
              <div className="overflow-hidden rounded-xl border border-line2 bg-card shadow-2xl shadow-black/60">
                <div className="flex h-8 items-center gap-1.5 border-b border-line bg-[#141414] px-3">
                  <i className="size-2.5 rounded-full bg-[#ff5f57]" />
                  <i className="size-2.5 rounded-full bg-[#febc2e]" />
                  <i className="size-2.5 rounded-full bg-[#28c840]" />
                  <span className="mx-auto flex items-center gap-2 rounded-md bg-white/5 px-3 py-0.5 font-mono text-[10px] text-dim">
                    <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" /> sac.avodahoptical.com.br · live
                  </span>
                </div>
                <LazyVideo src="/kevin/video/avodah.mp4" className="aspect-[16/10] w-full" />
              </div>
            </div>
            <motion.div style={{ x: midX, z: 90 }} className="absolute -right-[10%] top-[4%] hidden w-[30%] lg:block">
              <LiveFeed />
            </motion.div>
            <motion.div style={{ x: nearX, y: nearY, z: 140, rotate: -5 }} className="absolute -bottom-[10%] -left-[4%] w-[24%] sm:w-[19%]">
              <Phone src="/kevin/shots/farm-m.jpg" />
            </motion.div>
            <motion.div style={{ x: nearX, y: nearY, z: 160, rotate: 5 }} className="absolute -bottom-[6%] -right-[4%] w-[24%] sm:w-[19%]">
              <Phone src="/kevin/shots/school-m.jpg" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/* ---------------- logo strip of products I built ---------------- */

function Logos() {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-4 pt-20 sm:px-6">
      <Reveal>
        <div className="text-center font-mono text-xs uppercase tracking-widest text-dim">Products I designed, built and shipped</div>
      </Reveal>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {PRODUCT_LOGOS.map((l, n) => (
          <Reveal key={l.name} delay={n * 0.06}>
            <Magnetic strength={0.25}>
              <div className="group flex items-center gap-2.5 rounded-2xl border border-line bg-card px-3 py-2 transition-colors hover:border-line2 sm:gap-3 sm:px-4 sm:py-3">
                <span className={`flex size-8 items-center justify-center overflow-hidden rounded-xl sm:size-10 ${l.light ? "bg-white" : "bg-[#0b0b0b]"}`}>
                  <img src={l.src} alt="" className="size-full object-contain p-1" />
                </span>
                <span className="font-display text-sm font-semibold tracking-tight text-soft transition-colors group-hover:text-ink sm:text-lg">{l.name}</span>
              </div>
            </Magnetic>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- hero ---------------- */

const ROLES = ["AI products", "SaaS platforms", "LLM agents", "RAG systems"];

function Hero() {
  const ref = useRef(null);
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % ROLES.length), 2400);
    return () => clearInterval(t);
  }, []);
  const mx = useMotionValue(50);
  const my = useMotionValue(30);
  const spot = useMotionTemplate`radial-gradient(600px circle at ${mx}% ${my}%, rgba(201,168,106,.18), transparent 60%)`;

  return (
    <header
      id="top"
      ref={ref}
      className="relative overflow-hidden pt-36 sm:pt-44"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 100);
        my.set(((e.clientY - r.top) / r.height) * 100);
      }}
    >
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(201,168,106,.16),transparent)]" />
      <div className="pointer-events-none absolute top-40 right-[-10%] h-[380px] w-[380px] bg-[radial-gradient(closest-side,rgba(201,168,106,.16),transparent)]" />

      <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
        <motion.a
          href="#contact"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="beam mx-auto inline-flex items-center gap-2.5 rounded-full bg-white/[0.04] px-4 py-1.5 text-[13px] text-soft "
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
          </span>
          Open to work · Moving to Dublin, January 2027
        </motion.a>

        <h1 className="mt-8 font-display text-[clamp(44px,9vw,128px)] font-bold leading-[0.92] tracking-[-0.05em]">
          <BlurWords text="I engineer" delay={0.15} />
          <br />
          <span className="inline-grid overflow-hidden pb-[0.08em] align-bottom">
            {ROLES.map((r, n) => (
              <motion.span
                key={r}
                className="grad col-start-1 row-start-1 whitespace-nowrap"
                initial={false}
                animate={{ y: n === i ? "0%" : n === (i + ROLES.length - 1) % ROLES.length ? "-110%" : "110%", opacity: n === i ? 1 : 0 }}
                transition={{ duration: 0.7, ease }}
              >
                {r}
              </motion.span>
            ))}
          </span>
        </h1>

        <Reveal delay={0.5} className="mx-auto mt-8 max-w-2xl">
          <p className="text-[clamp(16px,1.6vw,20px)] leading-relaxed text-soft">
            I'm <span className="text-ink">Kevin Matos</span>, a full stack & AI engineer. I take SaaS products from an empty repo to paying customers, database, APIs, frontend, payments, deploy, and put <span className="text-ink">LLM agents and RAG</span> into production where they pay off.
          </p>
        </Reveal>
        <Reveal delay={0.65} className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href="#work" primary>
            See my work ↓
          </Button>
          <Button href={LINKS.cv}>Download CV</Button>
          <Button href={LINKS.linkedin}>LinkedIn ↗</Button>
          <Button href={LINKS.github}>GitHub ↗</Button>
        </Reveal>
        <Reveal delay={0.8} className="mx-auto mt-10 max-w-3xl">
          <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-line2 bg-white/[0.02] text-left sm:grid-cols-4">
            {[
              ["Role", "Full Stack & AI Engineer"],
              ["Experience", "2+ years in production"],
              ["Core stack", "Python · TypeScript · Next.js"],
              ["Ireland", "Dublin, Jan 2027 · Stamp 2"],
            ].map(([k, v]) => (
              <div key={k} className="border-line p-4 odd:border-r sm:border-r sm:last:border-r-0 [&:nth-child(-n+2)]:border-b sm:[&:nth-child(-n+2)]:border-b-0">
                <div className="font-mono text-[10px] uppercase tracking-widest text-dim">{k}</div>
                <div className="mt-1 text-sm text-ink">{v}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <HeroScene />
    </header>
  );
}

function Marquee() {
  const row = (items, cls) => (
    <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      <div className={`flex shrink-0 gap-3 pr-3 ${cls}`}>
        {[...items, ...items].map((t, i) => (
          <span key={i} className="whitespace-nowrap rounded-full border border-line bg-white/[0.02] px-5 py-2.5 font-mono text-sm text-soft">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
  return (
    <div className="relative z-10 space-y-3 py-14">
      {row(STACK.slice(0, 13), "marquee")}
      {row(STACK.slice(13), "marquee-rev")}
    </div>
  );
}

/* ---------------- stats ---------------- */

function Stats() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <Spotlight className="beam h-full rounded-2xl border border-line bg-card p-6 sm:p-8">
              <div className="font-display text-[clamp(40px,5vw,68px)] font-bold leading-none tracking-[-0.04em]">
                <Counter to={s.n} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <p className="mt-4 text-sm text-soft">{s.label}</p>
            </Spotlight>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- work: sticky stacking cards ---------------- */

const LOGO_OF = {
  agro: PRODUCT_LOGOS[0],
  farm: PRODUCT_LOGOS[1],
  school: PRODUCT_LOGOS[2],
  corvus: PRODUCT_LOGOS[3],
  prospect: PRODUCT_LOGOS[4],
};

function CaseCard({ c, i, total, progress, onOpen, onActive }) {
  const holder = useRef(null);
  const seen = useInView(holder, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (seen) onActive(c.id);
  }, [seen, c.id, onActive]);
  const targetScale = 1 - (total - 1 - i) * 0.04;
  const scale = useTransform(progress, [i / total, 1], [1, targetScale]);
  return (
    <div ref={holder} className="flex items-start pt-4 sm:sticky sm:top-24 sm:min-h-[calc(100svh-6rem)]">
      <motion.article
        style={{ scale, top: `${i * 18}px` }}
        className="relative w-full origin-top overflow-hidden rounded-[28px] border border-line2 bg-card shadow-[0_-20px_60px_-20px_rgba(0,0,0,.8)]"
      >
        <div className="pointer-events-none absolute -top-32 right-0 h-72 w-72" style={{ background: `radial-gradient(closest-side, ${c.color}, transparent)`, opacity: 0.3 }} />
        <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12">
          <div className="relative flex min-w-0 flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-dim">{String(i + 1).padStart(2, "0")}</span>
              <span className="rounded-full border border-line2 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-soft">{c.kind}</span>
              <span className="rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-bg" style={{ background: c.color }}>
                {c.badge}
              </span>
            </div>
            <div className="mt-5 flex items-center gap-4">
              {LOGO_OF[c.id] && (
                <span className={`flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 sm:size-14 ${LOGO_OF[c.id].light ? "bg-white" : "bg-[#0b0b0b]"}`}>
                  <img src={LOGO_OF[c.id].src} alt="" className="size-full object-contain p-1.5" />
                </span>
              )}
              <h3 className="font-display text-[clamp(34px,4.4vw,58px)] font-bold leading-none tracking-[-0.04em]">{c.name}</h3>
            </div>
            <p className="mt-4 text-[17px] leading-relaxed text-ink/90">{c.lede}</p>
            {c.metrics && (
              <div className="mt-6 grid grid-cols-3 gap-2">
                {c.metrics.map(([v, l]) => (
                  <div key={l} className="rounded-xl border border-line bg-white/[0.02] p-3">
                    <div className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">{v}</div>
                    <div className="mt-1 text-[11px] leading-snug text-soft">{l}</div>
                  </div>
                ))}
              </div>
            )}
            <ul className="mt-6 hidden space-y-3 sm:block">
              {c.points.map(([k, v]) => (
                <li key={k} className="grid grid-cols-[110px_1fr] gap-3 border-t border-line pt-3 text-sm">
                  <span className="font-medium text-ink">{k}</span>
                  <span className="text-soft">{v}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 hidden rounded-xl border border-line bg-white/[0.02] p-4 sm:block">
              <div className="font-mono text-[10px] uppercase tracking-widest text-dim">What it shows</div>
              <p className="mt-1.5 text-[15px] text-ink">{c.meaning}</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-1.5">
              {c.tags.map((t) => (
                <span key={t} className="rounded-md bg-white/[0.05] px-2.5 py-1 font-mono text-[11px] text-soft">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button onClick={() => onOpen(c.id)} className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-ink py-2.5 pl-5 pr-2.5 text-sm font-medium text-bg">
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-vio to-cy transition-transform duration-500 group-hover:translate-x-0" />
                <span className="relative group-hover:text-white">How it works</span>
                <kbd className="relative rounded-md bg-bg/10 px-1.5 py-0.5 font-mono text-[11px] group-hover:bg-white/20 group-hover:text-white">D</kbd>
              </button>
              {c.url && (
                <a href={c.url} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 rounded-full border border-line2 px-5 py-2.5 text-sm font-medium hover:border-white/50">
                  Visit live
                  <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                </a>
              )}
            </div>
          </div>

          <DepthScene c={c} />
        </div>
      </motion.article>
    </div>
  );
}



function DepthScene({ c }) {
  return (
    <div className="group relative flex min-h-[220px] min-w-0 items-center px-2 pb-8 sm:min-h-[380px]">
      <div className="pointer-events-none absolute -inset-6" style={{ background: `radial-gradient(closest-side, ${c.color}, transparent)`, opacity: 0.25 }} />
      <div className="relative w-full transition-transform duration-700 ease-out group-hover:scale-[1.02]">
        {c.video ? (
          <div className="overflow-hidden rounded-xl border border-line2 bg-card shadow-2xl shadow-black/60">
            <div className="flex h-8 items-center gap-1.5 border-b border-line bg-[#141414] px-3">
              <i className="size-2.5 rounded-full bg-[#ff5f57]" />
              <i className="size-2.5 rounded-full bg-[#febc2e]" />
              <i className="size-2.5 rounded-full bg-[#28c840]" />
              <span className="mx-auto truncate rounded-md bg-white/5 px-3 py-0.5 font-mono text-[10px] text-dim">{c.url.replace("https://", "")}</span>
            </div>
            <LazyVideo src={c.video} className="aspect-[16/10] w-full" />
          </div>
        ) : (
          <Browser src={c.desktop} url={c.url ?? "localhost:3000"} />
        )}
        {c.extra && (
          <div className="absolute -bottom-6 left-2 w-[50%] -rotate-3 transition-transform duration-700 group-hover:-translate-y-2">
            <Browser src={c.extra} url="rentals · map" />
          </div>
        )}
        {c.mobile && (
          <div className="absolute -bottom-6 right-2 w-[26%] rotate-3 transition-transform duration-700 group-hover:-translate-y-3">
            <Phone src={c.mobile} />
          </div>
        )}
      </div>
    </div>
  );
}

/* poster is the video's own first frame, so swapping in the video never flashes;
   it starts loading a screen early and only plays while visible */
function LazyVideo({ src, className = "" }) {
  const box = useRef(null);
  const ref = useRef(null);
  const near = useInView(box, { margin: "100% 0px 100% 0px" });
  const seen = useInView(box, { margin: "-15% 0px -15% 0px" });
  const [ready, setReady] = useState(false);
  const poster = src.replace(".mp4", ".jpg");
  useEffect(() => {
    const v = ref.current;
    if (!v || !ready) return;
    if (seen) v.play().catch(() => {});
    else v.pause();
  }, [seen, ready]);
  return (
    <div ref={box} className={`relative overflow-hidden bg-[#0e0e0e] ${className}`}>
      <img src={poster} alt="" decoding="async" className="absolute inset-0 h-full w-full object-cover object-top" />
      {near && (
        <video
          ref={ref}
          src={src}
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setReady(true)}
          className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}

/* ---------------- deep dive modal ---------------- */

const TABS = [
  ["overview", "Overview"],
  ["flow", "Architecture"],
  ["db", "Data model"],
  ["ai", "AI & logic"],
  ["decisions", "Decisions"],
];

function DeepDive({ id, onClose, onNav }) {
  const c = CASES.find((x) => x.id === id);
  const d = DEEP[id];
  const [tab, setTab] = useState("overview");
  const idx = CASES.findIndex((x) => x.id === id);
  useEffect(() => {
    const k = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(CASES[(idx + 1) % CASES.length].id);
      if (e.key === "ArrowLeft") onNav(CASES[(idx - 1 + CASES.length) % CASES.length].id);
      const n = Number(e.key);
      if (n >= 1 && n <= TABS.length) setTab(TABS[n - 1][0]);
    };
    addEventListener("keydown", k);
    document.documentElement.style.overflow = "hidden";
    return () => {
      removeEventListener("keydown", k);
      document.documentElement.style.overflow = "";
    };
  }, [idx, onClose, onNav]);
  return (
    <motion.div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <motion.div
        key={id}
        initial={{ y: 60, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.5, ease }}
        className="relative flex h-[92svh] w-full max-w-5xl flex-col sm:h-[86svh] overflow-hidden rounded-t-3xl border border-line2 bg-[#0d0d11] shadow-2xl sm:rounded-3xl"
      >
        <div className="pointer-events-none absolute -top-24 left-1/3 h-60 w-96" style={{ background: `radial-gradient(closest-side, ${c.color}, transparent)`, opacity: 0.3 }} />
        <div className="relative flex shrink-0 items-start justify-between gap-4 border-b border-line p-5 sm:p-7">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-dim">How it works · {String(idx + 1).padStart(2, "0")}/{String(CASES.length).padStart(2, "0")}</div>
            <h3 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">{c.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onNav(CASES[(idx - 1 + CASES.length) % CASES.length].id)} className="hidden size-9 items-center justify-center rounded-full border border-line2 hover:border-white/50 sm:flex">←</button>
            <button onClick={() => onNav(CASES[(idx + 1) % CASES.length].id)} className="hidden size-9 items-center justify-center rounded-full border border-line2 hover:border-white/50 sm:flex">→</button>
            <button onClick={onClose} className="flex h-9 items-center gap-2 rounded-full border border-line2 px-3 text-sm hover:border-white/50">
              Close <kbd className="font-mono text-[10px] text-dim">ESC</kbd>
            </button>
          </div>
        </div>
        <div className="relative flex shrink-0 gap-1 overflow-x-auto border-b border-line px-4 py-2 sm:px-6">
          {TABS.map(([k, label], n) => (
            <button key={k} onClick={() => setTab(k)} className={`relative shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${tab === k ? "text-bg" : "text-soft hover:text-ink"}`}>
              {tab === k && <motion.span layoutId="ddtab" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
              <span className="relative">
                {label} <span className="font-mono text-[10px] opacity-50">{n + 1}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease }}>
              {tab === "overview" && <Overview c={c} />}
              {tab === "flow" && <Flow lanes={d.flow} color={c.color} />}
              {tab === "db" && (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {d.db.map(([t, cols], n) => (
                    <motion.div key={t} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: n * 0.06 }} className="overflow-hidden rounded-xl border border-line2 bg-card">
                      <div className="flex items-center gap-2 border-b border-line bg-white/[0.03] px-4 py-2.5 font-mono text-sm">
                        <span style={{ color: c.color }}>▦</span> {t}
                      </div>
                      {cols.map((col, m) => (
                        <div key={col} className="flex justify-between px-4 py-1.5 font-mono text-[12.5px] text-soft">
                          <span>{col}</span>
                          <span className="text-dim">{m === 0 ? "PK" : col.endsWith("_id") ? "FK" : ""}</span>
                        </div>
                      ))}
                    </motion.div>
                  ))}
                </div>
              )}
              {tab === "ai" && (
                <ol className="relative space-y-3">
                  {d.ai.map(([k, v], n) => (
                    <motion.li key={k} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: n * 0.1, ease }} className="relative flex gap-4 rounded-xl border border-line bg-card p-4">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full font-mono text-sm font-medium text-bg" style={{ background: c.color }}>
                        {n + 1}
                      </span>
                      <div>
                        <div className="font-medium">{k}</div>
                        <div className="text-[15px] text-soft">{v}</div>
                      </div>
                    </motion.li>
                  ))}
                </ol>
              )}
              {tab === "decisions" && (
                <div className="grid gap-3 md:grid-cols-3">
                  {d.decisions.map(([k, v], n) => (
                    <motion.div key={k} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: n * 0.08 }} className="rounded-xl border border-line bg-card p-5">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-dim">Decision {n + 1}</div>
                      <div className="mt-2 font-display text-xl font-semibold leading-tight">{k}</div>
                      <p className="mt-2 text-[15px] text-soft">{v}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="relative hidden shrink-0 justify-between border-t border-line px-7 py-3 font-mono text-[11px] text-dim sm:flex">
          <span>1 to 5 switch tabs · ← → other projects · ESC close</span>
          <span>{c.tags.join(" · ")}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* animated architecture lanes with travelling packets */
function Overview({ c }) {
  const pics = [c.desktop, c.extra, c.mobile, ...(c.gallery ?? [])].filter(Boolean);
  const [copied, setCopied] = useState(false);
  return (
    <div className="space-y-6">
      {c.video ? (
        <video src={c.video} poster={c.video.replace(".mp4", ".jpg")} autoPlay muted loop playsInline controls className="aspect-[16/10] max-h-[52vh] w-full rounded-xl border border-line2 bg-black object-contain" />
      ) : (
        <img src={c.desktop} alt="" className="aspect-[16/10] max-h-[52vh] w-full rounded-xl border border-line2 object-cover object-top" />
      )}
      <p className="max-w-3xl text-lg leading-relaxed text-ink/90">{c.lede}</p>
      {c.metrics && (
        <div className="grid grid-cols-3 gap-3">
          {c.metrics.map(([v, l]) => (
            <div key={l} className="rounded-xl border border-line bg-white/[0.02] p-4">
              <div className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{v}</div>
              <div className="mt-1 text-xs text-soft">{l}</div>
            </div>
          ))}
        </div>
      )}
      {pics.length > 1 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {pics.map((p) => (
            <img key={p} src={p} alt="" loading="lazy" className="aspect-[4/3] w-full rounded-xl border border-line object-cover object-top" />
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        {c.url && (
          <a href={c.url} target="_blank" rel="noreferrer" className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg">
            Visit live ↗
          </a>
        )}
        <button
          onClick={() => {
            navigator.clipboard?.writeText(location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          }}
          className="rounded-full border border-line2 px-5 py-2.5 text-sm hover:border-white/50"
        >
          {copied ? "Link copied ✓" : "Copy link to this project"}
        </button>
      </div>
    </div>
  );
}

function Flow({ lanes, color }) {
  return (
    <div className="relative">
      <div className="grid gap-3 md:grid-cols-5 md:gap-0">
        {lanes.map(([lane, items], n) => (
          <div key={lane} className="relative md:px-2">
            {n < lanes.length - 1 && (
              <div className="absolute right-[-10px] top-1/2 z-10 hidden h-px w-5 overflow-hidden bg-line2 md:block">
                <motion.i className="absolute top-[-1.5px] block size-1 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} animate={{ x: [-6, 24] }} transition={{ duration: 1.2, repeat: Infinity, delay: n * 0.3, ease: "linear" }} />
              </div>
            )}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: n * 0.08, ease }} className="h-full rounded-2xl border border-line2 bg-card p-4">
              <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest" style={{ color }}>
                <span className="size-1.5 rounded-full" style={{ background: color }} />
                {lane}
              </div>
              <div className="space-y-2">
                {items.map((it) => (
                  <div key={it} className="rounded-lg border border-line bg-white/[0.03] px-3 py-2 text-[13.5px]">
                    {it}
                  </div>
                ))}
              </div>
            </motion.div>
            {n < lanes.length - 1 && <div className="mx-auto h-3 w-px bg-line2 md:hidden" />}
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm text-dim">Requests flow left to right. Moving dots show where data travels between layers.</p>
    </div>
  );
}

function useHashProject() {
  const read = () => (location.hash.startsWith("#project/") ? location.hash.slice(9) : null);
  const [id, setId] = useState(read);
  useEffect(() => {
    const on = () => setId(read());
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);
  return CASES.some((c) => c.id === id) ? id : null;
}

function Work() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const open = useHashProject();
  const setOpen = (id) => {
    if (id) location.hash = `project/${id}`;
    else history.replaceState(null, "", location.pathname + location.search);
    dispatchEvent(new HashChangeEvent("hashchange"));
  };
  const [active, setActive] = useState(null);
  const inWork = useInView(ref, { margin: "-30% 0px -30% 0px" });
  useEffect(() => {
    const k = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || /input|textarea/i.test(e.target.tagName)) return;
      if (e.key.toLowerCase() === "d" && !open && inWork && active) setOpen(active);
    };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [open, inWork, active]);
  return (
    <section id="work" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHead index="01" eyebrow="Selected work" title={<>Products, <span className="grad">not tutorials.</span></>} sub={<>Each one solved a concrete problem for real users. Watch them run, then open <span className="text-ink">How it works</span> (or press <kbd className="rounded border border-line2 px-1.5 font-mono text-sm text-ink">D</kbd>) for the architecture, data model and AI pipeline.</>} />
      <div ref={ref} className="relative">
        {CASES.map((c, i) => (
          <CaseCard key={c.id} c={c} i={i} total={CASES.length} progress={scrollYProgress} onOpen={setOpen} onActive={setActive} />
        ))}
      </div>
      {createPortal(<AnimatePresence>{open && <DeepDive id={open} onClose={() => setOpen(null)} onNav={setOpen} />}</AnimatePresence>, document.body)}
    </section>
  );
}

/* ---------------- lab ---------------- */

function RepoCard({ r }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="group relative h-full min-h-[340px] overflow-hidden rounded-2xl border border-line bg-card transition-colors hover:border-line2"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((o) => !o)}
    >
      <div className="flex h-full flex-col p-6">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-mono text-xs text-soft">
            <i className="size-2.5 rounded-full" style={{ background: r.color }} />
            {r.lang}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-dim">hover · architecture</span>
        </div>
        <h4 className="mt-5 font-display text-2xl font-semibold tracking-tight">{r.name}</h4>
        <p className="mt-3 flex-1 text-[15px] leading-relaxed text-soft">{r.desc}</p>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {r.proof.map((p) => (
            <span key={p} className="rounded-md border border-vio/30 bg-vio/10 px-2 py-0.5 font-mono text-[11px] text-[#d9bf8a]">
              {p}
            </span>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.45, ease }}
            className="absolute inset-0 flex flex-col bg-[#0a0a0a]/[.97] p-5 "
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-dim">Request path</span>
              <a href={`${LINKS.github}/${r.name}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="rounded-full border border-line2 px-3 py-1 font-mono text-[11px] text-ink hover:border-white/50">
                code ↗
              </a>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-1">
              {r.arch.map((step, n) => (
                <motion.span key={step} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + n * 0.07 }} className="flex items-center gap-1">
                  <span className="rounded-md border border-cy/30 bg-cy/10 px-2 py-1 font-mono text-[11px] text-[#d6d8dc]">{step}</span>
                  {n < r.arch.length - 1 && <span className="text-dim">→</span>}
                </motion.span>
              ))}
            </div>
            <pre className="mt-4 flex-1 overflow-auto rounded-xl border border-line bg-black/50 p-3 font-mono text-[10.5px] leading-[1.6] whitespace-pre-wrap text-soft">
              <code>{r.code}</code>
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Lab() {
  return (
    <section id="lab" className="relative border-y border-line bg-bg2/60 py-28">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead index="02" eyebrow="Engineering lab" title={<>Open source, <span className="grad">built to be read.</span></>} sub="Public repos where I go deep on backend fundamentals: tenant isolation, money-safe concurrency, retrieval quality and observability. Hover or tap a card to see the request path and the core code." />
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
          {REPOS.map((r, i) => (
            <Reveal key={r.name} delay={(i % 3) * 0.08} className="h-full w-[82vw] shrink-0 snap-center sm:w-auto">
              <RepoCard r={r} />
            </Reveal>
          ))}
        </div>
        <div className="mt-6">
          <GitHubActivity />
        </div>
      </div>
    </section>
  );
}

/* ---------------- skills ---------------- */

function Skills() {
  const [open, setOpen] = useState(0);
  return (
    <section id="skills" className="mx-auto max-w-6xl px-4 py-28 sm:px-6">
      <SectionHead index="03" eyebrow="What I do" title={<>Five things I do <span className="grad">really well.</span></>} sub="Every line here points to something running in production, open a discipline to see what I deliver, the tools and where it shipped." />
      <div className="border-t border-line2">
        {CAPS.map((c, n) => {
          const on = open === n;
          return (
            <div key={c.name} className="border-b border-line2">
              <button onClick={() => setOpen(on ? -1 : n)} className="group flex w-full items-baseline gap-4 py-7 text-left sm:gap-8">
                <span className="font-mono text-xs text-vio">{c.n}</span>
                <span className={`font-display text-[clamp(28px,4.5vw,56px)] font-bold leading-none tracking-[-0.04em] transition-colors ${on ? "text-ink" : "text-dim group-hover:text-soft"}`}>{c.name}</span>
                <span className="ml-auto hidden max-w-xs text-right text-sm text-soft md:block">{c.line}</span>
                <motion.span animate={{ rotate: on ? 45 : 0 }} className="text-2xl font-light text-soft">+</motion.span>
              </button>
              <AnimatePresence initial={false}>
                {on && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease }} className="overflow-hidden">
                    <div className="grid gap-8 pb-10 md:grid-cols-[1fr_1fr_1.1fr]">
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-dim">What I deliver</div>
                        <ul className="mt-4 space-y-3">
                          {c.does.map((d) => (
                            <li key={d} className="flex gap-3 text-[15px] text-ink/90">
                              <span className="mt-2 size-1 shrink-0 rounded-full bg-vio" />
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-dim">Tools</div>
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {c.tools.map((t) => (
                            <span key={t} className="rounded-full border border-line2 px-3 py-1 font-mono text-[11px] text-soft">{t}</span>
                          ))}
                        </div>
                        <div className="mt-6 font-mono text-[10px] uppercase tracking-widest text-dim">Shipped in</div>
                        <div className="mt-3 space-y-1.5">
                          {c.proof.map((p) => (
                            <div key={p} className="text-sm text-[#d9bf8a]">→ {p}</div>
                          ))}
                        </div>
                      </div>
                      <motion.div initial={{ scale: 1.08, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, ease }} className="overflow-hidden rounded-2xl border border-line2">
                        <img src={c.img} alt="" className="aspect-[16/10] w-full object-cover object-top grayscale-[.3]" />
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- parallax gallery ---------------- */

const GALLERY = [
  ["/kevin/shots/agro.jpg", "/kevin/shots/comply.jpg", "/kevin/shots/farm.jpg", "/kevin/shots/lara.jpg", "/kevin/shots/school.jpg", "/kevin/shots/mackei.jpg"],
  ["/kevin/shots/prospect-map.jpg", "/kevin/shots/easymei.jpg", "/kevin/shots/corvus.jpg", "/kevin/shots/eximia.jpg", "/kevin/shots/prospect-jobs.jpg", "/kevin/shots/delmaso.jpg"],
];

function Gallery() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const a = useTransform(scrollYProgress, [0, 1], ["0%", "-28%"]);
  const b = useTransform(scrollYProgress, [0, 1], ["-28%", "0%"]);
  return (
    <section ref={ref} className="relative overflow-hidden py-24">
      <div className="space-y-5">
        {GALLERY.map((row, n) => (
          <motion.div key={n} style={{ x: n ? b : a }} className="flex w-max gap-5">
            {[...row, ...row].map((src, k) => (
              <div key={k} className="w-[60vw] shrink-0 overflow-hidden rounded-2xl border border-line2 shadow-2xl shadow-black sm:w-[34vw] lg:w-[26vw]">
                <img src={src} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover object-top" />
              </div>
            ))}
          </motion.div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#050505_95%)]" />
    </section>
  );
}

/* ---------------- page-wide particles + cursor glow ---------------- */

function Ambient() {
  const mxRaw = useMotionValue(0);
  const myRaw = useMotionValue(0);
  const mx = useSpring(mxRaw, { stiffness: 50, damping: 20 });
  const my = useSpring(myRaw, { stiffness: 50, damping: 20 });
  const gx = useMotionValue(-999);
  const gy = useMotionValue(-999);
  const gsx = useSpring(gx, { stiffness: 120, damping: 25 });
  const gsy = useSpring(gy, { stiffness: 120, damping: 25 });
  useEffect(() => {
    const move = (e) => {
      mxRaw.set(e.clientX / innerWidth - 0.5);
      myRaw.set(e.clientY / innerHeight - 0.5);
      gx.set(e.clientX);
      gy.set(e.clientY);
    };
    addEventListener("pointermove", move);
    return () => removeEventListener("pointermove", move);
  }, [mxRaw, myRaw, gx, gy]);
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Particles mx={mx} my={my} className="inset-0 h-full w-full" density={0.8} />
      <motion.div className="absolute left-0 top-0 -ml-[260px] -mt-[260px] size-[520px] rounded-full bg-[radial-gradient(circle,rgba(201,168,106,.09),transparent_60%)] will-change-transform" style={{ x: gsx, y: gsy }} />
    </div>
  );
}

/* ---------------- studio ---------------- */

function Studio() {
  const [all, setAll] = useState(false);
  const list = all ? SITES : SITES.slice(0, 8);
  return (
    <section id="studio" className="border-t border-line bg-bg2/60 pb-28">
      <div className="mx-auto max-w-6xl px-4 pt-28 sm:px-6">
        <SectionHead index="04" eyebrow="Comply studio" title={<>40+ sites for <span className="grad">real businesses.</span></>} sub="Through Comply, my studio, I design and build websites for law firms, accountants, makers and agencies with React, Vite, GSAP and three.js. It's where I learned to talk to clients, scope and deliver on deadline." />
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:overflow-visible sm:px-0 sm:pb-0">
          {(typeof window !== "undefined" && innerWidth < 640 ? SITES : list).map((s, n) => (
            <Reveal key={s.name} delay={(n % 2) * 0.08} className="w-[82vw] shrink-0 snap-center sm:w-auto">
              <SiteCard s={s} />
            </Reveal>
          ))}
        </div>
        <div className="mt-3 text-center font-mono text-[11px] text-dim sm:hidden">swipe →</div>
        {!all && (
          <div className="mt-14 hidden text-center sm:block">
            <button onClick={() => setAll(true)} className="rounded-full border border-line2 px-6 py-3 text-sm text-soft transition-colors hover:border-white/50 hover:text-ink">
              Show all {SITES.length} projects
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function SiteCard({ s, className }) {
  return (
    <a href={s.url} target="_blank" rel="noreferrer" className={`group block ${className ?? ""}`}>
      <div className="overflow-hidden rounded-2xl border border-line2 bg-card">
        <div className="aspect-[16/10] overflow-hidden">
          <img src={s.shot} alt={`${s.name} website`} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <div className="font-display text-xl font-semibold tracking-tight">{s.name}</div>
          <div className="text-sm text-soft">{s.what}</div>
        </div>
        <span className="flex size-10 items-center justify-center rounded-full border border-line2 transition-all group-hover:rotate-45 group-hover:border-white/60">↗</span>
      </div>
    </a>
  );
}

/* ---------------- experience ---------------- */

function Experience() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const h = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });
  return (
    <section id="path" className="mx-auto max-w-6xl px-4 py-28 sm:px-6">
      <SectionHead index="05" eyebrow="Experience" title={<>Where I've <span className="grad">been building.</span></>} />
      <div ref={ref} className="relative pl-8 sm:pl-12">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-line2 sm:left-[11px]" />
        <motion.div style={{ scaleY: h }} className="absolute left-[7px] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-vio to-cy sm:left-[11px]" />
        {JOBS.map((j, i) => (
          <Reveal key={j.co} delay={0.05}>
            <div className="relative grid gap-3 pb-14 md:grid-cols-[200px_1fr_1.2fr] md:gap-8">
              <span className="absolute -left-8 top-1.5 size-4 rounded-full border-2 border-bg bg-gradient-to-br from-vio to-cy sm:-left-12 sm:size-6" />
              <div className="font-mono text-xs uppercase tracking-wider text-dim md:pt-2">{j.when}</div>
              <div>
                <h4 className="font-display text-3xl font-bold tracking-tight">{j.co}</h4>
                <div className="mt-1 text-[15px] text-[#d9bf8a]">{j.role}</div>
              </div>
              <ul className="space-y-2 text-[15px] text-soft">
                {j.pts.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span className="mt-2.5 h-px w-3 shrink-0 bg-cy" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <h3 className="mt-6 font-mono text-xs uppercase tracking-widest text-soft">Certifications</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {CERTS.map((c) => (
            <div key={c.name} className="group flex gap-4 rounded-2xl border border-line bg-card p-4 transition-colors hover:border-vio/50">
              <a href={c.url} target="_blank" rel="noreferrer" className="block w-28 shrink-0 overflow-hidden rounded-lg border border-line sm:w-36">
                <img src={c.img} alt={`${c.name} certificate`} loading="lazy" className="w-full transition-transform duration-500 group-hover:scale-105" />
              </a>
              <div className="min-w-0">
                <div className="font-mono text-[11px] uppercase tracking-wider text-dim">{c.org} · {c.date}</div>
                <h4 className="mt-1 font-display text-xl font-bold tracking-tight">{c.name}</h4>
                <p className="mt-1 text-sm text-soft">{c.note}</p>
                <div className="mt-2 flex gap-4 text-sm">
                  <a href={c.url} target="_blank" rel="noreferrer" className="text-[#d9bf8a] hover:underline">View certificate</a>
                  {c.verify && <a href={c.verify} target="_blank" rel="noreferrer" className="text-soft hover:text-ink hover:underline">Verify</a>}
                  {c.repo && <a href={c.repo} target="_blank" rel="noreferrer" className="text-soft hover:text-ink hover:underline">Project code</a>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------- contact ---------------- */

function Contact() {
  const [copied, setCopied] = useState(false);
  return (
    <section id="contact" className="relative overflow-hidden border-t border-line py-32">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute bottom-[-30%] left-1/2 h-[500px] w-[900px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(201,168,106,.16),transparent)]" />
      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
        <Reveal>
          <div className="font-mono text-xs uppercase tracking-widest text-soft">09 · Contact</div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 font-display text-[clamp(52px,11vw,160px)] font-bold leading-[0.88] tracking-[-0.055em]">
            Let's build
            <br />
            <span className="grad">something.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-xl text-lg text-soft">Relocating to Dublin in January 2027 · fluent English (C2) · Stamp 2 planned. Open to part-time roles and to long-term roles with employment-permit support.</p>
        </Reveal>
        <Reveal delay={0.3} className="mt-10 flex flex-col items-center gap-5">
          <Magnetic strength={0.2}>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(LINKS.email);
                setCopied(true);
                setTimeout(() => setCopied(false), 1800);
              }}
              className="beam rounded-full bg-white/[0.04] px-7 py-4 font-display text-[clamp(18px,2.6vw,28px)] font-medium tracking-tight "
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={copied ? "c" : "e"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="inline-block">
                  {copied ? "Copied to clipboard ✓" : LINKS.email}
                </motion.span>
              </AnimatePresence>
            </button>
          </Magnetic>
          <div className="flex flex-wrap justify-center gap-3">
            <Button href={`mailto:${LINKS.email}`} primary>
              Send an email
            </Button>
            <Button href={LINKS.linkedin}>LinkedIn ↗</Button>
            <Button href={LINKS.github}>GitHub ↗</Button>
            <Button href={LINKS.cv}>CV (PDF)</Button>
            <Button href={LINKS.call || `mailto:${LINKS.email}?subject=${encodeURIComponent("20-min call")}&body=${encodeURIComponent("Hi Kevin,\n\nCould we have a 20-minute call? A few times that work for me (Irish time):\n\n- \n- \n\nThanks!")}`}>Book a call</Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- now: what I'm building ---------------- */

function Now() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [160, -160]);
  const y3 = useTransform(scrollYProgress, [0, 1], [-40, 60]);
  const [p, setP] = useState(0);
  const [f, setF] = useState(0);
  const N = NOW[p];
  const pics = [N.shots.main, N.shots.b, N.shots.a, N.shots.c];
  return (
    <section id="now" ref={ref} className="relative mx-auto max-w-6xl px-4 py-28 sm:px-6">
      <div className="mb-8 flex flex-wrap gap-2">
        {NOW.map((item, i) => (
          <button key={item.name} onClick={() => { setP(i); setF(0); }} className={`rounded-full border px-4 py-1.5 font-mono text-xs transition-colors ${p === i ? "border-vio/60 bg-vio/10 text-ink" : "border-line text-soft hover:border-line2 hover:text-ink"}`}>
            {item.name}
          </button>
        ))}
      </div>
      <SectionHead index="06" eyebrow="Now building" title={<>{N.title ?? N.name} <span className="grad">{N.line}</span></>} sub={N.desc} />
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.25fr]">
        <div>
          <div className="space-y-2">
            {N.features.map(([k, v], n) => (
              <button key={k} onMouseEnter={() => setF(n)} onClick={() => setF(n)} className={`relative block w-full overflow-hidden rounded-2xl border p-5 text-left transition-colors ${f === n ? "border-vio/50 bg-white/[0.03]" : "border-line hover:border-line2"}`}>
                {f === n && <motion.span layoutId="nowbar" className="absolute inset-y-0 left-0 w-0.5 bg-vio" />}
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-xl font-semibold tracking-tight">{k}</span>
                  <span className="font-mono text-[11px] text-dim">0{n + 1}</span>
                </div>
                <p className="mt-1 text-sm text-soft">{v}</p>
              </button>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-1.5">
            {N.stack.map((t) => (
              <span key={t} className="rounded-full border border-line2 px-3 py-1 font-mono text-[11px] text-soft">{t}</span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-dim">
            <span className="inline-flex items-center gap-2"><span className="size-1.5 animate-pulse rounded-full bg-vio" /> {N.status}</span>
            {N.url && <a href={N.url} target="_blank" rel="noreferrer" className="text-[#d9bf8a] hover:underline">Visit live ↗</a>}
          </div>
        </div>
        <div className="relative pb-10 pr-6 [perspective:1400px]">
          <motion.div style={{ y: y1 }}>
            <div className="overflow-hidden rounded-xl border border-line2 bg-card shadow-2xl shadow-black">
              <div className="flex h-7 items-center gap-1.5 border-b border-line bg-[#141414] px-3">
                <i className="size-2 rounded-full bg-white/20" /><i className="size-2 rounded-full bg-white/20" /><i className="size-2 rounded-full bg-white/20" />
              </div>
              <div className="relative aspect-[16/10]">
                <AnimatePresence mode="popLayout">
                  <motion.img key={`${p}-${f}`} src={pics[f]} alt="" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease }} className="absolute inset-0 h-full w-full object-cover object-top" />
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
          {N.shots.phone && (
            <motion.div style={{ y: y2 }} className="absolute -bottom-6 right-0 w-[26%]">
              <Phone src={N.shots.phone} />
            </motion.div>
          )}
          {N.shots.phone2 && (
            <motion.div style={{ y: y3 }} className="absolute -left-4 -top-8 hidden w-[24%] rotate-[-6deg] sm:block">
              <Phone src={N.shots.phone2} />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------- github activity ---------------- */

function GitHubActivity() {
  const user = LINKS.github.split("/").pop();
  return (
    <section>
      <Reveal>
        <a href={LINKS.github} target="_blank" rel="noreferrer" className="group block rounded-3xl border border-line bg-card/70 p-6 transition-colors hover:border-line2 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-dim">GitHub · last 12 months</div>
              <div className="mt-2 font-display text-2xl font-semibold tracking-tight">I ship every week.</div>
            </div>
            <span className="text-sm text-soft group-hover:text-ink">@{user} ↗</span>
          </div>
          <div className="mt-6 overflow-x-auto">
            <img src={`https://ghchart.rshah.org/c9a86a/${user}`} alt="GitHub contributions chart" loading="lazy" className="min-w-[680px] w-full opacity-90 [filter:invert(1)_hue-rotate(180deg)_saturate(1.3)] transition-opacity group-hover:opacity-100" />
          </div>
        </a>
      </Reveal>
    </section>
  );
}

/* ---------------- testimonials (only real quotes) ---------------- */

function Testimonials() {
  if (!TESTIMONIALS.length) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHead index="07" eyebrow="Kind words" title={<>What people <span className="grad">say.</span></>} />
      <div className="grid gap-4 md:grid-cols-2">
        {TESTIMONIALS.map(([q, name, role], n) => (
          <Reveal key={name} delay={n * 0.08}>
            <Spotlight className="h-full rounded-2xl border border-line bg-card p-8">
              <div className="font-display text-5xl leading-none text-vio">“</div>
              <p className="mt-2 text-lg leading-relaxed text-ink/90">{q}</p>
              <div className="mt-6 text-sm"><span className="text-ink">{name}</span> <span className="text-dim">· {role}</span></div>
            </Spotlight>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- cursor ring (desktop) ---------------- */

function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40 });
  const sy = useSpring(y, { stiffness: 500, damping: 40 });
  const [big, setBig] = useState(false);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches) return;
    setOn(true);
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setBig(!!e.target.closest?.("a,button"));
    };
    addEventListener("pointermove", move);
    return () => removeEventListener("pointermove", move);
  }, [x, y]);
  if (!on) return null;
  return (
    <motion.div style={{ x: sx, y: sy }} className="pointer-events-none fixed left-0 top-0 z-[70]">
      <motion.div animate={{ scale: big ? 2.4 : 1 }} transition={{ type: "spring", stiffness: 300, damping: 22 }} className="-ml-3 -mt-3 size-6 rounded-full border border-[#c9a86a]/80" />
    </motion.div>
  );
}

/* ---------------- engineering notes ---------------- */

function Notes() {
  const [open, setOpen] = useState(null);
  return (
    <section id="notes" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHead index="07" eyebrow="Engineering notes" title={<>How I think, <span className="grad">in writing.</span></>} sub="Short write-ups of real decisions from production work. The kind of thing we'd talk about in a technical interview." />
      <div className="space-y-3">
        {NOTES.map((n) => {
          const on = open === n.slug;
          return (
            <article key={n.slug} id={`note-${n.slug}`} className={`overflow-hidden rounded-2xl border bg-card/80 transition-colors ${on ? "border-line2" : "border-line hover:border-line2"}`}>
              <button onClick={() => setOpen(on ? null : n.slug)} className="flex w-full flex-col gap-3 p-6 text-left sm:flex-row sm:items-start sm:justify-between sm:p-8">
                <div className="max-w-2xl">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-vio">
                    {n.project} · {n.read}
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">{n.title}</h3>
                  <p className="mt-2 text-[15px] text-soft">{n.tldr}</p>
                </div>
                <span className="shrink-0 font-mono text-xs text-dim">{on ? "close ×" : "read →"}</span>
              </button>
              <AnimatePresence initial={false}>
                {on && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease }} className="overflow-hidden">
                    <div className="max-w-3xl space-y-4 px-6 pb-8 text-[16px] leading-relaxed text-ink/85 sm:px-8">
                      {n.body.map((t, k) => (
                        <p key={k}>{t}</p>
                      ))}
                      {n.code && (
                        <pre className="overflow-x-auto rounded-xl border border-line bg-black/50 p-4 font-mono text-[12.5px] leading-[1.65] text-soft">
                          <code>{n.code}</code>
                        </pre>
                      )}
                      {(n.after ?? []).map((t, k) => (
                        <p key={k}>{t}</p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- uses ---------------- */

function Uses() {
  return (
    <section id="uses" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <Reveal>
        <div className="rounded-3xl border border-line bg-card/70 p-6 sm:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-dim">/uses</div>
              <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight">What I build with</h3>
            </div>
            <a href={`${LINKS.github}/kevin-matos-portfolio`} target="_blank" rel="noreferrer" className="rounded-full border border-line2 px-4 py-2 font-mono text-xs text-soft hover:border-white/50 hover:text-ink">
              this site's source ↗
            </a>
          </div>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {USES.map(([k, items]) => (
              <div key={k}>
                <div className="font-mono text-[10px] uppercase tracking-widest text-vio">{k}</div>
                <ul className="mt-3 space-y-2 text-sm text-soft">
                  {items.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------- working in Ireland ---------------- */

const IRELAND = [
  ["Arrival", "Dublin, January 2027", "Relocating for study, planning to stay long term."],
  ["Permission", "Stamp 2 (planned)", "Up to 20 hours a week in term time and up to 40 hours in June to September and 15 December to 15 January."],
  ["Long term", "Open to an employment permit", "Looking for a long-term engineering role and happy to go through the permit process with an employer."],
  ["Language", "English C2 · Portuguese native", "Comfortable in interviews, stand-ups, code review and client calls."],
  ["Time zone", "Flexible on hours", "I can match Irish hours from Brazil until I land, and work on site after."],
  ["Format", "Hybrid or on-site", "Remote-first teams welcome too."],
];

function Ireland() {
  return (
    <section id="ireland" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHead index="08" eyebrow="Working in Ireland" title={<>Everything a recruiter <span className="grad">needs to know.</span></>} sub="The practical answers up front, so we can talk about the work." />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {IRELAND.map(([k, t, d], n) => (
          <Reveal key={k} delay={(n % 3) * 0.06}>
            <div className="h-full rounded-2xl border border-line bg-card/80 p-6 transition-colors hover:border-line2">
              <div className="font-mono text-[10px] uppercase tracking-widest text-vio">{k}</div>
              <div className="mt-3 font-display text-xl font-semibold tracking-tight">{t}</div>
              <p className="mt-2 text-sm leading-relaxed text-soft">{d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function DublinClock() {
  const fmt = () => new Intl.DateTimeFormat("en-IE", { timeZone: "Europe/Dublin", hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date());
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{t}</span>;
}

function Footer() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["40%", "0%"]);
  const cols = [
    ["Navigate", NAV.map(([id, label]) => [label, `#${id}`]).concat([["Contact", "#contact"]])],
    ["Projects", CASES.map((c) => [c.name, c.url ?? "#work"])],
    ["Elsewhere", [["GitHub", LINKS.github], ["LinkedIn", LINKS.linkedin], ["Comply studio", LINKS.studio], ["CV (PDF)", LINKS.cv], ["Email", `mailto:${LINKS.email}`]]],
  ];
  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-line2 bg-bg/80">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-vio to-transparent" />
      <div className="mx-auto grid max-w-6xl gap-x-6 gap-y-12 px-4 pt-20 grid-cols-2 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-3">
            <Mark className="size-10" />
            <span className="font-display text-xl font-semibold tracking-tight">Kevin Matos</span>
          </div>
          <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-soft">Full stack & AI engineer. I build products end to end, and put AI into production where it pays off.</p>
          <div className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-line2 px-4 py-2 text-[13px] text-soft">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            Available · Dublin from Jan 2027
          </div>
          <div className="mt-4 font-mono text-xs text-dim">
            Dublin time · <span className="text-soft"><DublinClock /></span>
          </div>
        </div>
        {cols.map(([title, items]) => (
          <div key={title}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-dim">{title}</div>
            <ul className="mt-5 space-y-2.5">
              {items.map(([label, href]) => (
                <li key={label}>
                  <a href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})} className="group inline-flex items-center gap-1.5 text-[15px] text-soft transition-colors hover:text-ink">
                    <span className="h-px w-0 bg-vio transition-all duration-300 group-hover:w-3" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-16 flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-line px-4 py-6 text-sm text-dim sm:px-6">
        <span>© 2026 Kevin Matos</span>
        <span className="hidden sm:inline">Designed & built from scratch · React · Tailwind · Motion</span>
        <a href="#top" className="group inline-flex items-center gap-2 rounded-full border border-line2 px-4 py-2 text-soft transition-colors hover:border-white/50 hover:text-ink">
          Back to top <span className="transition-transform group-hover:-translate-y-0.5">↑</span>
        </a>
      </div>
      <motion.div style={{ y }} className="pointer-events-none select-none px-2 text-center font-display text-[19vw] font-bold leading-[0.8] tracking-[-0.06em]">
        <span className="grad opacity-90">Kevin Matos</span>
      </motion.div>
    </footer>
  );
}

export default function App() {
  // pretty URLs like /kevin/uses land on their section
  useEffect(() => {
    const m = location.pathname.match(/\/kevin\/(uses|notes|ireland|work|lab|studio|contact)\/?$/);
    if (m) setTimeout(() => document.getElementById(m[1])?.scrollIntoView(), 400);
  }, []);
  const [still] = useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  return (
    <MotionConfig reducedMotion="user">
    <div className="overflow-x-clip">
      {!still && <Ambient />}
      {!still && <Cursor />}
      <Analytics />
      <Nav />
      <div className="relative z-10">
      <Hero />
      <Logos />
      <Marquee />
      <Stats />
      <Work />
      <Gallery />
      <Skills />
      <Lab />
      <Studio />
      <Experience />
      <Now />
      <Notes />
      <Uses />
      <Ireland />
      <Testimonials />
      <Contact />
      <Footer />
      </div>
    </div>
    </MotionConfig>
  );
}
