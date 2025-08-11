export default {
  async fetch(request, env) {
    // Allowed origins (add more as needed)
    const ALLOWED_ORIGINS = [
      "https://luzidfer.github.io",
      "http://localhost:3000"
    ];

    const origin = request.headers.get("Origin");
    const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : "*";

    const corsHeaders = {
      "Access-Control-Allow-Origin": allowOrigin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Always handle OPTIONS first
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Only allow POST for actual data submissions
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Parse JSON
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const { name, email, phone, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Airtable config
    const baseId = env.AIRTABLE_BASE;
    const tableName = env.AIRTABLE_TABLE;
    const token = env.AIRTABLE_TOKEN; // Personal Access Token

    if (!baseId || !tableName || !token) {
      return new Response(JSON.stringify({ error: "Server misconfigured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Make Airtable request
    try {
      const airtableResp = await fetch(
        `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
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

      const data = await airtableResp.json();

      if (!airtableResp.ok) {
        return new Response(JSON.stringify({ error: "Airtable error", details: data }), {
          status: airtableResp.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      return new Response(JSON.stringify({ success: true, record: data }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};
