'use strict';

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();

// Enable CORS so your frontend (served from a different origin/port) can call this API.
app.use(cors());

// Parse JSON request bodies.
app.use(express.json({ limit: '50kb' }));

// Serve your portfolio (index.html + images) over HTTP.
// This avoids the browser "file://" CORS restrictions and lets fetch('/contact') work.
app.use(express.static(__dirname));

// Serve public folder (videos, assets, etc.)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check (optional, helpful for debugging)
app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

// POST /contact
// Accepts: { name, email, message }
// Sends the message to your email using Nodemailer.
app.post('/contact', async (req, res) => {
  try {
    const name = (req.body?.name || '').toString().trim();
    const email = (req.body?.email || '').toString().trim();
    const message = (req.body?.message || '').toString().trim();

    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: 'Missing required fields: name, email, message' });
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return res.status(400).json({ ok: false, error: 'Invalid email address' });
    }

    // Environment variables (keep secrets out of your code)
    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_PASS,
      CONTACT_TO_EMAIL,
      CONTACT_FROM_EMAIL,
      SMTP_SECURE
    } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      return res.status(500).json({
        ok: false,
        error: 'Server email is not configured (missing SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS)'
      });
    }

    if (!CONTACT_TO_EMAIL) {
      return res.status(500).json({ ok: false, error: 'Server email is not configured (missing CONTACT_TO_EMAIL)' });
    }

    const fromEmail = CONTACT_FROM_EMAIL || CONTACT_TO_EMAIL;

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: (SMTP_SECURE || '').toLowerCase() === 'true',
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const subject = `Portfolio Contact: ${name}`;

    // Send a simple, readable email.
    await transporter.sendMail({
      from: fromEmail,
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject,
      text: [
        'New portfolio contact message',
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        '',
        'Message:',
        message,
      ].join('\n'),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('POST /contact error:', err);
    return res.status(500).json({ ok: false, error: 'Failed to send message' });
  }
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log(`Contact server running on http://localhost:${PORT}`);
});
