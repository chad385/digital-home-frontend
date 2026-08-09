# Changes From Stock

Tracks every deviation from the upstream template (`upstream` remote:
https://github.com/lukesbrave/digital-home-frontend) so upstream updates can
be pulled in cleanly later. No branding, styling, or content-corpus changes
belong in this repo — see the standing prompt in the root runbook.

## wrangler.jsonc

- `vars.SUPABASE_URL` and `vars.SUPABASE_ANON_KEY` replaced with this
  project's real Supabase project URL / publishable key (was the stock
  `your-project.supabase.co` / `your-anon-key` placeholders). Project-specific
  — every clone must set its own.

## .env.local (gitignored, not committed)

- Created from `.env.local.example`. Filled with this project's Supabase
  URL/anon/service_role keys, a generated `API_SECRET_KEY`, and Resend keys.
  Site identity fields (`NEXT_PUBLIC_SITE_NAME`, blog label/title/description)
  left as stock placeholders — no branding applied yet.

## Cloudflare Worker secrets (not in repo)

Set via `wrangler secret put`: `SUPABASE_SERVICE_ROLE_KEY`, `API_SECRET_KEY`,
`RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET` (placeholder value — real Resend
webhook not yet configured, pending domain verification).

## Theming mechanism (template upgrade, still generic)

Wired `design-system/tokens.json` as the single source of truth for color
and typography — previously it existed but was disconnected; `globals.css`
hardcoded its own `:root` values that had already drifted from it (different
accent color, light-mode surface values on a dark site). Mechanism only,
committed `tokens.json` values are unchanged in spirit from stock (same dark
neutral scale, same accent blue) — no brand applied.

- **`src/lib/theme/tokens.ts`** (new) — reads `tokens.json`, exports
  `buildRootCssVariables()` (renders tokens into CSS custom properties) and
  `googleFontsHref()` (builds a Google Fonts URL from whatever family names
  are set in `typography.fontFamily` — swapping a font is now a `tokens.json`
  edit, not a code change).
- **`src/app/layout.tsx`** — removed the `next/font` Geist/Geist Mono
  imports (which were hardcoded regardless of `tokens.json`) and now injects
  the token CSS variables via a server-rendered `<style>` tag, plus a
  `<link>` to the token-driven Google Fonts URL. **Visual side effect:** the
  live font changes from Geist to Inter, since `tokens.json` had always
  declared Inter/JetBrains Mono as the intended stock font — this makes that
  pre-existing declaration real instead of dead documentation. Trade-off:
  loses `next/font`'s build-time self-hosting/optimization in exchange for
  the font genuinely being config-driven at runtime (required for Part 2 —
  an instance needs to set Bricolage Grotesque etc. by editing `tokens.json`
  alone).
- **`src/app/globals.css`** — removed the hardcoded `:root` values (now
  injected). Added `--color-white: var(--neutral-50)` and
  `--color-black: var(--neutral-950)` inside the existing `@theme inline`
  block, rebinding Tailwind's built-in `white`/`black` utilities to the
  neutral scale. This is why `text-white`, `bg-black`, `border-white/10` etc.
  across every page/component are now token-driven with **zero per-usage
  rewrites** — editing `tokens.json`'s `neutral.50`/`neutral.950` propagates
  everywhere those utilities are used.
- **`design-system/tokens.json`** — fixed `colors.surface.*` to the actual
  dark values already live on the site (was light-mode placeholder values,
  disconnected/unused). Fixed `colors.brand.accent` to match the blue already
  live in `.article-body blockquote` (was a different, unused pink).
- **`src/app/blog/page.tsx`**, **`src/app/blog/[slug]/page.tsx`** — the only
  color usages that didn't use the `white`/`black` keyword (raw
  `rgba(255,255,255,X)` inside arbitrary-value gradient classes) converted to
  `color-mix(in srgb, var(--neutral-50) X%, transparent)` so they're
  token-driven too.
- **Pass condition verified live:** changed `tokens.json`'s `neutral.50` to
  a test color, confirmed it propagated across headings, pills, borders, and
  buttons with no stragglers, then reverted.

**Flagged, not touched — resisted this pass:**
- `src/app/blog/blog.module.css` and `src/app/blog/[slug]/article.module.css`
  are **dead code** (not imported by any live component) but contain real
  hardcoded branding: a font named `'TXC Pearl'` (not a Google Font — likely
  licensed/purchased) and a specific accent blue `#BBDCEF`. Since they don't
  affect the live site, left as-is rather than guessing at deletion — worth a
  decision on whether to delete them, since an unused file with someone
  else's baked-in branding sitting in an open-source "neutral" template is
  exactly the kind of thing this exercise is trying to eliminate.
- Spacing and border-radius are **not** rewired to `tokens.json`'s
  `spacing`/`borderRadius` scales — components still use Tailwind's standard
  spacing scale and arbitrary radius values (`rounded-[1.5rem]` etc.).
  Judgment call: spacing/radii aren't brand-differentiating the way
  color/typography are, and a full mechanical rewrite of every `px-6`/`gap-4`
  across every file would be large, low-value churn. The token values exist
  in `tokens.json` and are exposed as CSS variables
  (`--radius-token-sm..3xl`) for future use if this changes.

## No other changes

No content-corpus files have been modified, and no brand colors/fonts/copy
were applied — the site still renders on a stock, generic theme (Inter font,
black/white neutral palette, blue accent). Only the *mechanism* by which that
theme is expressed changed, per the standing prompt: mechanism belongs in
the template, brand values belong on an instance.

## Base upgrade (generic mechanism)
- **Text/border CSS variables** (`src/lib/theme/tokens.ts`) —
  `buildRootCssVariables()` now also emits `--text-primary/muted/faint/accent`
  and `--border-hairline/accent-soft` when a `tokens.json` defines `colors.text`
  / `colors.border`, with neutral fallbacks otherwise (guarded, so the stock
  tokens still build). Lets an instance drive text + hairline colors from tokens.
