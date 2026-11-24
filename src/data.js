export const LINKS = {
  email: "kevinmatos2006@gmail.com",
  github: "https://github.com/asunavlr",
  linkedin: "https://www.linkedin.com/in/kevinmatoss",
  cv: "/kevin/Kevin_Matos_CV.pdf",
  studio: "https://comply.website",
  call: "", // Cal.com / Calendly link, the "Book a call" button shows once this is set
};

export const STACK = ["Next.js", "React", "TypeScript", "Python", "FastAPI", "Go", "NestJS", "PostgreSQL", "Supabase", "pgvector", "Pinecone", "LangGraph", "Agno", "Claude", "OpenAI", "Langfuse", "MCP", "Docker", "Redis", "AWS", "Railway", "Vercel", "Tailwind", "GSAP", "three.js", "Expo"];

export const STATS = [
  { n: 2, suffix: "+", label: "years shipping production SaaS end to end" },
  { n: 1, prefix: "R$", suffix: "M+", label: "ARR on the rural-data platform I worked on" },
  { n: 40, suffix: "+", label: "websites delivered to real clients" },
  { n: 284, label: "automated tests in one Go service" },
];

export const CASES = [
  {
    id: "avodah",
    video: "/kevin/video/avodah.mp4",
    name: "Avodah SAC",
    kind: "Customer service platform",
    badge: "Live · current client",
    year: "2026",
    url: "https://sac.avodahoptical.com.br",
    desktop: "/kevin/shots/sac-atendimento.jpg",
    gallery: ["/kevin/shots/sac-painel.jpg", "/kevin/shots/sac-ia.jpg", "/kevin/shots/sac-conhecimento.jpg", "/kevin/shots/sac-filas.jpg", "/kevin/shots/sac-tickets.jpg", "/kevin/shots/avodah.jpg"],
    color: "#2dd4bf",
    metrics: [["22", "Postgres tables with pgvector"], ["24", "write actions behind role checks"], ["Daily", "backups with a tested restore"]],
    lede: "Built with my business partner: the customer service hub of an eyewear distributor: WhatsApp inbox, tickets, knowledge base, dashboards, with an AI agent layer designed to answer before a human steps in.",
    points: [
      ["Three audiences", "optical stores, end customers and sales reps in one queue"],
      ["Operations", "tickets, queues, people and permissions with real write paths"],
      ["Infrastructure", "a dedicated Ubuntu server we run: Next.js on pm2, Postgres 17, PgBouncer, Redis, Evolution API"],
      ["Team", "built and run with my business partner at Comply, with the client's support team in the loop"],
    ],
    meaning: "With a partner, I can take a client's whole operation onto software we build and run ourselves, from the database to the server.",
    tags: ["Next.js 16", "Postgres", "pgvector", "Drizzle", "Redis", "Evolution API", "Linux"],
  },
  {
    id: "agro",
    video: "/kevin/video/agro.mp4",
    metrics: [["12", "transactional email flows"], ["Google News", "indexed through technical SEO"], ["Sold", "to the client, with a maintenance contract"]],
    name: "AgroPujante",
    kind: "Legal-tech SaaS",
    badge: "Built & sold",
    year: "2026",
    url: "https://agropujante.com.br",
    desktop: "/kevin/shots/agro-full.jpg",
    mobile: "/kevin/shots/agro-m.jpg",
    color: "#22c55e",
    lede: "A legal-intelligence platform for Brazilian agribusiness, built from scratch and sold to the client with an ongoing maintenance agreement.",
    points: [
      ["Semantic search", "over court decisions and regulation with pgvector"],
      ["Subscriptions", "tiered plans with PIX and card via Asaas, MRR and churn dashboards"],
      ["Growth", "12 transactional email flows, technical SEO and Google News indexing"],
    ],
    meaning: "I can own a product commercially, not only the code, but pricing, growth and handover.",
    tags: ["Next.js", "FastAPI", "Supabase", "pgvector", "Asaas", "SEO"],
  },
  {
    id: "farm",
    video: "/kevin/video/farm.mp4",
    metrics: [["R$1M+", "annual recurring revenue"], ["122+", "rural data layers per property"], ["3", "layers of auth with Supabase RLS"]],
    name: "Dados Fazenda",
    kind: "Rural-data SaaS",
    badge: "R$1M+ ARR",
    year: "2025–26",
    url: "https://dadosfazenda.com.br",
    desktop: "/kevin/shots/farm-full.jpg",
    mobile: "/kevin/shots/farm-m.jpg",
    color: "#eab308",
    lede: "Look up any farm in Brazil in seconds: 122+ data sources, satellite imagery and environmental alerts, on a platform doing over R$1M a year. I built features across the API, billing and AI.",
    points: [
      ["Billing proxy", "credits-based metering over several upstream APIs with automatic refunds"],
      ["AI pipeline", "Cohere embeddings, Pinecone, LangGraph and Agno agents traced in Langfuse, Azure OCR"],
      ["Multi-tenancy", "Supabase RLS and three auth layers: JWT, API keys, service keys"],
    ],
    meaning: "On a system where a bug costs money, I learned to care about idempotency, observability and boring reliability.",
    tags: ["FastAPI", "Next.js 14", "LangGraph", "Pinecone", "Langfuse", "Docker"],
  },
  {
    id: "school",
    metrics: [["34", "admin modules"], ["4", "roles with RBAC"], ["3", "apps in one monorepo"]],
    name: "EscolaPujante",
    kind: "Edtech · web + mobile",
    badge: "Tech lead",
    year: "2026",
    url: "https://escolapujante.com.br",
    desktop: "/kevin/shots/school.jpg",
    mobile: "/kevin/shots/school-m.jpg",
    color: "#10b981",
    lede: "An online school for agribusiness law: web app, 34-module admin and an Expo mobile app in one monorepo.",
    points: [
      ["Monorepo", "NestJS + Prisma API, React 19 web and Expo mobile sharing types"],
      ["Access", "RBAC with 4 roles and multi-gateway subscriptions"],
      ["AI", "Claude-powered news-writing agent with an MCP server integration"],
    ],
    meaning: "I lead: I run planning and code review and keep a multi-app codebase coherent for the team.",
    tags: ["NestJS", "Prisma", "React 19", "Expo", "Claude", "MCP"],
  },
  {
    id: "prospect",
    video: "/kevin/video/prospect.mp4",
    metrics: [["5", "job sources, deduplicated"], ["1 to 12 km", "\"near\" filter on rentals"], ["Daily", "used to run my own move"]],
    url: "https://prospect-comply-production.up.railway.app/demo",
    name: "Prospect Comply",
    kind: "Automation platform",
    badge: "Daily driver",
    year: "2026",
    desktop: "/kevin/shots/prospect-jobs.jpg",
    extra: "/kevin/shots/prospect-map.jpg",
    color: "#7c5cff",
    lede: "My personal operating system: lead generation for my studio, now a job-search copilot for Dublin.",
    points: [
      ["Aggregation", "LinkedIn, Greenhouse, Ashby, Workday and JobsIreland, enriched in background queues with retry on 429"],
      ["Data joins", "Irish employment-permit spreadsheets matched to 12,800+ companies"],
      ["Inbox sync", "Gmail over IMAP links replies, interviews and rejections to each application"],
      ["Output", "cover-letter PDFs from any job link and a daily email digest"],
    ],
    meaning: "I automate my own problems, scraping, caching, rate limits, and a UI I actually use every day.",
    tags: ["Next.js", "TypeScript", "SQLite", "IMAP", "pdf-lib", "Railway"],
  },
  {
    id: "corvus",
    metrics: [["npx", "one command to try it"], ["1", "screen instead of five terminals"], ["Multi-repo", "agent orchestration"]],
    name: "Corvus",
    kind: "Developer tool",
    badge: "On npm",
    year: "2026",
    url: "https://corvus-cockpit.vercel.app",
    desktop: "/kevin/shots/corvus.jpg",
    color: "#ef4444",
    lede: "A cockpit for the Claude Code CLI, one screen instead of five terminals.",
    points: [
      ["Persistence", "conversations per project and turns that survive closing the browser"],
      ["Orchestration", "a conductor agent that dispatches work across repos and demands proof it runs"],
      ["Distribution", "licensing server and trial flow, shipped as npx corvus-trial"],
    ],
    meaning: "Product instinct for developer tools and real hands-on experience orchestrating LLM agents.",
    tags: ["TypeScript", "Node.js", "Claude Code", "Agents", "npm"],
  },
];

