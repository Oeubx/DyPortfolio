# Module 4: Download Telemetry & Post-Download Feedback Modal

## 1. Overview
Module 4 handles resume download tracking and post-download visitor engagement. It ensures that clicking "Download CV" immediately delivers the resume to the visitor, while gracefully logging the download event and offering an optional follow-up modal for personal tracking and networking.

## 2. Specifications & Standards
- **Immediate Download Dispatcher**:
  - The download action begins instantly on button click.
  - Generates the client-side PDF and saves the initial download timestamp, preset name, and device summary to Supabase `download_logs`.
- **Post-Download Feedback Modal**:
  - Automatically pops up immediately after the download initiates.
  - **Greeting**: *"Thank you for checking out my portfolio/resume!"*
  - **Validation & Clarity Text**: *"Providing your details below is completely optional. It is used strictly for personal tracking and to know who was interested in my work. Your details will never be shared."*
  - **Form Fields (Optional)**:
    - Full Name
    - Contact Details (Email / LinkedIn / X)
    - "Why / Purpose of Download" (e.g. Hiring, Contract work, Collaboration, Review)
  - **Action Controls**:
    - "Submit Details": Updates the existing `download_logs` row with visitor details.
    - "Skip / Close": Dismisses the modal without requiring input.
- **Anti-Bot & Rate-Limiting Protection**:
  - Invisible Cloudflare Turnstile token validation to prevent automated spam queries.

## 3. Feature Breakdown
- `DP-M4-F1`: Immediate Download Dispatcher & Telemetry Logger.
- `DP-M4-F2`: Post-Download Modal Component with Validation & Thank You.
- `DP-M4-F3`: Cloudflare Turnstile Anti-Bot Verification & Hard Spend Cap Safeguards.
