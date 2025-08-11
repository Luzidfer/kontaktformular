export default async function handler(req, res) {
  const ALLOWED_ORIGINS = [
    "https://luzidfer.github.io",
    "http://localhost:3000",
  ];

  const origin = req.headers.origin;
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : "*";

  res.setHeader("Access-Control-Allow-Origin", allowOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const AIRTABLE_BASE = process.env.AIRTABLE_BASE;
  const AIRTABLE_TABLE = process.env.AIRTABLE_TABLE;
  const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;

  if (!AIRTABLE_BASE || !AIRTABLE_TABLE || !AIRTABLE_TOKEN) {
    res.status(500).json({ error: "Server misconfigured" });
    return;
  }

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const airtableRes = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(AIRTABLE_TABLE)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: { Name: name, Email: email, Phone: phone || "", Message: message },
        }),
      }
    );

    const data = await airtableRes.json();

    if (!airtableRes.ok) {
      res.status(airtableRes.status).json({ error: data.error || "Airtable error" });
      return;
    }

    res.status(200).json({ success: true, record: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

