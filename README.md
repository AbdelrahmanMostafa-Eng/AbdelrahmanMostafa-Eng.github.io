# Abdelrahman Mostafa — Engineering in public

Personal portfolio for **Abdelrahman Mostafa**, an aspiring computer engineer exploring software, simulation, data, security tooling, and systems design.

## New visual direction

This version is a complete rebuild with an engineering-console aesthetic: deep-navy surfaces, bright cyan signal accents, blue-gray system markers, monospace diagnostics, a live workbench graph, structured toolchain bars, and repository cards that feel closer to a personal lab interface than a marketing template. The light theme uses a pale cyan background with deep-navy text, while the dark theme uses deep-navy surfaces with near-white text and cyan interaction states.

## Automatic GitHub repository feed

The public work section is now generated at runtime from the GitHub REST API endpoint for `AbdelrahmanMostafa-Eng`:

```text
https://api.github.com/users/AbdelrahmanMostafa-Eng/repos?per_page=100&sort=updated
```

The browser filters out forked repositories, sorts the remaining public repositories, and creates the cards from an HTML `<template>`. This means that when a new public repository is created under the account, it can appear automatically the next time someone visits the portfolio or presses **Sync now**. No manual HTML edit is needed.

The feed includes **All work**, **Featured**, and **Recently updated** views, plus sorting by updated date, stars, or repository name. If GitHub is temporarily unavailable or its public API rate limit is reached, the interface shows a clear retry state rather than inventing repository data.

## Included interactions

The site includes light and dark themes, a live clock, a telemetry-style hero graph with visible axes, time ticks, normalized throughput, a nominal threshold line, a latest-sample crosshair, hover inspection, and live latency/throughput readouts, a diagnostic console with rotating and typewritten status messages, clickable and keyboard-accessible signal modules, ambient cyan/deep-navy background lighting, a fixed scroll-progress rail, section-aware 3D depth offsets, perspective scroll choreography, active navigation states, keyboard-accessible repository cards, a corrected responsive mobile menu, interactive filters, sorting, hover lighting, premium perspective tilt on the hero and dynamically loaded repository surfaces, staggered repository entrance motion, dimensional buttons with ripple and press states, tactile toolchain and roadmap rows, a professional footer, and an icon-only back-to-top control with hover text. GitHub sync requests use an abort timeout and expose a clear retry state instead of hanging indefinitely. Scroll-linked transforms are disabled or simplified under `prefers-reduced-motion`, and horizontal overflow is clipped so depth effects never create a bottom scrollbar.

## Local preview

From the repository root, serve the static files with any local server. For example:

```bash
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173` in a browser.

## GitHub Pages

The repository is configured for a static GitHub Pages deployment from the `main` branch. `.nojekyll` is included so the custom static entrypoint is served directly.

The runtime repository feed is intentionally public-data-only and requires no API token, backend, database, scheduled job, or secret configuration.
