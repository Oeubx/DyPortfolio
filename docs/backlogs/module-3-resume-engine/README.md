# Module 3: Dynamic Resume Engine & 1-Page PDF Generation

## 1. Overview
Module 3 implements the heart of the "Dynamic Portfolio" concept: a dedicated workspace where the user can tailor their resume in real time based on job requirements, view an immediate side-by-side preview, and generate an ATS-friendly, single-page PDF.

## 2. Specifications & Standards
- **Role Presets**:
  - `Software Developer`: Auto-checks core engineering skills, backend/frontend frameworks, and technical projects.
  - `Systems / Architecture`: Highlights databases, cloud infrastructure, performance, and leadership achievements.
  - `Custom Selection`: Fully manual toggles across all available items.
- **Dynamic Checklists**:
  - Interactive checkboxes categorized by Skills, Experiences, Projects, and Optional Personal Details (e.g. Spoken Languages, Hobbies).
- **Live Visual Preview**:
  - Formatted container rendering the exact layout of the resume in A4 / Letter proportions with instant live updates as checkboxes toggle.
- **PDF Document Engine (`@react-pdf/renderer`)**:
  - Strict 1-page layout optimization with compact typography, tight padding, and clean dividers.
  - Client-side vector rendering with selectable text and ATS keyword readability.

## 3. Feature Breakdown
- `DP-M3-F1`: Role Presets Engine & Presets State.
- `DP-M3-F2`: Interactive Category Checklists & Search.
- `DP-M3-F3`: Live 1-Page Scaled Preview Container.
- `DP-M3-F4`: Single-Page ATS-Compliant PDF Definition.
