# Module 6: Template Generalization & Open-Source Distribution

## 1. Overview
Module 6 ensures DyPortfolio functions as an accessible, open-source portfolio template for other developers. It decouples personal data into clean configuration files, provides comprehensive setup guides, and enables 1-click forking under the MIT License.

## 2. Specifications & Standards
- **Two-Stage Architecture**:
  - **Stage 1 (General Version)**: Distributed with `portfolio.config.ts` and `public/data/starterData.json`, allowing any developer to clone and launch their own dynamic portfolio with zero boilerplate.
  - **Stage 2 (Personal Version)**: Tailored production deployment featuring Prince Amorsolo C. Remo's personal resume data, personal certificates, and private Supabase credentials.
- **Centralized Configuration (`portfolio.config.ts`)**:
  - Personal branding parameters: Name, Job Titles, Bio, Location, Social Profiles.
  - Role Presets definitions: Default checked items per role.
  - Resume layout preferences: Fonts, section titles, contact formatting.
- **Template Documentation**:
  - Clear README guide explaining how to clone, configure, customize, and deploy to GitHub Pages for free.

## 3. Feature Breakdown
- `DP-M6-F1`: Centralized Configuration Abstraction (`portfolio.config.ts`).
- `DP-M6-F2`: Generic Starter Dataset (`starterData.json`).
- `DP-M6-F3`: Template Documentation, Fork Guide & MIT Licensing.
