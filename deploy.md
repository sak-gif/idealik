# Deploying IDEALIK on Render + Aiven

This guide explains how to deploy the IDEALIK platform (Next.js frontend + Spring Boot backend) using **Render** for hosting and **Aiven** for MySQL.

## Prerequisites

1. Your code is pushed to GitHub (`https://github.com/sak-gif/idealik`).
2. A [Render](https://render.com/) account.
3. An [Aiven](https://aiven.io/) account (free tier available).
4. Your Firebase project credentials.

---

## Part 1 — Create a MySQL Database on Aiven

1. Log in to [Aiven Console](https://console.aiven.io/).
2. Click **"Create service"**.
3. Select **MySQL** as the service type.
4. Choose the **Free** plan (or Hobbyist if you need more resources).
5. Pick a cloud region close to your Render region (e.g., `google-europe-west1` or `aws-eu-west-1`).
6. Click **"Create free service"**.
7. Once the service is running, go to the **"Overview"** tab. You will see connection details:
   - **Host** (e.g., `mysql-xxxx.aiven.io`)
   - **Port** (e.g., `12345`)
   - **User** (e.g., `avnadmin`)
   - **Password** (auto-generated)
   - **Database name** (default: `defaultdb`)
8. Build the JDBC URL from these values:
   ```
   jdbc:mysql://<host>:<port>/<database>?useSSL=true&requireSSL=true&serverTimezone=UTC
   ```
   Example:
   ```
   jdbc:mysql://mysql-xxxxx.aiven.io:12345/defaultdb?useSSL=true&requireSSL=true&serverTimezone=UTC
   ```

> **Keep these credentials handy — you will paste them into Render in Step 3.**

---

## Part 2 — Deploy to Render via Blueprint

Because your repository has a `render.yaml` file, Render can auto-create both services.

1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **"New"** → **"Blueprint"**.
3. Connect your GitHub account (if not already connected).
4. Select the **`idealik`** repository.
5. Render will detect the `render.yaml` and show two services:
   - `idealik-frontend` (Node / Next.js)
   - `idealik-backend` (Docker / Spring Boot)
6. Click **"Apply"** to create both services.

> The first deploy will fail because the environment variables are not set yet. That's normal.

---

## Part 3 — Set Environment Variables

### Backend (`idealik-backend`)

1. Go to your Render Dashboard → click on **`idealik-backend`**.
2. Click the **"Environment"** tab.
3. Add these variables using your Aiven credentials from Part 1:

| Variable | Value |
|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://<host>:<port>/<database>?useSSL=true&requireSSL=true&serverTimezone=UTC` |
| `SPRING_DATASOURCE_USERNAME` | `avnadmin` (or your Aiven user) |
| `SPRING_DATASOURCE_PASSWORD` | Your Aiven password |

> `FRONTEND_URL` is automatically set by `render.yaml` — no action needed.

4. Click **"Save Changes"**.

### Frontend (`idealik-frontend`)

1. Go to your Render Dashboard → click on **`idealik-frontend`**.
2. Click the **"Environment"** tab.
3. Add these variables:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Your Firebase API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Your Firebase Auth Domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Your Firebase Project ID |

> `NEXT_PUBLIC_API_URL` is automatically set by `render.yaml` — no action needed.

4. Click **"Save Changes"**.

---

## Part 4 — Trigger Redeploy

1. Go to **`idealik-backend`** → click **"Manual Deploy"** → **"Deploy latest commit"**.
2. Go to **`idealik-frontend`** → click **"Manual Deploy"** → **"Deploy latest commit"**.

---

## Part 5 — Verify

1. Check the **Logs** tab for `idealik-backend` — you should see Spring Boot starting and connecting to MySQL.
2. Check the **Logs** tab for `idealik-frontend` — you should see Next.js building and starting.
3. Click the public URL on `idealik-frontend` to open your live IDEALIK platform! 🎉

---

## Future Deployments

Any push to the `main` branch on GitHub will automatically trigger Render to rebuild and redeploy both services.
