# Poster Studio UI design system

Pointers for **`src/styles/theme.css`** and **`src/app/components/ui/*`** so changes stay intentional.

---

## 1. Semantic tokens

- Prefer **`bg-background`**, **`text-foreground`**, **`border-border`**, **`bg-muted`**, **`text-muted-foreground`**, **`bg-primary`**, **`text-primary`** over ad-hoc colors so theme values follow `:root` / `.dark` in `theme.css`.
- **Current palette:** Theme values come from the TweakCN **Retro** theme. Light mode uses a warm paper background with orange primary actions and low-chroma cream secondary/accent surfaces.
- Keep the theme centralized in **`src/styles/theme.css`**. Do not paste generated theme blocks into **`src/styles/index.css`**; it should only import the style layers.

## 1.1 Current app overrides

- Build product UI for mobile first. Desktop should only tell users to check on mobile.
- This app is light-mode only.
- Use **Inter** as the app font via `--font-sans`; keep Inter stylistic alternates enabled globally.
- Use **Phosphor Icons** (`@phosphor-icons/react`) for new app-level icons. Existing shadcn/Radix primitives may keep their internal icon implementation.

---

## 2. Dark mode

- **`@custom-variant dark`** is defined at the top of **`theme.css`**. Theme is toggled on **`document.documentElement`**.
- Radix overlays/portals attach under **`document.body`**; CSS variables inherit from **`html`** as long as **`html`** carries **`.dark`** when dark mode is on.

**Optional hardening:** If you ever see **`dark:*` utilities** applying while the app is explicitly in **light mode** but the OS is dark, Tailwind may be coupling `dark:` to `prefers-color-scheme`. Replacing with Tailwind’s documented class strategy **`@custom-variant dark (&:where(.dark, .dark *));`** forces **`dark:`** to follow the `.dark` class only (verify after changing).

---

## 3. Button / select hovers (shadcn-aligned baseline)

The committed primitives use **accent hovers**, not muted-only hovers:

- **`Button`** **`ghost`**: `hover:bg-accent hover:text-accent-foreground` (+ `dark:hover:bg-accent/50`).
- **`Button`** **`outline`**: `hover:bg-accent hover:text-accent-foreground`; dark variants use input surface (`dark:bg-input/30`, `dark:hover:bg-input/50`).
- **`Toggle`** **`outline`** and **`SelectItem`** focus follow **`src/app/components/ui/toggle.tsx`** and **`select.tsx`** — same lineage as upstream shadcn.

If product wants softer hovers later, tweak **`theme.css`** **`--accent` / `--accent-foreground`** (light `:root`) or introduce a distinct token. Do not one-off conflicting utilities without updating this doc.

---

## 4. Decorative UI

Dialog / panel icon tiles may use **`bg-primary/10 text-primary`** for a subtle brand badge.

**Archived layout:** Unused replace-background **`AlertDialog`** markup lives in **`src/app/components/patterns/ReplaceBackgroundConfirmDialog.tsx`** (not wired). Reuse when confirming destructive picks is needed again.
