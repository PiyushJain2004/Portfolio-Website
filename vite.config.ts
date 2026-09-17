import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

const RECIPIENT = "75.piyushjain@gmail.com";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function localContactApi(apiKey: string): Plugin {
  return {
    name: "local-contact-api",
    configureServer(server) {
      server.middlewares.use("/api/contact", async (req, res, next) => {
        if (req.method !== "POST") return next();

        try {
          let raw = "";
          for await (const chunk of req) raw += chunk;
          const body = raw ? JSON.parse(raw) : {};
          const name = clean(body.name);
          const email = clean(body.email);
          const message = clean(body.message);
          const honeypot = clean(body.honeypot);

          res.setHeader("Content-Type", "application/json");

          if (honeypot) {
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true }));
          }

          if (!name || !email || !message || !/^\S+@\S+\.\S+$/.test(email)) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ success: false, message: "Please provide valid contact details." }));
          }

          if (!apiKey) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ success: false, message: "Email delivery is not configured. Add RESEND_API_KEY to .env.local." }));
          }

          const resendResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              from: "Piyush Jain Portfolio <onboarding@resend.dev>",
              to: [RECIPIENT],
              reply_to: email,
              subject: `Portfolio enquiry from ${name}`,
              text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            }),
          });

          if (!resendResponse.ok) {
            res.statusCode = 502;
            return res.end(JSON.stringify({ success: false, message: "Email delivery failed." }));
          }

          res.statusCode = 200;
          return res.end(JSON.stringify({ success: true }));
        } catch {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          return res.end(JSON.stringify({ success: false, message: "Invalid request." }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    plugins: [react(), localContactApi(env.RESEND_API_KEY || "")],
    server: { port: 5173, host: "localhost" },
  };
});
