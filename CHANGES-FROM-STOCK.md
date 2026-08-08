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

## No other changes

No components, pages, design-system tokens, or content-corpus files have
been modified. The site still renders on the stock theme.