export const REPOS = [
  { name: "wallet-service", lang: "Go", color: "#00ADD8", desc: "Wallet for game providers: BET, WIN, REFUND and ROLLBACK over HTTP and SQS with identical financial guarantees.", proof: ["284 tests", "50 parallel bets → 1 debit", "SQS · Keycloak"], arch: ["HTTP · SQS","Idempotency key","Ledger tx","Postgres"], code: `func (s *Wallet) Bet(ctx context.Context, r BetReq) error {
  return s.db.Tx(ctx, func(tx Tx) error {
    if done, _ := tx.Seen(r.TxID); done {
      return nil // idempotent replay
    }
    bal := tx.LockBalance(r.Player) // SELECT … FOR UPDATE
    if bal < r.Amount { return ErrFunds }
    return tx.Debit(r.Player, r.Amount, r.TxID)
  })
}` },
  { name: "rag-platform", lang: "Python", color: "#3572A5", desc: "Multi-tenant RAG API with hybrid semantic + lexical retrieval, reciprocal-rank fusion, reranking and cited answers.", proof: ["FastAPI", "Hybrid search", "Multi-tenant"], arch: ["Query","BM25 + vector","RRF fusion","Rerank","Cited answer"], code: `def retrieve(q: str, tenant: str, k=8):
    lex = bm25.search(q, tenant=tenant, k=40)
    sem = vectors.search(embed(q), tenant=tenant, k=40)
    fused = rrf([lex, sem], k=60)
    return reranker.rank(q, fused)[:k]` },
  { name: "gaia-agent", lang: "Python", color: "#3572A5", desc: "Agent for the GAIA benchmark (Hugging Face Agents Course): web research, files and multi-step reasoning, with headless Claude Code as the tool loop.", proof: ["70% on GAIA (14/20)", "Parallel + cached", "HF certified"], arch: ["Questions API","Task sandbox","claude -p + tools","FINAL ANSWER","Submit"], code: `def solve(q):
    dest = WORK / q["task_id"]          # one sandbox per task
    fetch_attachment(q, dest)
    out = run(["claude", "-p", q["question"],
               "--allowedTools", "WebSearch", "WebFetch", "Read", "Bash"],
              cwd=dest, timeout=900)
    return re.findall(r"FINAL ANSWER:\\s*(.+)", out)[-1]` },
  { name: "saas-starter", lang: "Go", color: "#00ADD8", desc: "Multi-tenant SaaS backend: transactional provisioning, RBAC, plan quotas, audit trail and Redis rate limiting.", proof: ["PostgreSQL", "Redis", "JWT"], arch: ["JWT","RBAC guard","Quota check","Tenant tx","Audit log"], code: `func Provision(ctx context.Context, t Tenant) error {
  return db.Tx(ctx, func(tx Tx) error {
    if err := tx.CreateTenant(t); err != nil { return err }
    if err := tx.SeedRoles(t.ID, DefaultRoles); err != nil { return err }
    return tx.Audit(t.ID, "tenant.created")
  })
}` },
  { name: "agent-flow", lang: "Python", color: "#3572A5", desc: "Orchestration for tool-using agents as explicit graphs, with human-approval gates, resumable runs and traces.", proof: ["Graphs", "Approval gates", "Traces"], arch: ["Graph","Tool node","Approval gate","Checkpoint","Trace"], code: `flow = Graph()
flow.node("plan", planner)
flow.node("act", tools, requires_approval=True)
flow.edge("plan", "act")
run = flow.start(task)        # pauses at the gate
run.approve("act")            # resumes from checkpoint` },
  { name: "dev-pulse", lang: "Python", color: "#3572A5", desc: "Service observability: uptime checks, latency, alert rules, incident history and Prometheus metrics.", proof: ["Prometheus", "Alerts", "Tests"], arch: ["Scheduler","HTTP probe","Rule engine","Incident","Prometheus"], code: `async def probe(svc: Service):
    t0 = time.perf_counter()
    r = await http.get(svc.url, timeout=5)
    LATENCY.labels(svc.name).observe(time.perf_counter() - t0)
    await rules.evaluate(svc, ok=r.status_code < 500)` },
  { name: "knowledge-hub", lang: "Python", color: "#3572A5", desc: "RAG over PDFs with pgvector: overlapping chunks, cosine retrieval and grounded answers with sources.", proof: ["pgvector", "OpenAI", "OpenAPI"], arch: ["PDF","Chunk + overlap","Embed","pgvector","Answer + sources"], code: `SELECT id, content, 1 - (embedding <=> :q) AS score
FROM chunks
WHERE doc_id = ANY(:docs)
ORDER BY embedding <=> :q
LIMIT 6;` },
];

