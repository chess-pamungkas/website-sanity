# Oqtima website (COM)

Gatsby frontend for [oqtima.com](https://oqtima.com). All builds use **FSA** (`GATSBY_ENTITY=FSA`). The legacy EU LP / CYSEC env file (`.env_prod_eu_lp`) was removed; it was not wired to any deploy workflow.

## 1. Local development

1. Copy `.env.example` to `.env.development` (Gatsby loads it for `gatsby develop`).
2. Defaults match dev: API `https://dev-back.oqt-ima.com/` (do not use raw ALB URLs in env files).
3. Default site URL: `http://localhost:8000`

## 2. Environment files (CI / manual deploy)

| File | Use |
|------|-----|
| `.env.example` | Template for local dev; not used in CI |
| `.env_dev_com` | Dev (`dev.oqt-ima.com`) |
| `.env_staging_com` | Staging (`test.oqt-ima.com`) |
| `.env_prod_com` | Production (`oqtima.com`) |
| `.env_prod_com_lp` | Production LP (`lp.oqtima.com`) |

Set `GATSBY_OQTIMA_API_URL` per environment (dev/staging/prod backends). Workflows copy the matching file to `.env.production` before `npm run build`.

## 3. Deployment

GitHub Actions workflows under `.github/workflows/` deploy to S3. See workflow env inputs for bucket and domain mapping.
