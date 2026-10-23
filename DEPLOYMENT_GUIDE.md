# ChronoOS Deployment & Production Architecture Guide

This guide details how to deploy ChronoOS with high availability and zero cost using Render, Vercel, and UptimeRobot, powered by Amazon Bedrock.

---

## 1. Architecture Overview

ChronoOS is designed with a decoupled, high-performance architecture:
* **Backend Gateway (Render)**: FastAPI + Uvicorn server running the Model Context Protocol (MCP) Streamable HTTP / SSE endpoints, multi-turn Amazon Bedrock reasoning loop, and mock executive data stores.
* **Frontend UI (Render or Vercel)**: Kinetic Typography splash screen, Raycast-inspired Executive Command Palette, Echo Show 15 Multimodal Smart Display Simulator, and 60FPS audio visualizer.
* **Ambient Keep-Alive (UptimeRobot)**: Automated 5-minute health check pings targeting `/api/health` to prevent Render free-tier instances from spinning down or experiencing cold starts.
* **AI Reasoning Core (Amazon Bedrock)**: Anthropic Claude 3.5 Sonnet v2 (`anthropic.claude-3-5-sonnet-20241022-v2:0`) and Amazon Nova Pro (`amazon.nova-pro-v1:0`) in `us-east-1`.

---

## 2. Deploying on Render (Backend & Fullstack)

Render provides native Python hosting with automatic GitHub deployments.

### Step-by-Step Deployment:
1. Sign in to [Render](https://render.com) using your GitHub account.
2. Click **New +** -> **Web Service**.
3. Select **Build and deploy from a Git repository** and connect `Adhyayan-Dimri/ChronoOS`.
4. Configure the service settings:
   * **Name**: `chronoos-api`
   * **Region**: `Oregon (US West)` or `Ohio (US East)`
   * **Branch**: `main`
   * **Runtime**: `Python 3`
   * **Build Command**: `pip install -upgrade pip && pip install -r requirements.txt`
   * **Start Command**: `uvicorn backend.api_gateway:app --host 0.0.0.0 --port $PORT`
   * **Instance Type**: `Free`
5. Add Environment Variables under **Advanced**:
   * `AWS_ACCESS_KEY_ID`: `[Your AWS Access Key]`
   * `AWS_SECRET_ACCESS_KEY`: `[Your AWS Secret Key]`
   * `AWS_DEFAULT_REGION`: `us-east-1`
   * `AWS_REGION`: `us-east-1`
   * `BEDROCK_MODEL_ID`: `anthropic.claude-3-5-sonnet-20241022-v2:0`
   * `PYTHON_VERSION`: `3.11.9`
6. Click **Create Web Service**.
7. Once deployed, note your service URL: `https://chronoos-api.onrender.com`.
   * Verify by visiting `https://chronoos-api.onrender.com/api/health` in your browser.
   * Expected response: `{"status":"HEALTHY","service":"ChronoOS","version":"1.0.0"}`.

*Note: You can also deploy automatically using Render Blueprints via the included `render.yaml` file.*

---

## 3. Deploying on Vercel (Frontend Edge CDN)

If you wish to serve the frontend from Vercel's global edge network while routing API requests to Render:

### Step-by-Step Deployment:
1. Sign in to [Vercel](https://vercel.com) with GitHub.
2. Click **Add New...** -> **Project**.
3. Select `Adhyayan-Dimri/ChronoOS`.
4. In Project Settings:
   * **Framework Preset**: `Other`
   * **Root Directory**: `./`
5. Open `vercel.json` (already configured in the repository) and update the rewrite destination with your Render URL if different:
   ```json
   {
     "source": "/api/:path*",
     "destination": "https://<your-render-app-name>.onrender.com/api/:path*"
   }
   ```
6. Click **Deploy**.
7. Vercel will deploy your frontend to `https://chronoos.vercel.app`.

---

## 4. 24/7 Keep-Alive with UptimeRobot

Render's free tier spins down web services after 15 minutes of inactivity. Setting up UptimeRobot sends automated HTTP heartbeat requests every 5 minutes to keep your ChronoOS instance pre-warmed 24/7 with zero latency.

### Step-by-Step Setup:
1. Sign up for a free account at [UptimeRobot](https://uptimerobot.com).
2. Click **Add New Monitor**.
3. Configure the monitor:
   * **Monitor Type**: `HTTP(s)`
   * **Friendly Name**: `ChronoOS Production Gateway`
   * **URL (or IP)**: `https://<your-render-service>.onrender.com/api/health`
   * **Monitoring Interval**: `Every 5 minutes`
   * **Monitor Timeout**: `30 seconds`
4. Click **Create Monitor**.
5. UptimeRobot will now ping `/api/health` around the clock, guaranteeing 100% uptime for hackathon judges and evaluators.

---

## 5. Production Health Verification Checklist

Before submitting your hackathon link, verify all endpoints:
* `/api/health` -> HTTP 200 `{"status":"HEALTHY",...}`
* `/api/status` -> HTTP 200 with registered MCP tools and Bedrock model details
* `/api/chat` -> POST with `{"query": "Give me my executive briefing"}` returns structured JSON payload
* `/mcp` -> POST with standard JSON-RPC 2.0 `tools/list`
