---
name: render-deploy
description: Guidance and workflows for deploying fullstack applications to Render free tier, connecting GitHub repositories, and configuring Render MCP tools.
---

# Render Free Tier Deployment Guide

This skill provides step-by-step guidance on deploying the **love-connection** application from GitHub (`https://github.com/Aman0stack/love-connection`) to Render's Free Web Service tier.

---

## 🌟 Method 1: Instant Dashboard Blueprint (Recommended - 30 Seconds)

Render includes native GitHub integration that reads the included [render.yaml](../../../../../render.yaml) file automatically:

1. Open your [Render Dashboard](https://dashboard.render.com).
2. In the top right corner, click **New +** > **Blueprint**.
3. Under **Connect a repository**, choose **Aman0stack/love-connection**.
4. Render will read `render.yaml` and configure:
   - **Service Type:** Web Service
   - **Plan:** Free
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/api/health`
5. Fill in the required environment variables:
   - `MONGODB_URI`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
6. Click **Apply**.
7. Render will build and deploy your app with a public HTTPS URL (e.g. `https://love-connection.onrender.com`).

---

## 🤖 Method 2: Automated Deployment via Render MCP Server

The workspace includes a custom Model Context Protocol (MCP) server configured in `.agents/mcp_config.json`.

### How to Authenticate Render MCP:
1. Generate an API Key at [dashboard.render.com/u/settings#api-keys](https://dashboard.render.com/u/settings#api-keys).
2. Add your key to `.agents/mcp_config.json` under `env.RENDER_API_KEY`.
3. The following tools will become active:
   - `render_list_owners`: Retrieve your Render workspace ID.
   - `render_create_free_web_service`: Deploy `Aman0stack/love-connection` directly to the free tier.
   - `render_trigger_deploy`: Trigger deploys whenever new commits are pushed.
   - `render_get_service`: Check your live URL and service health.
