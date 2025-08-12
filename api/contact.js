export default async function handler(req, res) {
  // --- CORS ---
  const allowedOrigin = "https://kontaktformular-1agnb90sp-luzidfers-projects.vercel.app"; // your frontend URL
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // --- Only allow POST ---
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // --- Validate env vars ---
  if (!process.env.AIRTABLE_TOKEN || !process.env.AIRTABLE_BASE || !process.env.AIRTABLE_TABLE) {
    return res.status(500).json({
      error: "Server misconfiguration",
      details: {
        tokenSet: !!process.env.AIRTABLE_TOKEN,
        baseSet: !!process.env.AIRTABLE_BASE,
        tableSet: !!process.env.AIRTABLE_TABLE
      }
    });
  }

  // --- Parse request body ---
  let body;
  try {
    body = req.body;
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const { name, email, phone, message } = body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // --- Airtable request ---
  try {
    const airtableRes = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE}/${encodeURIComponent(process.env.AIRTABLE_TABLE)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fields: {
            Name: name,
            Email: email,
            Phone: phone || "",
            Message: message
          }
        })
      }
    );

    const data = await airtableRes.json();

    if (!airtableRes.ok) {
      // Pass Airtable's actual error to the client for debugging
      return res.status(airtableRes.status).json({ error: data });
    }

    return res.status(200).json({ success: true, record: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
