# Design System Starter

This is a fresh Vite + React + TypeScript + Tailwind v4 starter that carries over the Poster Studio design system.

## What was copied

- `guidelines/Guidelines.md`
- `guidelines/DESIGN-SYSTEM.md`
- `src/styles/fonts.css`
- `src/styles/tailwind.css`
- `src/styles/theme.css`
- `src/styles/paint-effects.css`
- `src/styles/index.css`
- `src/app/components/ui/*`

## Prompt to use in this project

```text
Read guidelines/Guidelines.md and guidelines/DESIGN-SYSTEM.md before implementing UI.
Use src/styles/theme.css as the source of truth for colors, radius, typography, shadows, and dark mode.
Compose new UI from src/app/components/ui primitives first.
Use semantic Tailwind tokens like bg-background, text-foreground, bg-card, text-muted-foreground, bg-primary, border-border, and ring-ring.
Do not introduce ad-hoc colors, one-off button styles, or a new visual language unless explicitly requested.
Build app UI for mobile only; desktop should tell users to check on mobile.
Use Inter with stylistic alternates for typography.
Use Phosphor Icons for app-level icons.
```

## Commands

```bash
npm install
npm run dev
npm run dev:phone
npm run dev:desktop
npm run build
```

## Android phone testing

This project is mobile-first. Desktop intentionally shows a reminder to check
the UI on a phone.

Run:

```bash
npm run dev:phone
```

Keep the Android phone on the same Wi-Fi as this computer, then open the LAN URL
printed in the terminal, for example:

```text
http://192.168.1.10:5173/
```

Vite hot reloads the page on the phone after local file changes.