/* [level 1-5, summary, [[where, what]]] */
export const SKILLS = {
  AI: {
    "LLM agents": [5, "Agents that do real work, with guardrails and traces.", [["Dados Fazenda", "LangGraph and Agno multi-agent features in production"], ["EscolaPujante", "Claude news-writing agent with MCP tools"], ["Corvus", "Conductor that orchestrates coding agents across repos"], ["agent-flow", "Graph orchestration with human approval gates"]]],
    RAG: [5, "Chunking, embeddings, hybrid retrieval, reranking, citations.", [["AgroPujante", "pgvector semantic search over legal content"], ["Dados Fazenda", "Cohere embeddings + Pinecone"], ["rag-platform", "Hybrid retrieval with RRF and reranking"]]],
    "Claude / OpenAI": [5, "Tool use, structured output, Whisper, MCP servers.", [["EscolaPujante", "Claude agent + MCP server"], ["Solvefy", "Claude over Microsoft 365 data via Graph"], ["Scalio", "Voice → Whisper → LLM → signed report"]]],
    Observability: [4, "Langfuse traces, New Relic, Prometheus.", [["Dados Fazenda", "Langfuse + New Relic"], ["dev-pulse", "Prometheus metrics and alert rules"]]],
  },
  Frontend: {
    "Next.js": [5, "App Router, server components, route handlers, SEO.", [["AgroPujante", "Product frontend with Google News SEO"], ["Dados Fazenda", "Next.js 14 frontend"], ["Prospect Comply", "Full-stack app with route handlers"]]],
    React: [5, "SaaS dashboards to animated marketing sites.", [["Comply studio", "40+ sites with React, Vite and GSAP"], ["EscolaPujante", "React 19 web and admin"]]],
    "Motion & 3D": [4, "GSAP, Framer Motion, three.js, motion that serves the story.", [["Comply studio", "Scroll scenes and three.js on client sites"], ["This portfolio", "React + Motion, built from scratch"]]],
    "React Native": [3, "Expo apps sharing code with web.", [["EscolaPujante", "Expo mobile app in the monorepo"]]],
  },
  Backend: {
    "Python / FastAPI": [5, "My default for data- and AI-heavy services.", [["Dados Fazenda", "Property APIs, billing proxy, AI endpoints"], ["AgroPujante", "Core API"], ["rag-platform", "Open-source service with tests"]]],
    "TypeScript / Node": [5, "NestJS, Fastify and Next route handlers.", [["EscolaPujante", "NestJS + Prisma with RBAC"], ["Prospect Comply", "Scrapers, queues, IMAP, PDFs"], ["Corvus", "CLI and license API"]]],
    Go: [3, "For concurrency-sensitive, money-handling services.", [["wallet-service", "Idempotent ledger over HTTP + SQS"], ["saas-starter", "Tenant isolation, quotas, audit"]]],
    "Payments & auth": [4, "Subscriptions, PIX, webhooks, OAuth, RBAC, RLS.", [["AgroPujante", "Asaas subscriptions with PIX and card"], ["Dados Fazenda", "Credits with auto refunds, 3-layer auth"], ["Solvefy", "Microsoft OAuth + Graph"]]],
  },
  Infra: {
    "PostgreSQL / Supabase": [5, "Main database everywhere, pgvector, RLS, constraints.", [["AgroPujante", "Supabase + pgvector"], ["wallet-service", "Integrity enforced by constraints"]]],
    "Docker & CI/CD": [4, "Everything ships in containers with automated checks.", [["Dados Fazenda", "Docker, CI/CD, Railway and Vercel"], ["Engineering lab", "Every repo runs with docker compose up"]]],
    AWS: [3, "SQS and LocalStack for local development.", [["wallet-service", "SQS consumers tested on LocalStack"]]],
    Redis: [3, "Caching and rate limiting.", [["saas-starter", "Fixed-window rate limiter"], ["Solvefy", "Caching"]]],
  },
  Team: {
    "Tech leadership": [4, "Planning, dailies, retros, code review, mentoring.", [["Pujante", "Lead the dev team and its Git/PR/CI conventions"], ["CTRL+PLAY", "Taught programming fundamentals"]]],
    "Client delivery": [5, "Scoping, proposals, deadlines, handover.", [["Comply studio", "40+ delivered client projects"], ["AgroPujante", "Built, sold and maintained"]]],
  },
};

