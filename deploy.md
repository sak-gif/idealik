# Deploying IDEALIK on Render + Aiven

This guide explains how to deploy the IDEALIK platform (Next.js frontend + Spring Boot backend) using **Render** for hosting and **Aiven** for MySQL.

## Prerequisites

1. Your code is pushed to GitHub (`https://github.com/sak-gif/idealik`).
2. A [Render](https://render.com/) account.
3. An [Aiven](https://aiven.io/) account with a MySQL service already created.
4. Your Firebase project credentials.

---

## Part 1 — Deploy the Backend

1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **"New"** → **"Web Service"**.
3. Connect your GitHub account (if not already connected) and select the **`idealik`** repository.
4. Configure the service:

| Setting | Value |
|---|---|
| **Name** | `idealik-backend` |
| **Root Directory** | `backend` |
| **Environment** | `Docker` |

5. Scroll down to **"Environment Variables"** and add:

| Variable | Value |
|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://<YOUR_AIVEN_HOST>:<PORT>/defaultdb?useSSL=true&requireSSL=true&serverTimezone=UTC` |
| `SPRING_DATASOURCE_USERNAME` | *(Your Aiven username)* |
| `SPRING_DATASOURCE_PASSWORD` | *(Your Aiven password)* |
| `FRONTEND_URL` | *(leave empty for now — you'll fill this after creating the frontend)* |

6. Click **"Create Web Service"**.
7. Wait for the build to finish. Once live, copy the backend URL (e.g., `https://idealik-backend-xxxx.onrender.com`).

---

## Part 2 — Deploy the Frontend

1. Go back to the Render Dashboard.
2. Click **"New"** → **"Web Service"**.
3. Select the same **`idealik`** repository.
4. Configure the service:

| Setting | Value |
|---|---|
| **Name** | `idealik-frontend` |
| **Root Directory** | `app` |
| **Environment** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |

5. Scroll down to **"Environment Variables"** and add:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | The backend URL from Part 1 (e.g., `https://idealik-backend-xxxx.onrender.com`) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Your Firebase API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Your Firebase Auth Domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Your Firebase Project ID |

6. Click **"Create Web Service"**.
7. Once live, copy the frontend URL (e.g., `https://idealik-frontend-xxxx.onrender.com`).

---

## Part 3 — Link Backend to Frontend

Now go back and update the backend's `FRONTEND_URL` variable:

1. Go to Render Dashboard → click **`idealik-backend`**.
2. Click the **"Environment"** tab.
3. Set `FRONTEND_URL` to your frontend URL (e.g., `https://idealik-frontend-xxxx.onrender.com`).
4. Click **"Save Changes"** — the backend will automatically redeploy.

---

## Part 4 — Verify

1. Check the **Logs** tab for `idealik-backend` — Spring Boot should connect to Aiven MySQL.
2. Check the **Logs** tab for `idealik-frontend` — Next.js should build and start.
3. Open your frontend URL to see your live IDEALIK platform! 🎉

---

## Future Deployments

Any push to the `main` branch on GitHub will automatically trigger Render to rebuild and redeploy both services.
