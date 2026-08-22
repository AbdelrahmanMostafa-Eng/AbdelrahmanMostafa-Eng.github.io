# Abdelrahman Mostafa — Engineering in public

Personal portfolio for **Abdelrahman Mostafa**, an aspiring computer engineer exploring software, simulation, data, security tooling, and systems design.

## New visual direction

This version is a complete rebuild with an engineering-console aesthetic: deep-navy surfaces, bright cyan signal accents, blue-gray system markers, monospace diagnostics, a live workbench graph, structured toolchain bars, and repository cards that feel closer to a personal lab interface than a marketing template. The light theme uses `#F8FAFC` background, `#FFFFFF` surfaces, `#0F172A` text, and `#2563EB` primary. The dark theme uses `#070B12` background, `#111820` surfaces, `#F1F5F9` text, and `#3B82F6` primary. Ambient fields stay low-opacity and heavily blurred: light mode uses `#60A5FA`, `#A78BFA`, and `#67E8F9`; dark mode uses `#2563EB`, `#7C3AED`, and `#0891B2`. The header starts as a normal full-width bar and morphs into a compact glass island after scrolling, with blur, saturation, rounded geometry, border light, and depth-aware shadow.

## Automatic GitHub repository feed

The public work section is now generated at runtime from the GitHub REST API endpoint for `AbdelrahmanMostafa-Eng`:

```text
https://api.github.com/users/AbdelrahmanMostafa-Eng/repos?per_page=100&sort=updated
```

The browser filters out forked repositories, sorts the remaining public repositories, and creates the cards from an HTML `<template>`. This means that when a new public repository is created under the account, it can appear automatically the next time someone visits the portfolio or presses **Sync now**. No manual HTML edit is needed.

The feed includes **All work**, **Featured**, and **Recently updated** views, plus sorting by updated date, stars, or repository name. If GitHub is temporarily unavailable or its public API rate limit is reached, the interface shows a clear retry state rather than inventing repository data.

## Included interactions

The site includes light and dark themes, a live clock, a telemetry-style hero graph with visible axes, time ticks, normalized throughput, a nominal threshold line, a latest-sample crosshair, hover inspection, and live latency/throughput readouts, a diagnostic console with rotating and typewritten status messages, clickable and keyboard-accessible signal modules, exact cyan/deep-navy theme roles, soft blurred ambient fields, a normal-to-glass-island header morph on scroll, a fixed scroll-progress rail, section-aware 3D depth offsets, perspective scroll choreography, active navigation states, keyboard-accessible repository cards, a corrected responsive mobile menu, interactive filters, sorting, hover lighting, premium perspective tilt on the hero and dynamically loaded repository surfaces, staggered repository entrance motion, dimensional buttons with ripple and press states, tactile toolchain and roadmap rows, a professional footer, and an icon-only back-to-top control with hover text. GitHub sync requests use an abort timeout and expose a clear retry state instead of hanging indefinitely. Scroll-linked transforms are disabled or simplified under `prefers-reduced-motion`, and horizontal overflow is clipped so depth effects never create a bottom scrollbar.

## Local preview

From the repository root, serve the static files with any local server. For example:

```bash
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173` in a browser.

## GitHub Pages

The repository is configured for a static GitHub Pages deployment from the `main` branch. `.nojekyll` is included so the custom static entrypoint is served directly.

The runtime repository feed is intentionally public-data-only and requires no API token, backend, database, scheduled job, or secret configuration.