export const SITES = [
  { name: "Comply", what: "My studio", shot: "/kevin/shots/comply.jpg", url: "https://comply.website" },
  { name: "Harmonia das Flores", what: "Florist · live catalog + admin", shot: "/kevin/shots/harmonia.jpg", url: "https://harmonia-das-flores.vercel.app" },
  { name: "Prospect Comply", what: "My job & client-prospecting platform", shot: "/kevin/shots/prospect-demo.jpg", url: "https://prospect-comply-production.up.railway.app/demo" },
  { name: "Avodah SAC", what: "Avodah Optical · customer service & CRM platform", shot: "/kevin/shots/sac-painel.jpg", url: "https://sac.avodahoptical.com.br" },
  { name: "MACKEI", what: "E-commerce demo", shot: "/kevin/shots/mackei.jpg", url: "https://mackei.vercel.app" },
  { name: "Barbearia Barreto", what: "Barbershop · online booking + admin", shot: "/kevin/shots/barreto.jpg", url: "https://barbearia-barreto-classica.vercel.app" },
  { name: "Pitch's Lounge", what: "Restaurant · Milwaukee, US", shot: "/kevin/shots/pitchs.jpg", url: "https://pitchs-preview.vercel.app" },
  { name: "Dra. Marli Marçal", what: "Dental clinic", shot: "/kevin/shots/marli.jpg", url: "https://dra-marli-marcal.vercel.app" },
  { name: "Gaia", what: "Electronics repair", shot: "/kevin/shots/gaia.jpg", url: "https://gaia-eletronica.vercel.app" },
  { name: "Oryx Capital", what: "Investment firm", shot: "/kevin/shots/oryx.jpg", url: "https://oryx-capital-lp.vercel.app" },
  { name: "Lara Martins", what: "Law firm · three.js", shot: "/kevin/shots/lara.jpg", url: "https://lara-martins.vercel.app" },
  { name: "Easy MEI", what: "Tax guide SaaS", shot: "/kevin/shots/easymei.jpg", url: "https://easy-mei.vercel.app" },
  { name: "Exímia", what: "Accounting firm", shot: "/kevin/shots/eximia.jpg", url: "https://eximia-beta.vercel.app" },
  { name: "Ateliê Priscila", what: "Crochet catalog", shot: "/kevin/shots/atelie.jpg", url: "https://atelie-priscila.vercel.app" },
  { name: "Mario Dal Maso", what: "Property management", shot: "/kevin/shots/delmaso.jpg", url: "https://delmaso.vercel.app" },
  { name: "Mheraky", what: "Marketing agency", shot: "/kevin/shots/mheraky.jpg", url: "https://mheraky.vercel.app" },
];

export const JOBS = [
  { co: "Comply.Website", role: "Independent Full Stack & AI Engineer", when: "Jul 2026 to Present", pts: ["Custom websites, internal systems, integrations, workflow automation and applied AI for business clients", "Turn business requirements into maintainable software, with ongoing development and support", "40+ websites and landing pages delivered"] },
  { co: "Avodah Optical", role: "Client engagement · Full Stack", when: "Sep 2026 to Present", pts: ["Customer service (SAC) and CRM platforms", "Tools for marketing management and operational control", "Continuous development, improvements and technical support"] },
  { co: "Bluetech Window Films (Somma Films)", role: "Full Stack Software Engineer", when: "Jul 2026 to Oct 2026", pts: ["AI-powered recruitment automation and a construction management app", "Cross-platform Android/iOS apps with Flutter, plus web, APIs and databases", "Linux servers, deployments, billing workflows and debugging"] },
  { co: "Pujante", role: "Full Stack Engineer & Tech Lead", when: "Apr 2026 to Jul 2026", pts: ["Led sprint planning, stand-ups, retros, roadmap, code review and Git/PR/CI practices", "Built AgroPujante from the ground up, semantic search, subscriptions, dashboards, email flows", "Technical SEO and Google News inclusion; handed over with a maintenance agreement", "EscolaPujante: subscriptions, RBAC, admin tools and AI content workflows"] },
  { co: "Agrios / MeuAT", role: "Full Stack Engineer", when: "Aug 2025 to May 2026", pts: ["Dados Fazenda, a rural-data SaaS, FastAPI + Next.js, satellite NDVI and embargo monitoring", "Credit and billing with refunds; AI workflows with OpenAI, Cohere, Pinecone, LangGraph, Azure OCR and Agno", "Supabase auth and RLS; Docker, CI/CD, Railway, Vercel and New Relic"] },
  { co: "CTRL+PLAY", role: "Programming Instructor & Developer", when: "2024 to 2025", pts: ["Responsive interfaces with React/Next.js and TypeScript, REST and GraphQL", "Taught programming concepts and practical projects"] },
  { co: "PUC Goiás", role: "Associate Degree, Systems Analysis & Development", when: "2024 to 2026", pts: ["English: Fluent (C2) · Portuguese: Native"] },
];

