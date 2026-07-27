// api/call.js — Vercel serverless function
// Receives {name, company, phone} from the site's test-call widget and asks
// Twilio to place an outbound call to that phone number. The AI voice script
// itself lives in a TwiML Bin (or another URL you configure) — see the setup
// guide. Credentials are read from environment variables so nothing sensitive
// lives in the repo.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, company, phone } = req.body || {};
  if (!name || !phone) {
    return res.status(400).json({ error: "Missing name or phone" });
  }

  const sid   = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from  = process.env.TWILIO_FROM_NUMBER;
  const twiml = process.env.TWILIO_TWIML_URL;

  if (!sid || !token || !from || !twiml) {
    return res.status(500).json({
      error: "Twilio env variables missing. Need TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, TWILIO_TWIML_URL."
    });
  }

  try {
    const body = new URLSearchParams({
      To: phone,
      From: from,
      Url: twiml
    });
    const auth = Buffer.from(sid + ":" + token).toString("base64");
    const r = await fetch("https://api.twilio.com/2010-04-01/Accounts/" + sid + "/Calls.json", {
      method: "POST",
      headers: {
        "Authorization": "Basic " + auth,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body
    });
    const data = await r.json();
    if (!r.ok) {
      return res.status(r.status).json({ error: data?.message || "Twilio rejected the call", code: data?.code });
    }
    return res.status(200).json({ ok: true, sid: data.sid, status: data.status });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Failed" });
  }
}
