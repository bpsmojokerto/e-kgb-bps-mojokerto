const links = [
  "https://ekgbpsmojokerto.ct.ws/data-berkala-pns?i=1",
  "https://ekgbpsmojokerto.ct.ws/data-berkala-pns?i=2",
  "https://ekgbpsmojokerto.ct.ws/data-berkala-pns?i=3",
  "https://ekgbpsmojokerto.ct.ws/data-berkala-pns?i=4",
];

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0 Safari/537.36",
  "Mozilla/5.0 (Linux; Android 11; SM-G996B) Chrome/121.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_4 like Mac OS X) Safari/604.1",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64) Chrome/120.0 Safari/537.36",
];

async function ping() {
  const target = links[Math.floor(Math.random() * links.length)];
  const ua = userAgents[Math.floor(Math.random() * userAgents.length)];

  // 60% chance jalan, 40% skip
  if (Math.random() > 0.6) {
    return `⏩ Skip run at ${new Date().toISOString()}`;
  }

  const res = await fetch(target, {
    headers: { "User-Agent": ua, "Referer": "https://www.google.com/" },
  });

  return `[${new Date().toISOString()}] Visited ${target} → ${res.status}`;
}

Deno.serve(async () => {
  const result = await ping();
  return new Response(result, { status: 200 });
});
