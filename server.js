const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "20kb" }));
app.use(rateLimit({ windowMs: 60_000, limit: 30 }));
app.use(express.static(path.join(__dirname, "public")));

const allowedHosts = new Set([
  "instagram.com", "www.instagram.com",
  "facebook.com", "www.facebook.com", "m.facebook.com", "fb.watch"
]);

function validateShareUrl(raw) {
  let url;
  try { url = new URL(raw); } catch { return null; }
  if (url.protocol !== "https:" || !allowedHosts.has(url.hostname.toLowerCase())) return null;
  return url;
}

app.post("/api/download", async (req, res) => {
  const raw = typeof req.body?.url === "string" ? req.body.url.trim() : "";
  const url = validateShareUrl(raw);
  if (!url) {
    return res.status(400).json({ error: "Enter a valid public Instagram or Facebook HTTPS link." });
  }

  // Platform share URLs cannot reliably or lawfully be resolved by generic scraping.
  // Connect an official/authorized provider here. It must verify the user's rights
  // and return only media the user owns or is authorized to download.
  if (!process.env.MEDIA_PROVIDER_ENDPOINT || !process.env.MEDIA_PROVIDER_TOKEN) {
    return res.status(503).json({
      error: "Downloader service is not connected yet.",
      detail: "The website is ready, but actual platform downloads require an authorized media provider/API and any required user authorization. Configure MEDIA_PROVIDER_ENDPOINT and MEDIA_PROVIDER_TOKEN, then implement the provider adapter in this route."
    });
  }

  // Intentionally fail closed until a provider-specific, rights-aware adapter is implemented.
  return res.status(501).json({
    error: "Provider adapter required.",
    detail: "Connect your authorized provider's documented API here. Do not scrape private content or bypass platform access controls."
  });
});

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "Bharatansh Downloader" }));

app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.listen(PORT, () => console.log(`Bharatansh Downloader running at http://localhost:${PORT}`));