/* Deep-dive per project: architecture lanes, data model, AI pipeline, decisions. */
export const DEEP = {
  avodah: {
    flow: [
      ["Channels", ["WhatsApp (Evolution API)", "Web inbox"]],
      ["App", ["Next.js 16 on pm2", "Server actions", "Role checks"]],
      ["Services", ["Tickets & queues", "Knowledge search", "AI agent"]],
      ["Data", ["Postgres 17 + pgvector", "PgBouncer", "Redis cache"]],
      ["Ops", ["Ubuntu 24.04 server", "Daily pg_dump", "Tested restore"]],
    ],
    db: [
      ["customers", ["id", "kind", "name", "phone", "store_id"]],
      ["conversations", ["id", "customer_id", "channel", "status", "queue_id"]],
      ["messages", ["id", "conversation_id", "direction", "body", "provider_id"]],
      ["tickets", ["id", "conversation_id", "state", "assignee_id", "due_at"]],
      ["articles", ["id", "title", "body", "embedding"]],
      ["users", ["id", "email", "role", "department_id"]],
    ],
    ai: [
      ["Receive", "WhatsApp messages land idempotently, checked in three layers so a retry never duplicates"],
      ["Understand", "The agent classifies the customer type and intent before answering"],
      ["Answer", "Replies are grounded on the knowledge base, with typo-tolerant search in Portuguese"],
      ["Hand over", "When confidence is low the conversation moves to a human queue with full context"],
      ["Status", "Inbox, tickets, roles and knowledge search are live; the WhatsApp channel and the agent are being switched on"],
    ],
    decisions: [
      ["Own server over PaaS", "The client wanted data on their own machine, so we run Postgres, Redis and the app on one Ubuntu box."],
      ["Next.js over the first Python plan", "One codebase with server actions shipped login, roles and writes faster than a separate API."],
      ["Idempotent intake", "WhatsApp providers retry; every message is deduplicated before it touches a conversation."],
    ],
  },
  agro: {
    flow: [
      ["Client", ["Next.js (SSR + SEO)", "Admin dashboards"]],
      ["API", ["FastAPI", "Auth & plans", "Webhooks"]],
      ["Services", ["Semantic search", "Email flows ×12", "Google News feed"]],
      ["Data", ["Supabase Postgres", "pgvector", "Storage"]],
      ["External", ["Asaas (PIX / card)", "Email provider"]],
    ],
    db: [
      ["users", ["id", "email", "plan_id", "status"]],
      ["subscriptions", ["id", "user_id", "tier", "asaas_id", "renews_at"]],
      ["articles", ["id", "type", "title", "body", "published_at"]],
      ["embeddings", ["article_id", "chunk", "vector(1536)"]],
      ["payments", ["id", "subscription_id", "method", "status"]],
    ],
    ai: [
      ["Ingest", "Court decisions, news and regulation are cleaned and split into chunks"],
      ["Embed", "Each chunk becomes a vector stored next to the row in pgvector"],
      ["Search", "Queries are embedded and matched by cosine similarity, filtered by type and date"],
      ["Rank", "Results blend semantic score with recency so new rulings surface first"],
    ],
    decisions: [
      ["pgvector over a vector DB", "One Postgres for rows, vectors and auth, fewer moving parts for a small team."],
      ["Server-rendered pages", "Google News and SEO were the main growth channel, so content had to be crawlable."],
      ["Webhooks as source of truth", "Subscription state only changes on verified Asaas events, never on the client."],
    ],
  },
  farm: {
    flow: [
      ["Client", ["Next.js 14", "Map & reports"]],
      ["API", ["FastAPI", "JWT · API keys · service keys"]],
      ["Billing proxy", ["Reserve credits", "Call upstream", "Commit or refund"]],
      ["AI", ["LangGraph / Agno agents", "Azure OCR", "Langfuse traces"]],
      ["Data", ["Supabase + RLS", "Pinecone", "122+ upstream sources"]],
    ],
    db: [
      ["tenants", ["id", "name", "plan"]],
      ["properties", ["id", "tenant_id", "car_code", "geometry"]],
      ["credit_ledger", ["id", "tenant_id", "delta", "reason", "request_id"]],
      ["queries", ["id", "property_id", "source", "status", "cost"]],
      ["api_keys", ["id", "tenant_id", "hash", "scopes"]],
    ],
    ai: [
      ["OCR", "Land documents are read with Azure OCR into structured text"],
      ["Embed", "Cohere embeddings, indexed in Pinecone per tenant"],
      ["Agents", "LangGraph / Agno agents call data tools and assemble a risk report"],
      ["Trace", "Every step, token and tool call is traced in Langfuse for debugging and cost"],
    ],
    decisions: [
      ["Ledger, not a balance column", "Credits are an append-only ledger keyed by request id, so refunds are exact and replays are idempotent."],
      ["RLS at the database", "Tenant isolation is enforced by Postgres policies, not only by API code."],
      ["Observability first", "Langfuse + New Relic made agent failures and slow upstreams visible before customers noticed."],
    ],
  },
  school: {
    flow: [
      ["Apps", ["React 19 web", "Admin (34 modules)", "Expo mobile"]],
      ["Shared", ["Types & validation", "UI tokens"]],
      ["API", ["NestJS", "RBAC ×4 roles", "Webhooks"]],
      ["AI", ["Claude news agent", "MCP server"]],
      ["Data", ["Postgres + Prisma", "Payment gateways"]],
    ],
    db: [
      ["users", ["id", "role", "email"]],
      ["courses", ["id", "title", "status"]],
      ["lessons", ["id", "course_id", "video_url", "order"]],
      ["enrollments", ["user_id", "course_id", "progress"]],
      ["subscriptions", ["id", "user_id", "gateway", "status"]],
    ],
    ai: [
      ["Collect", "The agent pulls recent agribusiness legal news through MCP tools"],
      ["Draft", "Claude writes a draft in the house style with sources attached"],
      ["Review", "Drafts land in the admin for an editor to approve before publishing"],
    ],
    decisions: [
      ["Monorepo with shared types", "Web, admin and mobile can't drift from the API contract."],
      ["Human in the loop", "AI drafts never publish themselves, an editor approves each one."],
      ["Conventions over heroics", "PR templates, CI checks and review rules so the team ships consistently."],
    ],
  },
  prospect: {
    flow: [
      ["Sources", ["LinkedIn", "Greenhouse / Ashby", "Workday", "JobsIreland"]],
      ["Workers", ["Serialized fetch queue", "Retry on 429", "Background enrichment"]],
      ["Logic", ["CV match score", "Permit join", "Visa signals"]],
      ["Data", ["SQLite cache (SWR)", "job_details", "job_mail"]],
      ["Outputs", ["Dashboard", "Cover-letter PDF", "Daily digest email"]],
    ],
    db: [
      ["job_cache", ["scope", "query", "payload", "fetched_at"]],
      ["job_details", ["job_id", "summary", "workplace", "visa", "emails"]],
      ["jobs_marked", ["job_id", "status", "updated_at"]],
      ["job_mail", ["message_id", "job_id", "kind", "date"]],
      ["digest_seen", ["job_id", "sent_at"]],
    ],
    ai: [
      ["Parse", "Job pages are normalized from JSON-LD, ATS APIs or raw HTML"],
      ["Classify", "Rules extract work model, visa signals, seniority and contacts"],
      ["Score", "Each job is scored against my CV with an explanation of what's missing"],
      ["Inbox", "IMAP emails are classified as ack, reply, interview or rejection and linked to the job"],
    ],
    decisions: [
      ["Stale-while-revalidate", "The page answers instantly from cache while fresh data loads in the background."],
      ["One request at a time per source", "Serial queues with backoff instead of getting rate-limited and blocked."],
      ["Read-only Gmail", "IMAP with an app password, read-only, the tool can never send or delete mail."],
    ],
  },
  corvus: {
    flow: [
      ["Browser", ["Cockpit UI", "Conductor board"]],
      ["Local server", ["Session store", "Turn persistence"]],
      ["Agents", ["Claude Code CLI ×N", "One per repo"]],
      ["Conductor", ["Dispatch tasks", "Demand proof (tests / run)"]],
      ["Cloud", ["License & trial API"]],
    ],
    db: [
      ["projects", ["id", "path", "name"]],
      ["conversations", ["id", "project_id", "title"]],
      ["turns", ["id", "conversation_id", "status", "cost"]],
      ["tasks", ["id", "agent", "repo", "state", "proof"]],
    ],
    ai: [
      ["Plan", "The conductor breaks a request into tasks per repository"],
      ["Run", "Each task runs in its own Claude Code process, streamed to the UI"],
      ["Verify", "A task only closes with proof, passing tests or a working command"],
    ],
    decisions: [
      ["Runs locally", "Your code, your machine, your Claude Code, nothing goes to my servers except the license check."],
      ["Turns survive the tab", "The server owns the process, so closing the browser doesn't kill work."],
      ["Proof over promises", "Agents must show evidence the change works before a task is done."],
    ],
  },
};

