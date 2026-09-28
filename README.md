# SocialMind — AI Social Media Engagement Agent (HackwithHyderabad 3.0)

> **"AI Agents That Learn Using Hindsight"**  
> An adaptive LinkedIn strategist and engagement agent that learns what resonates with a specific brand's audience over time through persistent hindsight memory.

---

## 🧠 Architectural Overview

SocialMind uses **Hindsight** as the long-term memory layer between the web application and the LLM, allowing the agent to recall previous audience experiences when making content decisions and retain new performance outcomes so future strategies improve over time.

### Core Cognitive Loop
$$\text{RETAIN} \longrightarrow \text{RECALL} \longrightarrow \text{REASON} \longrightarrow \text{GENERATE} \longrightarrow \text{FEEDBACK} \longrightarrow \text{RETAIN}$$

1. **MongoDB**: Stores structured business data (users, brands, posts, raw impressions, and cached statistical metrics in `AudienceInsight`).
2. **Hindsight**: Stores qualitative, episodic agent memories (what worked, what failed, audience sentiment, and strategic lessons).
3. **LLM**: Synthesizes recalled memories to formulate tailored content strategies and writes LinkedIn posts.

---

## 📁 Project Structure

```text
social-media-agent/
├── backend/
│   ├── config/db.js                  # MongoDB connection
│   ├── models/                       # User, Brand, Post, PostMetric, AudienceInsight
│   ├── controllers/                  # strategyController, performanceController, postController
│   ├── services/                     # hindsightService, llmService, analyticsService
│   ├── routes/                       # strategyRoutes, performanceRoutes, postRoutes, memoryRoutes
│   ├── data/seed/                    # historicalPosts.json & seedDatabase.js (Experience Builder)
│   ├── server.js                     # Express API
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/                    # 6 core views (Dashboard, History, Create, StrategyView, Performance, Insights)
│   │   ├── components/layout/        # AppLayout with sidebar navigation
│   │   ├── services/api.js           # Axios API client
│   │   ├── App.jsx                   # React Router routing
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Seed Database & Prime Hindsight
```bash
cd backend
npm run seed
```
