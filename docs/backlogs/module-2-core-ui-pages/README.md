# Module 2: Core Design System & Presentation Pages

## 1. Overview
Module 2 delivers the public-facing web presence. It establishes a high-contrast minimalist Black & White visual identity with light and dark mode support, responsive navigation, omnipresent contact channels, and core content views.

## 2. Specifications & Standards
- **Monochrome Theme System**:
  - Light Mode: Crisp white background (`#ffffff`), rich black text (`#0a0a0a`), subtle zinc borders (`#e4e4e7`).
  - Dark Mode: Deep black background (`#09090b`), clean white text (`#fafafa`), muted dark zinc borders (`#27272a`).
  - `ThemeContext`: Persists theme preference in `localStorage` and listens to OS system color preference.
- **Pages**:
  - `Home`: Hero headline, specialty badges, key value propositions, quick action links.
  - `Projects`: Filterable project grid with category tags, GitHub links, and live previews.
  - `Experiences`: Interactive timeline covering career, leadership, and education.
  - `Certificates`: Credential gallery with issuer verification links and modal image/PDF viewer.
  - `About Me`: Personal journey narrative, technical philosophy, and dynamic chips for languages and hobbies.
- **Footer**:
  - Contact links: Personal Gmail (`oeubxwaa@gmail.com`), Professional Gmail, LinkedIn, X, Facebook.
  - Quick action: "Download CV" trigger with real-time download.

## 3. Feature Breakdown
- `DP-M2-F1`: B&W Monochrome Design System & ThemeProvider.
- `DP-M2-F2`: Navigation Bar, Active Links & ThemeToggle.
- `DP-M2-F3`: Omnipresent Footer with Social/Contact Bar.
- `DP-M2-F4`: Home Page & Hero Layout.
- `DP-M2-F5`: Projects Showcase with Categorical Filters.
- `DP-M2-F6`: Career & Education Timeline.
- `DP-M2-F7`: Certificates Gallery & Viewer Modal.
- `DP-M2-F8`: About Me View with Dynamic Personal Details.
