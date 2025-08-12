export default async function handler(req, res) {
  // CORS-Header setzen
 if (req.method === "OPTIONS") {
  res.setHeader("Access-Control-Allow-Origin", "https://luzidfer.github.io");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res.status(204).end();
}


  // Nur POST erlauben
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // SON-Body lesen
  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Airtable-Request
  try {
    const airtableRes = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE}/${encodeURIComponent(process.env.AIRTABLE_TABLE)}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.AIRTABLE_TOKEN}`,
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
    });

    const data = await airtableRes.json();

    if (!airtableRes.ok) {
      return res.status(airtableRes.status).json({ error: data.error?.message || "Airtable error", details: data });
    }

    return res.status(200).json({ success: true, record: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
<<<<<<< HEAD
=======

>>>>>>> 6cdf0039b34caec963594b465f6fe9d4c3e328c2
