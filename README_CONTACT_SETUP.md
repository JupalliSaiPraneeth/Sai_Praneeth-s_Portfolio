# Contact Form Backend (Node.js + Express + Nodemailer)

## What this adds

- A backend server (`server.js`) with `POST /contact`
- Accepts `name`, `email`, `message` from the frontend
- Sends the message to your email using Nodemailer
- Uses environment variables for SMTP + destination email
- Enables CORS and JSON parsing

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root (next to `server.js`).

You can copy `.env.example` and fill in values.

3. Start the server:

```bash
npm start
```

It will run on:

- `http://localhost:3000`

## Frontend usage

Your `index.html` contact form is already wired to call:

- `POST /contact`

So when the server is running, submitting the form will send an email.

## Notes (Gmail)

If you use Gmail:

- Use an **App Password** (recommended)
- Set:
  - `SMTP_HOST=smtp.gmail.com`
  - `SMTP_PORT=587`
  - `SMTP_SECURE=false`

## WhatsApp

This implementation delivers to **email** via SMTP.

If you want WhatsApp delivery too, you can add it via a provider API (e.g. Twilio WhatsApp) in the same `POST /contact` handler.