/* What I do: each discipline with what I actually deliver, the tools and where it shipped. */
export const CAPS = [
  {
    n: "01", name: "AI engineering", line: "LLMs that do real work in production, not demos.",
    does: ["Agents with tools, memory and human-approval gates", "RAG: chunking, embeddings, hybrid search, reranking, citations", "MCP servers and Claude / OpenAI tool use", "Evals, traces and cost control"],
    tools: ["Claude", "OpenAI", "LangGraph", "Agno", "pgvector", "Pinecone", "Langfuse", "Whisper"],
    proof: ["Dados Fazenda", "EscolaPujante", "Corvus", "rag-platform"], img: "/kevin/shots/farm.jpg",
  },
  {
    n: "02", name: "Product & SaaS", line: "From empty repo to paying customers.",
    does: ["Multi-tenant architecture with RLS and RBAC", "Subscriptions, PIX, cards, credits and webhooks", "Admin panels, dashboards and onboarding", "Pricing, growth and handover to the client"],
    tools: ["Next.js", "Supabase", "Asaas", "Stripe", "Resend", "Railway"],
    proof: ["AgroPujante", "Dados Fazenda", "Prospect Comply"], img: "/kevin/shots/agro.jpg",
  },
  {
    n: "03", name: "Backend & data", line: "APIs that stay correct under load and money.",
    does: ["REST APIs with FastAPI, NestJS and Go", "Idempotent ledgers and safe concurrency", "Queues, scrapers, schedulers and IMAP/PDF pipelines", "Postgres modelling, constraints and migrations"],
    tools: ["Python", "FastAPI", "TypeScript", "NestJS", "Go", "PostgreSQL", "Redis", "SQS", "Prisma"],
    proof: ["wallet-service", "saas-starter", "EscolaPujante"], img: "/kevin/shots/prospect-jobs.jpg",
  },
  {
    n: "04", name: "Frontend & motion", line: "Interfaces people enjoy using, on any screen.",
    does: ["Design systems and responsive layouts", "Scroll scenes, parallax and 3D with GSAP and three.js", "Mobile apps with Expo and Flutter (Android / iOS)", "SEO, Core Web Vitals and accessibility"],
    tools: ["React", "Next.js", "Tailwind", "Motion", "GSAP", "three.js", "Expo", "Flutter"],
    proof: ["Comply studio · 40+ sites", "EscolaPujante app", "This portfolio"], img: "/kevin/shots/comply.jpg",
  },
  {
    n: "05", name: "Delivery & leadership", line: "I ship with the team and with the client.",
    does: ["Scoping, proposals and estimates", "Planning, dailies, retros and code review", "Git, PR and CI conventions for the team", "Docker, CI/CD, monitoring and on-call fixes"],
    tools: ["Docker", "GitHub Actions", "Vercel", "Railway", "AWS", "New Relic"],
    proof: ["Tech lead at Pujante", "Comply clients & Avodah Optical", "CTRL+PLAY teaching"], img: "/kevin/shots/lara.jpg",
  },
];

