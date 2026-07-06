# Deploying IDEALIK on Railway

This guide explains how to deploy the IDEALIK platform (both the Next.js Frontend and the Spring Boot Backend) on Railway.

## Prerequisites

1. Your code must be pushed to your GitHub repository (`https://github.com/sak-gif/idealik`).
2. You need an account on [Railway](https://railway.app/).
3. You need your Firebase project credentials.

---

## Step-by-Step Deployment

### Step 1: Create a New Project & Provision MySQL
1. Log in to [Railway](https://railway.app/).
2. Click the **"New Project"** button in the top right corner.
3. Select **"Provision MySQL"** to add a database service to your project first. 
   *(Railway will create a service called `MySQL` and populate variables like `MYSQL_URL`, `MYSQLUSER`, and `MYSQLPASSWORD` automatically.)*

---

### Step 2: Deploy the Backend (`idealik-backend`)
1. In your project canvas, click **"New"** (or press `Cmd/Ctrl + K` -> **"New Service"**).
2. Choose **"GitHub Repo"** and select your `idealik` repository.
3. Once the service box appears on the canvas, click on it to open the settings panel.
4. Rename the service to `idealik-backend` in the settings panel (top of the panel).
5. Go to the **"Settings"** tab, scroll down to **"General"**, and locate **"Root Directory"**. Set it to:
   `/backend`
   *(Railway will automatically detect the `Dockerfile` inside the `/backend` directory and use it to build your Spring Boot app.)*
6. Go to the **"Variables"** tab and add the following variables. Use Railway's reference syntax to link to the MySQL database:
   - `SPRING_DATASOURCE_URL` ➔ `${{MySQL.MYSQL_URL}}`
   - `SPRING_DATASOURCE_USERNAME` ➔ `${{MySQL.MYSQLUSER}}`
   - `SPRING_DATASOURCE_PASSWORD` ➔ `${{MySQL.MYSQLPASSWORD}}`
   - `FRONTEND_URL` ➔ `https://${{idealik-frontend.RAILWAY_PUBLIC_DOMAIN}}`
7. Go back to the **"Settings"** tab, scroll down to **"Networking"**, and click **"Generate Domain"** to get a public URL for your backend.

---

### Step 3: Deploy the Frontend (`idealik-frontend`)
1. Click **"New"** on your project canvas again.
2. Select **"GitHub Repo"** and select the same `idealik` repository.
3. Click on the new service and rename it to `idealik-frontend`.
4. Go to the **"Settings"** tab, scroll down to **"General"**, and set the **"Root Directory"** to:
   `/app`
   *(Railway will detect the Next.js project and automatically configure the node build command.)*
5. Go to the **"Variables"** tab and add the following environment variables:
   - `NEXT_PUBLIC_API_URL` ➔ `https://${{idealik-backend.RAILWAY_PUBLIC_DOMAIN}}`
   - `NEXT_PUBLIC_FIREBASE_API_KEY` ➔ *(Your Firebase API Key)*
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` ➔ *(Your Firebase Auth Domain)*
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID` ➔ *(Your Firebase Project ID)*
6. Go back to the **"Settings"** tab, scroll down to **"Networking"**, and click **"Generate Domain"** to generate the public URL for your user interface.

---

### Step 4: Redeploy Services
After you have filled in all the environment variables (especially the Firebase variables on the frontend and the database references on the backend):
1. Click on the `idealik-backend` service ➔ **"Deployments"** ➔ click the **"Redeploy"** button (or three dots next to the active deployment).
2. Click on the `idealik-frontend` service ➔ **"Deployments"** ➔ click the **"Redeploy"** button.

---

### Step 5: Verify and Launch
1. Check the logs for `idealik-backend` to ensure Spring Boot starts up correctly and establishes a connection with MySQL.
2. Check the logs for `idealik-frontend` to make sure Next.js builds and runs successfully.
3. Click the generated public URL of your `idealik-frontend` service to open your fully deployed IDEALIK platform!
