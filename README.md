# Piyush Jain Portfolio

Modern React + Vite portfolio for Piyush Jain.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Contact form

The contact form sends messages directly to `75.piyushjain@gmail.com` through the included Vercel serverless function at `api/contact.ts`.

It intentionally does **not** use FormSubmit, so the submission emails do not contain FormSubmit's sponsored/ad block.

For local testing:

1. Create a Resend account and generate an API key.
2. Create `.env.local` in the project root and add `RESEND_API_KEY=your_key`.
3. Restart `npm run dev`. The Vite dev server now provides `/api/contact`, so the form works at `localhost:5173` too.

For Vercel:

1. Add `RESEND_API_KEY` to the Vercel project's Environment Variables.
2. Deploy the portfolio to Vercel.
3. Submit one test message from the live site.

The visitor stays on the portfolio page; no email-client chooser or external form page is opened.

## Resume

`public/Piyush-Jain-Resume.pdf` is the exact resume supplied for this portfolio.
