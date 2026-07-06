# Deploying IDEALIK on Render

This guide explains how to deploy the IDEALIK platform (both the Next.js Frontend and the Spring Boot Backend) using Render's Infrastructure as Code (Blueprint) feature.

## Prerequisites

1. Your code must be pushed to your GitHub repository (`https://github.com/sak-gif/idealik`). *Note: I see you are currently forcing the push! Once that finishes, you're ready for this step.*
2. You need an account on [Render](https://render.com/).
3. You need a MySQL database (you can host this on Render, Aiven, PlanetScale, Railway, or AWS RDS).
4. You need your Firebase project credentials.

## Step-by-Step Deployment

### 1. Create a Blueprint Instance
Because we have configured a `render.yaml` file, Render can automatically set up the services and link them together.

1. Log in to your Render dashboard.
2. Click the **"New"** button in the top right corner.
3. Select **"Blueprint"** from the dropdown menu.
4. Connect your GitHub account (if you haven't already).
5. Select the `idealik` repository from your list of repositories.

### 2. Configure the Blueprint
Render will parse your `render.yaml` and show you the resources it is about to create:
- **idealik-frontend** (Next.js Web Service)
- **idealik-backend** (Spring Boot Docker Web Service)

Click **"Apply"** or **"Create Blueprint"** to begin the initial provisioning.

### 3. Set up Environment Variables
Because certain secrets shouldn't be hardcoded or synced to GitHub, they are marked as `sync: false` in the `render.yaml`. The deployment will initially fail or remain pending until you provide these variables.

1. Go to your Render Dashboard.
2. You will see both `idealik-frontend` and `idealik-backend` services.

#### For the Frontend (`idealik-frontend`):
1. Click on `idealik-frontend`.
2. Go to the **"Environment"** tab in the sidebar.
3. Add the following variables (matching your `.env.local` values):
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   *(Render will automatically map `NEXT_PUBLIC_API_URL` to your backend's URL!)*

#### For the Backend (`idealik-backend`):
1. Go back to the dashboard and click on `idealik-backend`.
2. Go to the **"Environment"** tab.
3. Add your production MySQL database credentials:
   - `SPRING_DATASOURCE_URL` (e.g., `jdbc:mysql://<host>:<port>/<dbname>?useSSL=false&serverTimezone=UTC`)
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
   *(Render will automatically map `FRONTEND_URL` to your frontend's URL!)*

### 4. Trigger Manual Deploys
After saving the environment variables for both services, you need to manually trigger a fresh deploy so they can pick up the new variables.

1. In the `idealik-backend` service page, click the **"Manual Deploy"** button -> **"Deploy latest commit"**.
2. Do the same for the `idealik-frontend` service.

### 5. Monitor and Verify
- You can watch the "Logs" tab for both services to ensure they build and start up successfully.
- Once both are marked as **"Live"**, you can click the generated Render URL on the `idealik-frontend` service to visit your deployed application!

---

### Future Deployments
Since your repository is linked, any future pushes to the `main` branch on GitHub will automatically trigger Render to rebuild and deploy the latest version of your frontend and backend.
