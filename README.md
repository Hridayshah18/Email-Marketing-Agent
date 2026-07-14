# Digital Terrene Email Marketing Agent

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Resend](https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=resend&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini_API-4285F4?style=for-the-badge&logo=google&logoColor=white)

AI-powered campaign generation, sending, tracking, and analytics for **Digital Terrene**.

> A production-oriented internal email marketing agent that helps Digital Terrene create promotions, generate AI-powered campaigns, send personalized emails through Resend, track clicks/unsubscribes, and review performance from a clean admin dashboard.

- Production app domain: `https://email.digitalterrene.online`
- Company website: `https://digitalterrene.online`
- Sending identity: `Digital Terrene <promotions@digitalterrene.online>`
- Public demo mode: safe mock data only

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Admin Mode and Demo Mode](#admin-mode-and-demo-mode)
- [Application Routes](#application-routes)
- [Architecture](#architecture)
- [Repository Structure](#repository-structure)
- [Tech Stack](#tech-stack)
- [Database](#database)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Email Sending and Tracking](#email-sending-and-tracking)
- [Deployment](#deployment)
- [Security Notes](#security-notes)
- [QA Checklist](#qa-checklist)
- [Roadmap](#roadmap)

---

## Overview

Digital Terrene Email Marketing Agent is an internal SaaS-style tool for a digital agency offering website development, social media marketing, logo design, branding, AI ads, software development, automation, SEO, and complete digital growth packages.

The app supports the full campaign lifecycle:

```txt
Contacts
  -> Promotion
  -> AI campaign generation
  -> Subject selection
  -> Email preview
  -> Resend delivery
  -> Click/open/unsubscribe tracking
  -> Analytics dashboard
```

The project also includes a public demo mode for GitHub or portfolio viewers. Demo mode uses fake data only and cannot call Supabase, Gemini, OpenAI, or Resend.

---

## Key Features

### Campaign Workflow

- Create Digital Terrene promotions
- Generate campaign copy with Gemini
- Keep optional OpenAI provider support
- Generate 10 subject lines
- Preview responsive HTML emails
- Save draft campaigns
- Send through Resend
- Store `resend_email_id` only after Resend returns a real ID
- Track sends, opens, clicks, bounces, complaints, and unsubscribes

### Contact Management

- Add contacts manually
- Upload contacts by CSV
- Validate email addresses
- Track business type, city, service interest, and source
- Exclude unsubscribed contacts from future sends

### Analytics

- Dashboard metric cards
- Campaign-level analytics
- Recipient-level send status
- Recharts line and bar charts
- Delivery, open, click, bounce, and unsubscribe rates

### Public Demo Mode

- Public `/demo` showcase without login
- Fake contacts, campaigns, and analytics
- Simulated campaign generation
- Disabled send/upload/save actions
- Server-side protection against demo-origin production API calls

---

## Admin Mode and Demo Mode

### Admin Mode

Admin mode is the real production system. It requires login and can access real Supabase data, Gemini generation, and Resend sending.

Supported auth environment variables:

```env
ADMIN_EMAIL=
ADMIN_EMAILS=
ADMIN_PASSWORD=
```

`ADMIN_EMAILS` supports a comma-separated team list, for example:

```env
ADMIN_EMAILS=digitalterrene06@gmail.com,promotions@digitalterrene.online
```

Public signup is not enabled.

### Demo Mode

Demo mode is safe for public visitors.

Demo mode cannot:

- read real Supabase data
- write to Supabase
- call Gemini or OpenAI
- call Resend
- send emails
- trigger real tracking or unsubscribe actions
- expose real contacts or campaigns

Enable or disable it with:

```env
PUBLIC_DEMO_ENABLED=true
```

---

## Application Routes

| Area | Route | Purpose |
| --- | --- | --- |
| Landing | `/` | Public landing with Admin Login and Check Demo |
| Login | `/login` | Real admin login |
| Dashboard | `/dashboard` | Real analytics dashboard |
| Contacts | `/contacts` | Manage real contacts |
| New Contact | `/contacts/new` | Add contact |
| Upload Contacts | `/contacts/upload` | CSV upload |
| Promotions | `/promotions` | Manage promotions |
| New Promotion | `/promotions/new` | Create promotion |
| Campaigns | `/campaigns` | Campaign list |
| New Campaign | `/campaigns/new` | Generate campaign from promotion |
| Campaign Detail | `/campaigns/[id]` | Edit, preview, and send campaign |
| Campaign Preview | `/campaigns/[id]/preview` | HTML email preview |
| Campaign Analytics | `/campaigns/[id]/analytics` | Per-campaign analytics |
| Settings | `/settings` | Branding, sender settings, env readiness |
| Demo Dashboard | `/demo` or `/demo/dashboard` | Fake dashboard |
| Demo Contacts | `/demo/contacts` | Fake contact list |
| Demo Promotions | `/demo/promotions` | Fake promotions |
| Demo Campaigns | `/demo/campaigns` | Fake campaigns |
| Demo Campaign Detail | `/demo/campaigns/[id]` | Fake builder and preview |
| Demo Analytics | `/demo/campaigns/[id]/analytics` | Fake analytics |

---

## Architecture

```txt
Browser
  |
  v
Next.js App Router
  |
  +-- Public Landing Page
  |
  +-- Demo Mode
  |     +-- Mock data only
  |     +-- No provider/API calls
  |
  +-- Admin Mode
  |     +-- Protected dashboard
  |     +-- Contacts
  |     +-- Promotions
  |     +-- Campaigns
  |     +-- Settings
  |
  +-- Server Actions and API Routes
        +-- Supabase Postgres
        +-- Gemini campaign generation
        +-- Resend email sending
        +-- Tracking routes
        +-- Resend webhooks
```

---

## Repository Structure

```txt
Email Marketing Agent/
|
|-- public/
|   |-- dt-logo.png
|
|-- supabase/
|   |-- migrations/
|       |-- 001_initial_schema.sql
|       |-- 002_production_branding_defaults.sql
|
|-- src/
|   |-- app/
|   |   |-- (admin)/
|   |   |   |-- dashboard/
|   |   |   |-- contacts/
|   |   |   |-- promotions/
|   |   |   |-- campaigns/
|   |   |   |-- settings/
|   |   |
|   |   |-- api/
|   |   |   |-- ai/generate-campaign/
|   |   |   |-- campaigns/[id]/send/
|   |   |   |-- campaigns/[id]/schedule/
|   |   |   |-- contacts/upload/
|   |   |   |-- track/click/
|   |   |   |-- track/open/
|   |   |   |-- unsubscribe/
|   |   |   |-- webhooks/resend/
|   |   |
|   |   |-- demo/
|   |   |-- login/
|   |   |-- page.tsx
|   |   |-- layout.tsx
|   |
|   |-- components/
|   |   |-- demo/
|   |   |-- layout/
|   |   |-- ui/
|   |
|   |-- lib/
|       |-- ai/
|       |-- auth.ts
|       |-- branding.ts
|       |-- demo-data.ts
|       |-- demo-guard.ts
|       |-- email.ts
|       |-- env-check.ts
|       |-- supabase.ts
|       |-- validation.ts
|
|-- .env.example
|-- .gitignore
|-- README.md
|-- package.json
|-- next.config.ts
|-- tsconfig.json
```

---

## Tech Stack

| Category | Technology |
| --- | --- |
| Framework | Next.js App Router |
| UI | React |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase Postgres |
| AI Provider | Gemini API |
| Optional AI Provider | OpenAI API |
| Email Delivery | Resend |
| Charts | Recharts |
| Validation | Zod |
| CSV Parsing | PapaParse |
| Icons | Lucide React |
| Deployment Target | Hostinger Node.js Web App |

---

## Database

Supabase migrations create:

| Table | Purpose |
| --- | --- |
| `contacts` | Contact and unsubscribe records |
| `promotions` | Offer and campaign brief data |
| `campaigns` | Generated campaign content |
| `campaign_recipients` | Per-recipient send/tracking state |
| `events` | Sent, delivered, open, click, bounce, complaint, unsubscribe, failed events |
| `ai_generations` | AI input/output history |
| `settings` | Company branding, sender identity, CTA defaults |

Run migrations in order:

```txt
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_production_branding_defaults.sql
```

---

## Getting Started

### Prerequisites

- Node.js 20 or 22
- npm
- Supabase project
- Gemini API key
- Resend API key
- Verified Resend sending domain

### Install

```bash
npm install
```

### Environment

Create `.env.local` from `.env.example`.

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

### Run Database Migrations

Open Supabase SQL Editor and run the migration files from `supabase/migrations/` in order.

### Start Locally

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

If local certificate trust causes provider fetch issues on Windows, start with:

```powershell
$env:NODE_OPTIONS="--use-system-ca"; npm run dev
```

---

## Environment Variables

`.env.example` intentionally contains placeholders only.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

GEMINI_API_KEY=
AI_PROVIDER=gemini
GEMINI_MODEL=gemini-2.5-flash-lite
OPENAI_API_KEY=

RESEND_API_KEY=
RESEND_WEBHOOK_SECRET=

APP_URL=
DEFAULT_FROM_EMAIL=
DEFAULT_REPLY_TO_EMAIL=
BRAND_LOGO_URL=https://email.digitalterrene.online/dt-logo.png

ADMIN_EMAIL=
ADMIN_EMAILS=
ADMIN_PASSWORD=

PUBLIC_DEMO_ENABLED=true
```

### Local Example

```env
APP_URL=http://localhost:3000
BRAND_LOGO_URL=http://localhost:3000/dt-logo.png
DEFAULT_FROM_EMAIL=Digital Terrene <promotions@digitalterrene.online>
DEFAULT_REPLY_TO_EMAIL=promotions@digitalterrene.online
PUBLIC_DEMO_ENABLED=true
```

### Production Example

```env
APP_URL=https://email.digitalterrene.online
BRAND_LOGO_URL=https://email.digitalterrene.online/dt-logo.png
DEFAULT_FROM_EMAIL=Digital Terrene <promotions@digitalterrene.online>
DEFAULT_REPLY_TO_EMAIL=promotions@digitalterrene.online
ADMIN_EMAILS=digitalterrene06@gmail.com,promotions@digitalterrene.online
PUBLIC_DEMO_ENABLED=true
```

Never commit `.env.local`.

---

## Available Scripts

| Script | Command | Purpose |
| --- | --- | --- |
| Development | `npm run dev` | Start local dev server |
| Build | `npm run build` | Create production build |
| Start | `npm run start` | Start production server |
| Lint | `npm run lint` | Run ESLint |

---

## Email Sending and Tracking

### Resend Sending

Emails are sent through Resend using:

```txt
Digital Terrene <promotions@digitalterrene.online>
```

The app only marks a recipient as `sent` after Resend returns `data.id`, which is stored as `resend_email_id`.

### Email Logo

Production email logo:

```txt
https://email.digitalterrene.online/dt-logo.png
```

Set:

```env
BRAND_LOGO_URL=https://email.digitalterrene.online/dt-logo.png
```

### CTA Click Tracking

CTA links are rewritten through:

```txt
/api/track/click
```

The route stores click events and redirects to the original CTA URL.

### Open Tracking

The send flow appends a transparent tracking pixel:

```txt
/api/track/open
```

Open tracking can be affected by email client image proxying/blocking.

### Unsubscribe

Every promotional email includes an unsubscribe link:

```txt
/api/unsubscribe
```

Unsubscribed contacts are excluded from future sends.

---

## Deployment

Target:

```txt
Hostinger Node.js Web App
```

Recommended settings:

| Setting | Value |
| --- | --- |
| Node version | 20 or 22 |
| Package manager | npm |
| Install command | `npm install` |
| Build command | `npm run build` |
| Start command | `npm run start` |
| Production APP_URL | `https://email.digitalterrene.online` |

Deployment reminders:

- Add all production environment variables in Hostinger.
- Do not upload `.env.local`.
- Confirm `https://email.digitalterrene.online/dt-logo.png` opens publicly.
- Confirm Resend domain verification for `digitalterrene.online`.
- Configure Resend webhook after deployment.
- Redeploy after changing environment variables.

---

## Security Notes

- Real admin routes are protected.
- Public signup is disabled.
- Demo mode uses mock data only.
- Demo-origin requests are blocked from sensitive production actions.
- Never expose `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `GEMINI_API_KEY`, `OPENAI_API_KEY`, `ADMIN_PASSWORD`, or webhook secrets.
- Keep `.env.local` out of GitHub.
- Upload only contacts who have consented to receive marketing emails.
- Always include unsubscribe links.

`.gitignore` includes:

```txt
.env
.env.local
.env*.local
```

---

## QA Checklist

### Local

- [ ] `/` shows Admin Login and Check Demo
- [ ] `/demo/dashboard` opens without login
- [ ] Demo mode uses fake data only
- [ ] Admin login works
- [ ] Contact creation works
- [ ] CSV upload works
- [ ] Promotion creation works
- [ ] Gemini campaign generation works
- [ ] Campaign preview works
- [ ] Resend send works
- [ ] `resend_email_id` is stored
- [ ] CTA click tracking works
- [ ] Unsubscribe tracking works
- [ ] Dashboard analytics update
- [ ] `npm run lint` passes
- [ ] `npm run build` passes

### Production

- [ ] `https://email.digitalterrene.online` opens
- [ ] `https://email.digitalterrene.online/dt-logo.png` opens
- [ ] Admin login works
- [ ] Demo mode works
- [ ] Supabase connection works
- [ ] Gemini generation works
- [ ] Resend sends from verified domain
- [ ] Test email logo loads
- [ ] CTA redirects to `https://digitalterrene.online`
- [ ] Click events update analytics
- [ ] Unsubscribe works
- [ ] Resend webhook receives events

---

## Deliverability Notes

- Configure SPF, DKIM, and DMARC records.
- Use honest subject lines.
- Avoid misleading urgency and spam-heavy phrasing.
- Send only to consented contacts.
- Warm up the sending domain gradually.
- Monitor Resend logs, bounces, and complaints.
- Ask trusted recipients to mark early emails as not spam if needed.

---

## Roadmap

- Supabase Auth with roles
- Multi-user team accounts
- Audience segmentation
- Email template library
- Scheduled campaign worker
- Richer CSV import reporting
- Campaign search and filters
- Exportable analytics reports
- A/B testing for subject lines
- Automated campaign sequences

---

## License

No open-source license has been applied yet. This project is intended for Digital Terrene internal and portfolio use.

---

## Authors

- Hriday Shah

---

## Acknowledgments

Built with Next.js, React, TypeScript, Tailwind CSS, Supabase, Gemini API, Resend, Recharts, Zod, PapaParse, Lucide React, and the open-source community.
