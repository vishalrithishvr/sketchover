# Sketchover API

Express, served two ways:

- **Live** — as a Netlify Function on the `sketchover-admin` site, under `/api`.
  Data lives in **Netlify Blobs**, which the site has for free: no database
  account, no connection string, nothing on a laptop that has to stay switched
  on. The admin panel is the same site, so it talks to the API on its own
  domain.
- **On a machine** — `npm start` runs the same app on port 4000 and keeps its
  data in `backend/.data/` as JSON files.

## What lives where

| Path | What it does |
| --- | --- |
| `/api/product/list` | the catalogue the storefront reads |
| `/api/product/add` · `/update` · `/stock` · `/remove` | admin catalogue and stock control |
| `/api/order/place` | the storefront books an order when a shopper confirms |
| `/api/order/list` · `/status` · `/track` | admin order desk, and customer tracking by reference |
| `/api/media/public` · `/file/:id` | videos and images for the storefront, with range support |
| `/api/media/upload` · `/update` · `/remove` | the admin media library |
| `/api/admin/dashboard` | revenue, order counts, best sellers, low stock |
| `/api/admin/settings` | marquee and ribbon wording, WhatsApp number, delivery promise |
| `/api/admin/coupon/*` | discount codes, and the check the cart runs |
| `/health` | says which storage it is on and how many posters it holds |

Admin routes expect the token from `POST /api/user/admin` in a `token` header.
The token carries a role claim, never the password, and expires after 7 days.

## Settings

The admin login and the signing secret come from environment variables:

| Variable | Live (Netlify site settings) | On a machine (`backend/.env`) |
| --- | --- | --- |
| `ADMIN_EMAIL` | the admin username | same |
| `ADMIN_PASSWORD` | stored as a secret | same |
| `JWT_SECRET` | stored as a secret | any long random string |

To change the admin password: Netlify → sketchover-admin → Site configuration →
Environment variables → `ADMIN_PASSWORD`, then trigger a deploy.

## Filling the shop

`scripts/seed.js` reads the storefront's own catalogue file and loads every
poster, pictures included, into whichever API you point it at:

```bash
cd backend
API=https://sketchover-admin.netlify.app npm run seed   # the live shop
API=http://localhost:4000 npm run seed                  # a local one
```

Posters already there are left alone; add `-- --replace` to overwrite.

## Limits worth knowing

- **Uploads are capped at about 6 MB** per request — Netlify's limit for a
  function. Poster images are far below that. For a long review video, upload
  it to YouTube and paste the link into the media library instead; it plays in
  place on the site.
- Each collection is one JSON document. That is plenty for a studio's
  catalogue and thousands of orders; if the shop outgrows it, the storage layer
  in `lib/db.js` is the one file to swap for a database.
