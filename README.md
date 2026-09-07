## kyranjamie.com

Source code for the personal website of Kyran Jamie

## Development

Use Node.js 24 and the pnpm version pinned in `package.json`.

```sh
pnpm install
pnpm dev
```

`pnpm preview:worker` builds the site and serves it in Cloudflare's local runtime.
`pnpm preview` uses Astro's preview server instead.

## Deployment

The Astro build is deployed as Cloudflare Workers Static Assets using Wrangler.
The default configuration deploys a separate `kyranjamie-com-preview` Worker on
`workers.dev`. The production environment deploys `kyranjamie-com` on
`https://kyranjamie.com`, with its `workers.dev` and version preview URLs disabled.
`www.kyranjamie.com` redirects to the canonical domain, preserving the path.

```sh
# Open the printed login URL manually in your preferred browser.
pnpm exec wrangler login --browser=false

# Deploy and check the separate preview before switching production traffic.
pnpm deploy:preview

# Attach the production domain and deploy the site.
pnpm deploy
```

The production command can change the domain's hosting configuration. During the
initial migration, record the existing GitHub Pages DNS records before running it.
Resolve any conflicting records at the cutover, preserving mail and unrelated DNS
records. Keep the existing Pages deployment available until the production Worker
has been checked.

Public DNS observed before migration (2026-09-07): apex A records
`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, and
`www` CNAME `kyranjamie.github.io`. Confirm their current TTL and proxy settings in
Cloudflare before changing them. The existing `www` CNAME must be removed at
cutover before a Worker Custom Domain can be attached to that hostname.

### GitHub Actions

Pull requests build the site and validate the production Wrangler configuration
without deploying. Pushes to `main` and manual runs on `main` also deploy.
Configure these under repository Settings > Secrets and variables > Actions:

- Variable `CLOUDFLARE_ACCOUNT_ID`: the account containing the domain and Worker.
- Secret `CLOUDFLARE_API_TOKEN`: a token scoped to that account with Workers Scripts
  Edit, and to the `kyranjamie.com` zone with Workers Routes Edit and Zone Read.
  Use the Cloudflare "Edit Cloudflare Workers" token template as a starting point.

After verifying Cloudflare serves the domain, unpublish the site and disable GitHub
Pages in repository Settings > Pages. Removing the workflow and `static/CNAME`
alone does not disable the existing published site. Verify one deployment from
GitHub Actions after configuring the credentials and pushing the changes.

### Verification and rollback

Check `/`, the font and CSS URLs in its HTML, `/favicon.png`, `/pgp.asc`,
`/index.html.md`, and `/llms.txt`. Unknown paths must return 404, and `/CNAME` must
no longer be served. Repeat these checks on the preview and production URLs.

```sh
pnpm build
pnpm exec wrangler deploy --env production --dry-run
pnpm exec wrangler deployments list --env production
# Roll back to a known-good deployed version (interactive selection).
pnpm exec wrangler rollback --env production
```

Wrangler rollback requires an earlier deployment and does not restore DNS. During
the initial cutover, rollback means removing the Worker Custom Domain and restoring
the recorded Pages DNS records while Pages is still published. After Pages is
disabled, restore the old Pages workflow and CNAME from git, re-enable Pages, and
verify that deployment before reverting DNS.

### Traffic controls and future forms

Response headers live in `static/_headers`; redirects live in
`static/_redirects`. Cloudflare zone rules can control traffic at the domain.
There is currently no application Worker script or form endpoint.

To add a form later, add a Worker entrypoint and an `ASSETS` binding in Wrangler,
route `/api/*` through it with `assets.run_worker_first`, and handle submissions
there. Keep other requests served as static assets. Store API keys as Wrangler
secrets, validate submissions on the server, and verify any Turnstile token before
processing the message. Worker invocations and external services have separate
usage limits from static assets.
