# Jan Sathi Production Deployment

## 1. MongoDB Atlas

1. Create an Atlas project and cluster.
2. Create a database user with a strong password.
3. Add the deployment provider IP access rule. For initial Render testing, use `0.0.0.0/0`, then restrict it when a fixed egress IP is available.
4. Copy the SRV connection string and replace the username and password.

## 2. Render backend

Create a Web Service from this repository. The included `render.yaml` can be used as a Blueprint, or configure these values manually:

- Build command: `cd backend && npm install`
- Start command: `cd backend && npm start`
- Health check path: `/health`

Set these environment variables in Render:

- `PORT=10000`
- `MONGODB_URI=<MongoDB Atlas SRV connection string>`
- `ALLOWED_ORIGINS=https://<your-vercel-domain>`
- `ANTHROPIC_API_KEY=<key>`
- `ANTHROPIC_MODEL=claude-sonnet-4-6`
- `ADMIN_PIN=<strong unique PIN>`
- `RESEND_API_KEY=<key>`

Verify the backend at `https://<your-render-domain>/health` before configuring the frontend.

## 3. Resend

Create a Resend API key and verify the sending domain. Add `RESEND_API_KEY` to Render. Email-based password reset delivery must be wired to the auth route before enabling password-reset emails in production.

## 4. Vercel frontend

Create a Vercel project from this repository. The included `vercel.json` uses `frontend` as the build project.

Set this Vercel environment variable for Production, Preview, and Development:

- `VITE_API_URL=https://<your-render-domain>`

Deploy with the Vercel build. Open the deployed site and verify signup, login, language switching, feature loading, orders, expenses, and admin access.

## 5. Final checks

- Keep `.env` files out of git.
- Confirm `/health` reports `database: connected`.
- Confirm the frontend has no localhost API URL in its production build.
- Rotate any key that was exposed during development.
- Replace demo fallback data and demo-only flows before announcing launch.
