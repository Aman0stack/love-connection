# 💖 Will You Love Me Forever?

A fullstack romantic interactive proposal web application featuring responsive storytelling, photo memory vault (Cloudinary + MongoDB), audio backdrop, personalized shareable proposal links, QR code generator, and an interactive password-protected creator dashboard.

---

## 🚀 Quick Deployment to Render

This repository is pre-configured with **[render.yaml](./render.yaml)** for seamless 1-click Render Blueprint deployment.

### Option 1: Render Blueprint (Recommended)
1. Push this repository to **GitHub** or **GitLab**.
2. Go to your [Render Dashboard](https://dashboard.render.com).
3. Click **New +** > **Blueprint**.
4. Connect your repository. Render will automatically read `render.yaml`.
5. Enter your secret environment variables in the prompt:
   - `MONGODB_URI`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
6. Click **Apply**. Render will install, build Vite into `dist/`, and run `npm start`.

### Option 2: Manual Web Service on Render
If deploying without Blueprint:
1. Go to [Render Dashboard](https://dashboard.render.com) > **New +** > **Web Service**.
2. Connect your Git repository.
3. Configure service settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
4. Add the Environment Variables (see below).
5. Click **Deploy Web Service**.

---

## 🔑 Environment Variables

| Variable | Description | Required | Example / Default |
|---|---|---|---|
| `NODE_ENV` | Environment mode | Yes | `production` |
| `PORT` | Web server port (assigned by Render) | Auto | `10000` |
| `MONGODB_URI` | MongoDB Atlas connection string | Yes | `mongodb+srv://user:pass@cluster...` |
| `JWT_SECRET` | Secret token for authentication | Yes | 32+ character random string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud identifier | Yes | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | Yes | `1234567890` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | Yes | `abc123xyz` |
| `ADMIN_USERNAME` | Default admin username | Optional | `love` |
| `ADMIN_PASSWORD` | Default admin password | Optional | `forever` |

> ⚠️ **Important for MongoDB Atlas:** Ensure your MongoDB Network Access IP Whitelist has `0.0.0.0/0` (Allow Access from Anywhere) enabled so Render's cloud servers can connect to your database.

---

## 💻 Local Development

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd "love by"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Run concurrent development mode (Express on port 5000 + Vite on port 3000):
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Build & Verification

- **Frontend build**: `npm run build` (outputs optimized bundle to `dist/`)
- **Production start**: `npm start` (launches Express serving `dist/` and API endpoints)
