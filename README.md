# 🚀 Social Scheduler

**Social Scheduler** is a modern, AI-powered social media management and scheduling platform designed to help creators, marketers, and businesses automate their entire social media workflow—from content creation to cross-platform publishing.

---

## 🌟 Key Features

- 🤖 **AI Content Generation**: Automatic writing of captions, copy, and hashtag recommendations tailored to your brand's tone of voice.
- 🎨 **AI Image Generation**: High-quality visual generation directly from descriptive AI prompts.
- 🗓️ **Automated Scheduler**: Automated post scheduling to publish content across multiple social platforms at specified dates and times.
- 📲 **Multi-Platform Integration**: Manage multiple social media accounts from a single unified dashboard.
- ☁️ **Media Management**: Fast and secure cloud media upload and storage for images and videos.
- 📊 **Activity Log & Monitoring**: Real-time tracking of post statuses (Draft, Scheduled, Published, Failed) and system activity logs.

---

## 🔌 API & Platform Integrations

Social Scheduler leverages key third-party API integrations for end-to-end automation:

### 1. 🤖 Google AI Studio (Gemini API - `@google/genai`)
- **Role**: Natural Language Processing (LLM) Engine.
- **Usage**: Generating social media text content, tone adjustment, hashtag generation, and context-aware image prompt creation.

### 2. 🌐 Zernio API (`@zernio/node`)
- **Role**: Multi-platform social media publishing gateway.
- **Usage**: Connecting social accounts (such as Instagram, Facebook, Twitter/X, LinkedIn, TikTok, YouTube, etc.) and executing automated post publishing (text & media) according to scheduled times.

### 3. 🖼️ Leonardo.ai API
- **Role**: High-quality AI image generation.
- **Usage**: Converting AI-crafted or user-provided prompts into stunning visual assets ready for social media posts.

### 4. ☁️ Cloudinary API
- **Role**: Cloud-based media management and hosting.
- **Usage**: Uploading, optimizing, and serving media assets (images/videos) publicly for seamless publishing to social channels.

---

## 🛠️ Tech Stack

### **Frontend (Client)**
- **Framework & Runtime**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Icons**: Lucide React & Simple Icons (`@icons-pack/react-simple-icons`)
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

### **Backend (Server)**
- **Runtime & Framework**: [Node.js](https://nodejs.org/) + [Express 5](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (executed via `tsx` / `nodemon`)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) ORM
- **Task Scheduling**: [Node-Cron](https://github.com/node-cron/node-cron) (Scheduler Service)
- **Authentication**: JWT (JSON Web Token) & Bcrypt
- **SDK Integrations**: `@google/genai`, `@zernio/node`, `cloudinary`, `multer`

---

## 🏗️ Project Architecture

The application adopts a **Client-Server (Decoupled Monorepo)** architecture communicating via **RESTful APIs**.

```
social-scheduler/
├── client/                     # Frontend Application (React + Vite + Tailwind)
│   ├── src/
│   │   ├── api/                # Axios Configuration & API Client
│   │   ├── components/         # Reusable UI Components (Navbar, Sidebar, Cards, Modals)
│   │   ├── context/            # Global State (AuthContext, Theme, etc.)
│   │   ├── pages/              # Main Pages (Dashboard, Schedule, Create Post, Accounts)
│   │   └── types/              # TypeScript Interfaces & Types
│   └── package.json
│
├── server/                     # Backend API Server (Express + TypeScript + MongoDB)
│   ├── config/                 # Database, Cloudinary, and Zernio Configurations
│   ├── controllers/            # Controller Logic (Auth, Post, Account, Activity)
│   ├── middlewares/            # Auth Middleware (JWT Token Validation)
│   ├── models/                 # Mongoose Schemas (User, Post, Account, Generation, ActivityLog)
│   ├── routes/                 # Express API Routes (/api/auth, /api/posts, /api/accounts)
│   ├── services/               # Scheduler Service (node-cron job executing Zernio publishing)
│   ├── server.ts               # Express Server Entry Point
│   └── package.json
│
└── README.md                   # Project Documentation
```

### 🔄 Execution Workflow Architecture

1. **Content Creation**:
   User inputs a topic/prompt ➡️ Server calls **Google AI Studio (Gemini)** to generate text and image prompts ➡️ (Optional) Server calls **Leonardo.ai API** to generate visuals ➡️ Media is saved to **Cloudinary**.
2. **Scheduling**:
   Post data is saved in **MongoDB** with `scheduled` status and a `scheduledFor` timestamp.
3. **Automated Publishing (Cron Job)**:
   The `schedulerService` powered by **node-cron** runs every minute ➡️ Queries posts with `scheduled` status whose target time has arrived ➡️ Sends post payload to **Zernio API** for publishing across connected accounts ➡️ Updates post status to `published` or `failed` and records an entry in `ActivityLog`.

---

## 💡 Benefits & Business Impact

Using **Social Scheduler** delivers significant efficiency and value to users:

1. ⏰ **Up to 80% Time Savings**: Eliminates manual content brainstorming and posting one-by-one across multiple platforms.
2. 🎯 **Brand Consistency & Timely Posting**: Keeps social channels active according to target audience peak hours without delays, even when offline.
3. 🚀 **Scalable Social Media Management**: Manage dozens of accounts across various social networks from a single centralized workspace.
4. 🧠 **Unlocks Unlimited Creativity**: Overcomes writer's block and visual design bottlenecks through AI copywriting and image generation.
5. 📈 **Minimizes Human Error**: Reduces risks of posting from the wrong account, typos, or incorrect timing through centralized scheduling and validation.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local instance or MongoDB Atlas)
- API Keys: Google AI Studio (Gemini), Leonardo.ai, Zernio API, Cloudinary.

### 2. Environment Variables Setup
Create a `.env` file inside the `server/` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/social-scheduler
JWT_SECRET=your_jwt_secret_key

# Google AI Studio
GEMINI_API_KEY=your_gemini_api_key

# Leonardo.ai
LEONARDO_API_KEY=your_leonardo_api_key

# Zernio API
ZERNIO_API_KEY=your_zernio_api_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Run Backend Server
```bash
cd server
npm install
npm run server
```

### 4. Run Frontend Client
```bash
cd client
npm install
npm run dev
```

---

*Built with ❤️ for the future of social media automation.*