/* What I'm building right now. */
export const NOW = [{
  name: "Hey, mate!",
  status: "In progress · launching before I land in Dublin",
  line: "That friend who already lives in Dublin.",
  desc: "I'm moving to Dublin myself, so I'm building the guide I wish I had: an Irish-style CV generator, a moving checklist built from your arrival date, real costs with a live euro rate, a city map and a room-scam checker. English and Portuguese.",
  stack: ["Next.js", "TypeScript", "Claude", "Drizzle", "Leaflet", "i18n"],
  features: [
    ["Irish CV", "Claude rewrites your CV the Irish way, one version per area"],
    ["Checklist", "Timeline generated from your arrival date, with official links"],
    ["Real costs", "Take-home pay, rent and groceries with a live euro rate"],
    ["Scam check", "Paste a room listing, get a risk score and a price check"],
  ],
  shots: { main: "/kevin/shots/heymate.jpg", a: "/kevin/shots/heymate-costs.jpg", b: "/kevin/shots/heymate-check.jpg", c: "/kevin/shots/heymate-map.jpg", phone: "/kevin/shots/heymate-m.jpg", phone2: "/kevin/shots/heymate-scam-m.jpg" },
}, {
  name: "Avodah SAC",
  title: "Avodah SAC.",
  status: "Live in production · built with my business partner",
  line: "Customer service that answers before a human has to.",
  desc: "The service hub of an eyewear distributor, which my partner and I build and run: every WhatsApp conversation in one inbox, tickets and queues, a knowledge base, dashboards, and an AI agent layer we're extending to resolve the common questions on its own.",
  stack: ["Next.js 16", "PostgreSQL", "pgvector", "Drizzle", "Redis", "Evolution API"],
  features: [
    ["Inbox", "Optical stores, end customers and sales reps in one WhatsApp queue"],
    ["AI layer", "Answers from the knowledge base, handing over to a human queue when unsure"],
    ["Tickets", "Queues, people and permissions, with every write behind a role check"],
    ["Knowledge", "One knowledge base that feeds both the team and the AI"],
  ],
  shots: { main: "/kevin/shots/sac-atendimento.jpg", a: "/kevin/shots/sac-ia.jpg", b: "/kevin/shots/sac-tickets.jpg", c: "/kevin/shots/sac-conhecimento.jpg" },
  url: "https://sac.avodahoptical.com.br",
}];

/* Real quotes only, the section stays hidden while this is empty. [quote, name, role] */
export const TESTIMONIALS = [];

/* Short engineering write-ups, each taken from a real project. */
export const NOTES = [
  {
    slug: "whatsapp-port",
    title: "One port, three WhatsApp providers",
    project: "Avodah SAC",
    read: "3 min",
    tldr: "The whole app talks to one interface. Switching from the official Meta API to Evolution is a new adapter, not a rewrite.",
    body: [
      "A customer service hub lives or dies by its WhatsApp channel, and the provider choice is a business decision that changes: the official Meta Cloud API charges per business-initiated conversation and needs approved templates; unofficial gateways like Evolution are cheaper but can get the number banned.",
      "So the app never talks to a provider. It talks to a port:",
    ],
    code: `interface WhatsAppChannel {
  readonly provider: string
  readonly requiresTemplate: boolean   // the official API's commercial rule, modelled
  status(): Promise<"connected" | "connecting" | "disconnected" | "banned">
  sendText(msg): Promise<SendResult>
  sendMedia(msg): Promise<SendResult>
  sendTemplate(msg): Promise<SendResult>
  markAsRead(externalId): Promise<void>
  onReceive(handler): void
}`,
    after: [
      "Two details carry the design. requiresTemplate puts a pricing rule in the type system, so the composer can warn before sending something the official API would reject. And banned is a state that only exists in the unofficial world; making it explicit means the UI can tell the team what happened instead of failing silently.",
      "Until a dedicated number exists, a simulated channel implements the same port, so every screen works end to end without a phone.",
    ],
  },
  {
    slug: "drop-python",
    title: "Why we dropped the Python backend",
    project: "Avodah SAC",
    read: "3 min",
    tldr: "The real problem was never the language. It was the missing write layer. Server Actions fixed that without a second runtime on a 2-core server.",
    body: [
      "The first plan split the system in two: a Python API for business rules and a React front end, with the knowledge base stored as markdown files. The argument was sound: rules were living inside React components.",
      "But the actual defect was that there was no write layer at all. Next.js Server Actions gave us one in the same codebase, without a second deploy, a second set of types to keep in sync, and a second runtime competing for 2 CPUs.",
      "Markdown as the database was the riskiest part: no transactions, concurrent writes, and search that needs a parallel index. Postgres gives all three out of the box, and pgvector covers the semantic search that motivated half the design.",
      "What we kept from the Python plan were the rules, not the language: SLA computed instead of stored, ids from the system instead of array length, permissions checked in the service instead of the screen. What we lost was diff-for-free history, so every write action now records to an audit table.",
    ],
  },
  {
    slug: "pgvector",
    title: "Semantic search without a vector database",
    project: "AgroPujante",
    read: "2 min",
    tldr: "For a small team, one Postgres for rows, vectors and auth beats a separate vector store.",
    body: [
      "AgroPujante searches court decisions, regulation and news for agribusiness lawyers. The obvious move was a dedicated vector database. We used pgvector inside the same Supabase Postgres instead.",
      "Embeddings sit next to the rows they describe, so a search is one query that can also filter by content type and date, join the user's plan, and respect row-level security. There is no sync job between two stores and nothing to drift.",
      "The trade-off is scale: past tens of millions of vectors a specialised store wins. A legal-content product for one market is nowhere near that, and fewer moving parts mattered more for a team that also had to ship payments, SEO and email flows.",
    ],
  },
];

