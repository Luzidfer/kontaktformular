export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);

    if (request.method === "GET") {
      if (url.pathname === "/favicon.ico") {
        return new Response(null, { status: 204, headers: corsHeaders });
      }
      return new Response("Not Found", { status: 404, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
    }

    try {
      const body = await request.json();
      const { name, email, phone, message } = body;
      
      const airtableResponse = await fetch(
        "https://api.airtable.com/v0/appwMPXHaqXmCjBo6/Contacts",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.AIRTABLE_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ fields: { name, email, phone, message } })
        }
      );
      
      const data = await airtableResponse.json();
      return new Response(JSON.stringify(data), {
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
