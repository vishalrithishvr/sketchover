# Sketchover API

Express + MongoDB. Serves the storefront, backs the admin panel, and stores the
pictures and videos itself.

## What lives where

| Path | What it does |
| --- | --- |
| `/api/product/list` | the catalogue the storefront reads |
| `/api/product/add` · `/update` · `/stock` · `/remove` | admin catalogue and stock control |
| `/api/order/place` | the storefront books an order when a shopper confirms |
| `/api/order/list` · `/status` · `/track` | admin order desk, and customer tracking by reference |
| `/api/media/public` · `/file/:id` | videos and images for the storefront, streamed with range support |
| `/api/media/upload` · `/update` · `/remove` | the admin media library |
| `/api/admin/dashboard` | revenue, order counts, best sellers, low stock |
| `/api/admin/settings` | marquee and ribbon wording, WhatsApp number, delivery promise |
| `/api/admin/coupon/*` | discount codes, and the check the cart runs |
| `/health` | says whether the database is actually connected |

Admin routes expect the admin token in a `token` header. `POST /api/user/admin`
with the email and password from `.env` returns one.

## Running it

```bash
cd backend
cp .env.example .env        # then fill in MONGODB_URI and the admin login
npm install
npm run seed                # imports the storefront catalogue into MongoDB
npm run server              # http://localhost:4000
```

`npm run seed` reads `frontend/src/assets/assets.js`, uploads every poster image
into the database and creates the products with stock. Run it once on a fresh
database. `npm run seed -- --force` wipes the products and starts over.

### Without a MongoDB to hand

`npm run dev:db` starts a throwaway MongoDB on port 27018 and prints a URI to
paste into `.env`. It is for working on the machine only — never for real orders.

## Media

Uploads go into MongoDB's own GridFS rather than a third-party bucket, so one
connection string is the only thing a deploy depends on, and videos survive
redeploys on hosts with no persistent disk. Files stream with `Accept-Ranges`,
so a long review video can be scrubbed.

Limit is 200 MB per file. Anything much larger belongs on YouTube — paste the
link into the media library instead of uploading.

## Deploying

Any Node host works (Render, Railway, Fly, a VPS). Set the same environment
variables there, point `VITE_BACKEND_URL` in `frontend/.env` and `admin/.env` at
the deployed URL, and redeploy both front ends.

`vercel.json` is left over from the template and is only relevant if you deploy
to Vercel.