/* What I actually work with every day. */
export const USES = [
  ["Machine", ["MacBook · macOS", "Safari for browsing, Chrome for testing"]],
  ["AI in the loop", ["Claude Code for most coding sessions", "Corvus, my own cockpit for running Claude Code across repos", "Claude and OpenAI APIs in production work"]],
  ["Ship", ["Vercel for front ends", "Railway for services and workers", "Docker and my own Linux servers when the client needs it"]],
  ["Data", ["PostgreSQL everywhere, with pgvector", "Supabase when auth and RLS come built in", "Redis for cache and rate limits"]],
  ["Build", ["Next.js, React, Tailwind and Motion", "FastAPI and NestJS for APIs, Go when money is involved", "Puppeteer and ffmpeg for scraping, screenshots and the videos on this site"]],
];

export const CERTS = [
  { name: "AI Agents Course", org: "Hugging Face", date: "Nov 2026", note: "Certificate of Excellence. Final project scored 70% on GAIA.", img: "/kevin/certs/hf-agents-course.jpg", url: "/kevin/certs/hf-agents-course.pdf", repo: "https://github.com/asunavlr/gaia-agent" },
  { name: "The LLM Course: Fundamentals of LLMs", org: "Hugging Face", date: "Nov 2026", note: "Certificate of Achievement. Transformer architecture and how LLMs work under the hood.", img: "/kevin/certs/hf-llm-fundamentals.jpg", url: "/kevin/certs/hf-llm-fundamentals.jpg" },
  { name: "Claude with the Anthropic API", org: "Anthropic", date: "Nov 2026", note: "API, tool use, RAG with embeddings and BM25, prompt caching, evals, MCP and agent workflows.", img: "/kevin/certs/anthropic-api.jpg", url: "/kevin/certs/anthropic-api.pdf", verify: "https://verify.skilljar.com/c/irbx7bmt2xxc" },
  { name: "Introduction to Model Context Protocol", org: "Anthropic", date: "Nov 2026", note: "Building MCP servers and clients for tools and resources.", img: "/kevin/certs/anthropic-mcp.jpg", url: "/kevin/certs/anthropic-mcp.pdf", verify: "https://verify.skilljar.com/c/7j26ddeo3dxu" },
  { name: "Claude Code in Action", org: "Anthropic", date: "Nov 2026", note: "Agentic development workflows with Claude Code.", img: "/kevin/certs/anthropic-claude-code-in-action.jpg", url: "/kevin/certs/anthropic-claude-code-in-action.pdf", verify: "https://verify.skilljar.com/c/6ns49ycpxey5" },
  { name: "AI Fluency: Framework & Foundations", org: "Anthropic", date: "Nov 2026", note: "Co-developed with University College Cork and Ireland's Higher Education Authority.", img: "/kevin/certs/anthropic-ai-fluency.jpg", url: "/kevin/certs/anthropic-ai-fluency.pdf", verify: "https://verify.skilljar.com/c/7ostw3biyn2t" },
  { name: "Claude 101", org: "Anthropic", date: "Nov 2026", note: "Certificate of completion. Final quiz 10/10.", img: "/kevin/certs/anthropic-claude-101.jpg", url: "/kevin/certs/anthropic-claude-101.pdf", verify: "https://verify.skilljar.com/c/onoo6zmutdho" },
  { name: "Claude Code 101", org: "Anthropic", date: "Nov 2026", note: "Certificate of completion.", img: "/kevin/certs/anthropic-claude-code-101.jpg", url: "/kevin/certs/anthropic-claude-code-101.pdf", verify: "https://verify.skilljar.com/c/fqajaoe4kmkm" },
  { name: "Claude Platform 101", org: "Anthropic", date: "Nov 2026", note: "Certificate of completion.", img: "/kevin/certs/anthropic-platform-101.jpg", url: "/kevin/certs/anthropic-platform-101.pdf", verify: "https://verify.skilljar.com/c/yyykeg366od4" },
  { name: "Introduction to Claude Cowork", org: "Anthropic", date: "Nov 2026", note: "Certificate of completion.", img: "/kevin/certs/anthropic-cowork.jpg", url: "/kevin/certs/anthropic-cowork.pdf", verify: "https://verify.skilljar.com/c/en6v4pmc2vua" },
];
