# Module 1: Auth, Database Schema & Security

## 1. Overview
Module 1 defines the backend-as-a-service (BaaS) integration powered by Supabase. It provides the PostgreSQL data schema, Row Level Security (RLS) policies, Google OAuth authentication for the portfolio owner, and an offline-resilient client fallback.

## 2. Specifications & Standards
- **Database Tables**:
  - `profiles`: User account details, Google OAuth identity, and authorization role (`admin` or `visitor`).
  - `resume_items`: Master list of experiences, projects, skills, and education entries with category, tags, and display order.
  - `certificates`: Credential records with issuer, credential URLs, file storage URLs, and `is_visible` status.
  - `personal_details`: Extensible personal attributes (languages, hobbies, interests, volunteer work) with category, label, proficiency, and `is_visible` status.
  - `download_logs`: Telemetry records of resume download events (timestamp, preset, IP consent, visitor name, contact, and "Why").
- **Security & RLS**:
  - `SELECT`: Public access for items marked `is_active = true` or `is_visible = true`.
  - `INSERT`: Public access to `download_logs`.
  - `INSERT / UPDATE / DELETE`: Strictly restricted to authenticated Google email matching `VITE_ADMIN_EMAIL` (`oeubxwaa@gmail.com`).
- **Resilience**:
  - If Supabase environment variables are omitted or the database is paused, the client degrades gracefully to local `portfolio.config.ts` and `starterData.json`.

## 3. Feature Breakdown
- `DP-M1-F1`: PostgreSQL Schema & DDL definition.
- `DP-M1-F2`: Row Level Security (RLS) Policies.
- `DP-M1-F3`: Supabase Client with graceful offline fallback.
- `DP-M1-F4`: Google OAuth authentication integration.
