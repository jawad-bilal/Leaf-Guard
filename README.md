# Potato Disease Classifier — Frontend (Vercel)

React + Vite UI for LeafGuard.

## Local run

```bash
cd frontend
npm install
# optional: create .env.local with VITE_API_URL=http://127.0.0.1:8000
npm run dev
```

Without `VITE_API_URL`, the Vite proxy forwards `/predict` and `/health` to `http://127.0.0.1:8000`.

## Deploy on Vercel (this folder = repo root)

1. Push **only this `frontend` folder** as its own GitHub repo.
2. Vercel → Add New Project → import that repo.
3. Framework preset: **Vite**. Build command: `npm run build`. Output: `dist`.
4. Add env var:
   - `VITE_API_URL` = `https://your-backend.vercel.app` (no trailing slash)
5. Deploy.

Then put this frontend URL into the backend’s `FRONTEND_ORIGIN` env var and redeploy the API.
