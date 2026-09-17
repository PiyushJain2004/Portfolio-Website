const RECIPIENT = "75.piyushjain@gmail.com";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const body = req.body || {};
  const name = clean(body.name);
  const email = clean(body.email);
  const message = clean(body.message);
  const honeypot = clean(body.honeypot);

  // Quietly accept bot submissions without sending an email.
  if (honeypot) return res.status(200).json({ success: true });

  if (!name || !email || !message || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ success: false, message: "Please provide valid contact details." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ success: false, message: "Email delivery is not configured." });
  }

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Piyush Jain Portfolio <onboarding@resend.dev>",
      to: [RECIPIENT],
      reply_to: email,
      subject: `Portfolio enquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    }),
  });

  if (!resendResponse.ok) {
    return res.status(502).json({ success: false, message: "Email delivery failed." });
  }

  return res.status(200).json({ success: true });
}
