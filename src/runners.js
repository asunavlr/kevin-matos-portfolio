/* Versões em JS, rodando no navegador, da ideia central de cada repo.
   Não é o código original (Go/Python): é a mesma lógica, pequena o bastante para testar ao vivo. */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* wallet-service: 50 apostas iguais chegando em paralelo debitam uma vez só. */
async function wallet(log, input) {
  const n = Math.max(1, Math.min(500, Number(input) || 50));
  const seen = new Set();
  let balance = 1000;
  let lock = Promise.resolve();
  const bet = (txId, amount) => {
    const run = lock.then(async () => {
      await sleep(Math.random() * 3);
      if (seen.has(txId)) return "replay";
      if (balance < amount) return "no funds";
      balance -= amount;
      seen.add(txId);
      return "debited";
    });
    lock = run.catch(() => {});
    return run;
  };
  log(`balance = ${balance}`);
  log(`firing ${n} parallel BET requests with the same txId "bet-42", amount 10...`);
  const res = await Promise.all(Array.from({ length: n }, () => bet("bet-42", 10)));
  const count = (k) => res.filter((r) => r === k).length;
  log(`debited: ${count("debited")}   idempotent replays: ${count("replay")}`);
  log(`balance = ${balance}`);
  log(balance === 990 ? "✓ PASS  one debit, no matter how many retries" : "✗ FAIL", balance === 990 ? "ok" : "err");
}

/* rag-platform: busca lexical + "semântica" fundidas com reciprocal rank fusion. */
const DOCS = [
  "Refund policy: customers can request a refund within 30 days of purchase.",
  "Shipping takes 3 to 5 business days inside Brazil.",
  "To reset your password, use the link on the login page.",
  "Money back guarantee if the product arrives damaged.",
  "Our support team answers on WhatsApp from 8am to 6pm.",
  "Invoices are emailed after each payment is confirmed.",
];
const SYN = { refund: ["money back", "reimburse"], password: ["login", "reset"], delivery: ["shipping"], help: ["support"], bill: ["invoice", "payment"] };
const STOP = new Set(["how", "the", "and", "get", "can", "you", "your", "for", "are", "what", "does", "with", "my", "do", "i"]);
const words = (t) => (t.toLowerCase().match(/[a-z]+/g) ?? []).filter((w) => w.length > 2 && !STOP.has(w));
async function rag(log, input) {
  const q = (input || "how do I get my money back?").trim();
  log(`query: "${q}"`);
  const qw = words(q);
  const lex = DOCS.map((d, i) => [i, qw.filter((w) => words(d).includes(w)).length]).filter((x) => x[1]).sort((a, b) => b[1] - a[1]).map((x) => x[0]);
  const expanded = qw.flatMap((w) => [w, ...(SYN[w] ?? []), ...Object.entries(SYN).filter(([, v]) => v.some((s) => s.split(" ").includes(w))).flatMap(([k, v]) => [k, ...v])]);
  const sem = DOCS.map((d, i) => [i, expanded.filter((w) => words(d).join(" ").includes(w)).length]).filter((x) => x[1]).sort((a, b) => b[1] - a[1]).map((x) => x[0]);
  await sleep(150);
  log(`lexical (BM25-ish) ranks: [${lex.join(", ") || "none"}]`);
  log(`semantic ranks:          [${sem.join(", ") || "none"}]`);
  const score = {};
  [lex, sem].forEach((list) => list.forEach((id, r) => { score[id] = (score[id] ?? 0) + 1 / (60 + r + 1); }));
  const fused = Object.entries(score).sort((a, b) => b[1] - a[1]);
  await sleep(150);
  if (!fused.length) return log("no documents matched", "err");
  log("RRF fused, top answers:");
  fused.slice(0, 3).forEach(([id, s], k) => log(`  ${k + 1}. [doc ${id}] ${DOCS[id]}  (score ${s.toFixed(4)})`, k ? "" : "ok"));
}

