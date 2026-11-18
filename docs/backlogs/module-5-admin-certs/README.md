# Module 5: Dynamic Certificates, Personal Details & Admin Management

## 1. Overview
Module 5 provides the secured content management tools for the portfolio owner. It enables uploading certificates directly to cloud storage, updating personal attributes (spoken languages, hobbies), and auditing resume download telemetry in real time without code modifications or git commits.

## 2. Specifications & Standards
- **Admin Authentication Guard**:
  - Requires Google OAuth sign-in.
  - Verifies authenticated email against `VITE_ADMIN_EMAIL` (`oeubxwaa@gmail.com`).
  - Non-owner accounts are prevented from accessing `/admin` routes.
- **Certificate Manager**:
  - Direct file upload to the Supabase Storage bucket (`certificates`).
  - Fields: Title, Issuer, Issue Date, Credential URL, Storage file URL, Tags.
  - Real-time `is_visible` toggle to show or hide credentials from the public gallery.
- **Dynamic Personal Details Manager**:
  - Full CRUD for personal details:
    - Spoken/written languages (e.g. English, Tagalog, Mandarin) with proficiency tags.
    - Hobbies and personal interests (e.g. Audio Engineering, Chess).
    - Volunteer activities and custom personal highlights.
  - Changes instantly reflect on the About Me view and become available in the resume builder.
- **Download Analytics Dashboard**:
  - Tabular view of all download events.
  - Columns: Timestamp, Visitor Name, Contact, Reason / "Why", Resume Preset, Device Info.

## 3. Feature Breakdown
- `DP-M5-F1`: Admin Route Guard & Google OAuth Validation.
- `DP-M5-F2`: Certificate File Upload & Visibility Toggle Engine.
- `DP-M5-F3`: Dynamic Personal Details CRUD Manager.
- `DP-M5-F4`: Download Analytics Audit Table.