/* saas-starter: rate limiter de janela fixa, como o do Redis. */
async function saas(log, input) {
  const limit = Math.max(1, Math.min(50, Number(input) || 5));
  const win = new Map();
  const allow = (tenant) => {
    const key = `${tenant}:${Math.floor(Date.now() / 1000)}`;
    const n = (win.get(key) ?? 0) + 1;
    win.set(key, n);
    return n <= limit;
  };
  log(`limit: ${limit} requests per second per tenant`);
  let ok = 0, blocked = 0;
  for (let i = 1; i <= limit + 4; i++) {
    const a = allow("acme");
    a ? ok++ : blocked++;
    log(`  req ${String(i).padStart(2)} tenant=acme → ${a ? "200 OK" : "429 Too Many Requests"}`, a ? "" : "err");
    await sleep(40);
  }
  log(`  req  1 tenant=globex → ${allow("globex") ? "200 OK (other tenants unaffected)" : "429"}`, "ok");
  log(`✓ ${ok} allowed, ${blocked} blocked`, "ok");
}

/* agent-flow: grafo com portão de aprovação humana; pausa e retoma do checkpoint. */
async function agent(log, input) {
  const task = (input || "refund order #8812").trim();
  log(`task: ${task}`);
  await sleep(250);
  log("[plan]  → steps: look up order, check policy, issue refund");
  await sleep(250);
  log("[act]   needs approval: issue_refund(order=8812, amount=R$149)");
  log("⏸  paused at approval gate, checkpoint saved");
  await sleep(700);
  log("👤 human approved");
  await sleep(250);
  log("[act]   resumed from checkpoint → refund issued");
  log("✓ done. Trace: plan 1 step · act 1 tool call · 1 approval", "ok");
}

/* dev-pulse: sondas de saúde com regra de alerta. */
async function pulse(log, input) {
  const threshold = Math.max(50, Number(input) || 300);
  log(`alert rule: p95 latency > ${threshold}ms or any 5xx`);
  const svc = [["api", 120], ["auth", 90], ["search", 380], ["billing", 0]];
  for (const [name, base] of svc) {
    await sleep(120);
    const lat = base ? Math.round(base * (0.8 + Math.random() * 0.5)) : null;
    const down = lat === null;
    const bad = down || lat > threshold;
    log(`probe ${name.padEnd(8)} ${down ? "503" : `200 ${lat}ms`}  ${bad ? "🔴 incident opened" : "🟢"}`, bad ? "err" : "");
  }
  log("metrics exported: http_probe_latency_seconds{service=...}", "ok");
}

/* knowledge-hub: similaridade de cosseno sobre vetores pequenos. */
async function hub(log, input) {
  const q = (input || "refund").toLowerCase();
  const vocab = ["refund", "money", "shipping", "password", "support", "invoice"];
  const vec = (t) => vocab.map((w) => (t.toLowerCase().includes(w) ? 1 : 0));
  const cos = (a, b) => { const d = a.reduce((s, x, i) => s + x * b[i], 0); const n = Math.hypot(...a) * Math.hypot(...b); return n ? d / n : 0; };
  const qv = vec(q);
  log(`embed("${q}") = [${qv.join(", ")}]`);
  const ranked = DOCS.map((d, i) => [i, cos(qv, vec(d))]).sort((a, b) => b[1] - a[1]).slice(0, 3);
  await sleep(150);
  ranked.forEach(([i, s], k) => log(`  ${k + 1}. cos=${s.toFixed(2)}  ${DOCS[i]}`, k ? "" : "ok"));
}

/* gaia-agent: o laço que extrai a resposta final. */
async function gaia(log, input) {
  const out = input || "Searching... found 3 sources. FINAL ANSWER: 1912";
  log(`model output: ${out}`);
  const m = [...out.matchAll(/FINAL ANSWER:\s*(.+)/g)].pop();
  log(m ? `✓ submitted answer: ${m[1].trim()}` : "✗ no FINAL ANSWER found, retrying the task", m ? "ok" : "err");
}

export const RUNNERS = {
  "wallet-service": { run: wallet, label: "Parallel requests", placeholder: "50" },
  "rag-platform": { run: rag, label: "Question", placeholder: "how do I get my money back?" },
  "saas-starter": { run: saas, label: "Limit per second", placeholder: "5" },
  "agent-flow": { run: agent, label: "Task", placeholder: "refund order #8812" },
  "dev-pulse": { run: pulse, label: "Latency threshold (ms)", placeholder: "300" },
  "knowledge-hub": { run: hub, label: "Query", placeholder: "refund" },
  "gaia-agent": { run: gaia, label: "Model output", placeholder: "Searching... found 3 sources. FINAL ANSWER: 1912" },
};
