# **SOCIAL MEDIA ENGAGEMENT AGENT** 

# **Complete Project Architecture & Technical Documentation** 

# **Hackathon** 

**HackwithHyderabad 3.0 — AI Agents That Learn Using Hindsight** 

# **Project Type** 

AI-powered adaptive social media strategy and engagement agent. 

# **Working Project Name** 

# **SocialMind** 

**_A Social Media Agent That Learns Your Audience Over Time_** 

# **1. PROJECT OVERVIEW** 

SocialMind is an AI-powered **Social Media Engagement Agent** that learns how a specific brand's audience behaves over time. 

The system does not simply generate generic social media posts. 

Instead, it: 

1. Studies previous posts. 

2. Studies engagement results. 

3. Understands audience reactions. 

4. Remembers successful and unsuccessful content patterns. 

5. Learns the brand's preferred content style. 

6. Recalls relevant past experiences when creating new content. 

7. Generates recommendations based on those experiences. 

8. Receives the performance of the new content. 

9. Stores that new experience. 

10. Continuously improves future recommendations. 

The core learning cycle is: 

# CONTENT 

↓ 

AUDIENCE REACTION 

↓ 

# PERFORMANCE 

↓ 

HINDSIGHT MEMORY 

↓ FUTURE DECISION ↓ NEW CONTENT ↓ NEW PERFORMANCE ↓ 

HINDSIGHT MEMORY 

This is the central concept of the entire application. 

# **2. THE PROBLEM** 

Most AI social-media tools behave approximately like this: 

User gives topic 

↓ LLM ↓ 

Generic social media post 

The problem is that the AI does not necessarily know: 

- What this particular audience likes 

- Which topics perform well 

- Which writing styles work 

- Which hooks work 

- Which content fails 

- Which post formats generate discussion 

- What the brand has already tried 

- What the audience complained about 

- What the audience repeatedly asks for 

- What posting strategies worked previously 

Every brand has a different audience. 

Therefore: 

A strategy that works for one account may not work for another account. 

SocialMind solves this by creating **persistent, brand-specific memory** . 

The hackathon specifically describes the Social Media Engagement Agent as an agent that learns which post styles, topics, and timing drive engagement for a specific audience and improves through experience over weeks. 

# **3. THE SOLUTION** 

Instead of treating every request as a new request, SocialMind maintains a long-term memory of the brand. 

For example: 

# **Initial interaction** 

User: 

Create a LinkedIn post about our new AI product. 

# Agent: 

Here's a professional post about your AI product. 

Generic. 

# **After learning from 20 historical posts** 

User: 

Create a LinkedIn post about our new AI product. 

# Agent: 

Your audience has historically responded better to first-person engineering stories than generic product announcements. Previous technical posts also generated significantly more discussion. 

Then it generates a post using that learned strategy. 

# **After more feedback** 

The agent may learn: 

Audience prefers: 

- ✓ Technical stories 

- ✓ First-person experiences 

- ✓ Practical examples 

- ✓ Short hooks 

- ✓ AI/automation topics 

Audience dislikes: 

- ✗ Generic marketing language 

- ✗ Long introductions 

- ✗ Corporate buzzwords 

Successful pattern: 

Technical + personal + practical 

Best observed posting window: 

Evening 

Common audience interest: 

AI agents 

Developer tools 

Automation 

This knowledge persists. 

# **4. WHAT EXACTLY ARE WE BUILDING?** 

The product will have **one primary workflow** : 

**Create an optimized social-media post based on what the agent has learned about the brand's audience.** 

We will initially focus on: 

# **Platform** 

# **LinkedIn** 

This keeps the MVP focused. 

Later the architecture can support: 

- Instagram 

- X 

- Facebook 

- etc. 

But **do not build all platforms for the hackathon MVP.** 

The hackathon itself recommends keeping the scope tight: one workflow, one persona, one value proposition. 

# **5. TARGET USER** 

# **Persona** 

A: 

# **Startup founder / marketing manager / social-media manager** 

who manages one company's LinkedIn presence. 

They want to: 

- Create better content 

- Understand their audience 

- Avoid repeating failed strategies 

- Reuse successful patterns 

- Save time 

- Build a consistent brand voice 

# **6. CORE VALUE PROPOSITION** 

The application should communicate this in one sentence: 

# **"An AI social-media strategist that remembers what your audience responded to and uses those experiences to make better content decisions."** 

The important word is: 

# **REMEMBERS** 

# **7. WHAT IS HINDSIGHT?** 

Hindsight is the **long-term memory layer for the AI agent** . 

It is not our LLM. 

It is not our frontend. 

It is not our normal application database. 

Think of the architecture like this: 

┌─────────────────┐ │      LLM        │ │                 │ │ Reasoning +     │ │ Generation      │ └────────┬────────┘ │ │ ┌──────── ▼ ────────┐ │    HINDSIGHT    │ │                 │ │ Long-term       │ │ Agent Memory    │ └─────────────────┘ 

The LLM thinks. 

Hindsight remembers. 

# **8. WHY WE NEED A NORMAL DATABASE TOO** 

We will use **MongoDB** for structured application data. 

We will use **Hindsight** for agent memory. 

# **MongoDB stores:** 

Users Posts Likes Comments Shares Views Post dates Platform Campaigns 

Authentication 

# **Hindsight stores:** 

Audience preferences Successful content patterns 

Failed strategies Audience sentiment Important conversations Brand voice observations Content preferences Strategic lessons Past experiences Temporal patterns Learned relationships 

The distinction is extremely important. 

# **MongoDB** 

"This post received 450 likes." 

# **Hindsight** 

"Personal technical stories have historically generated strong engagement from this audience." The second statement is **agent experience** . 

That's what we want Hindsight to learn. 

# **9. HINDSIGHT OPERATIONS** 

Our application will primarily use: 

# **RETAIN** 

Store new experiences. 

New post performance 

↓ Hindsight RETAIN ↓ Agent memory **RECALL** 

Retrieve relevant previous experiences. 

New content request 

↓ Hindsight RECALL ↓ 

Relevant previous experiences 

# **REFLECT** 

Synthesize broader conclusions from memories. 

Many memories ↓ Hindsight REFLECT ↓ 

Higher-level strategy 

Hindsight's core architecture is based around Retain, Recall and Reflect. 

# **10. HIGH-LEVEL SYSTEM ARCHITECTURE** 

┌──────────────────────┐ │       USER           │ │                      │ │ Founder / Marketer   │ └──────────┬───────────┘ │ ▼ ┌──────────────────────┐ │      FRONTEND        │ │                      │ │ React + Vite         │ │ Tailwind CSS         │ └──────────┬───────────┘ │ │ REST API 



<!-- Start of picture text -->
▼<br>                         ┌──────────────────────┐<br>                         │       BACKEND        │<br>                         │                      │<br>                         │ Node.js + Express    │<br>                         └──────┬───────┬───────┘<br>                                │       │<br>                   ┌────────────┘       └─────────────┐<br>▼ ▼<br>        ┌───────────────────┐              ┌───────────────────┐<br>        │     MongoDB       │              │     HINDSIGHT     │<br>        │                   │              │                   │<br>        │ Structured Data   │              │ Agent Memory      │<br>        │                   │              │                   │<br>        │ Posts             │              │ Experiences       │<br>        │ Metrics           │              │ Preferences       │<br>        │ Users             │              │ Strategies        │<br>        │ Comments          │              │ Observations      │<br>        └───────────────────┘              └─────────┬─────────┘<br>                                                     │<br>▼<br>                                          ┌────────────────────┐<br>                                          │        LLM         │<br>                                          │                    │<br>                                          │ Reasoning +        │<br>                                          │ Content Generation │<br>                                          └────────────────────┘<br><!-- End of picture text -->

# **11. COMPLETE APPLICATION WORKFLOW** 

There are **two major flows** . 

# **FLOW A — TEACH THE AGENT** 

We need to give the agent historical experiences. 

The user can upload/import historical social-media posts. 

For the MVP, this can be: 

- CSV 

- JSON 

- manual entry 

We don't need complicated social-media API integration initially. 

Example: 

Post: 

"5 things I learned building an AI agent" 

Date: 

2026-08-10 

Topic: 

AI Agents 

Style: 

Personal + Technical 

Likes: 

450 

Comments: 

38 

Shares: 

21 

Impressions: 

12000 

# **Step A1** 

User enters/imports historical post. 

↓ 

# **Step A2** 

Backend stores structured information in MongoDB. 

↓ 

# **Step A3** 

Backend converts the meaningful experience into a memory document. 

Example: 

A LinkedIn post about building an AI agent used a 

first-person technical storytelling style. 

The post received 450 likes, 38 comments and 21 shares. 

Audience response was highly positive. 

The audience appeared particularly interested in 

practical AI engineering experiences. 

↓ 

# **Step A4** 

Send that experience to: 

# **Hindsight RETAIN** 

↓ 

# **Step A5** 

Hindsight processes and stores the experience. 

Now the agent has learned something. 

# **FLOW B — CREATE A NEW POST** 

This is our most important workflow. 

# **Step B1 — User enters idea** 

Example: 

Content idea: 

"Announce our new AI automation product" 

User chooses: Platform: 

LinkedIn 

Goal: Engagement 

Audience: 

Developers and startup founders 

# **Step B2 — Backend receives request** 

POST /api/strategy/generate 

# **Step B3 — Hindsight RECALL** 

Backend asks Hindsight: 

What previous experiences are relevant to creating a LinkedIn post about an AI product for this audience? 

Hindsight returns relevant memories. 

For example: 

Memory 1: 

Personal technical stories perform well. 

Memory 2: 

Generic product announcements performed poorly. 

Memory 3: 

Posts containing practical examples generated 

more comments. 

Memory 4: 

AI agent topics have strong audience interest. 

# **Step B4 — LLM receives context** 

The LLM receives: 

CURRENT REQUEST 

# + 

RELEVANT HINDSIGHT MEMORIES 

+ 

BRAND INFORMATION 

# **Step B5 — LLM generates STRATEGY** 

Before generating the actual post, the AI should generate a strategy. 

Example: 

Recommended Strategy 

Hook: 

Use a personal experience rather than a product announcement. 

Content Style: 

Technical + conversational 

Structure: 

Problem → Experience → Solution → Lesson 

Topic: AI automation 

Avoid: 

Generic marketing language 

Reason: 

Previous personal technical posts received stronger 

audience engagement. 

This is extremely important for our demo. 

We don't want to show: 

"AI generated a post." 

We want to show: 

**"AI made this decision because it remembers your audience."** 

# **Step B6 — LLM generates the post** 

Then generate: 

POST 

based on the strategy. 

# **Step B7 — User reviews** 

# UI: 

┌──────────────────────────────────────┐ │ Recommended Strategy                 │ │                                      │ │ Personal + Technical                 │ │                                      │ │ Why?                                 │ │ Your audience responded strongly     │ │ to similar posts in the past.        │ └──────────────────────────────────────┘ 

┌──────────────────────────────────────┐ │ Generated LinkedIn Post              │ │                                      │ │ [Generated content...]               │ │                                      │ │        Regenerate    Publish         │ └──────────────────────────────────────┘ 

# **Step B8 — User publishes** 

For the hackathon MVP, publishing can initially be represented by: 

Mark as Published 

We don't need to spend the majority of the hackathon building LinkedIn OAuth/API integration. 

# **Step B9 — Performance enters system** 

After the post receives engagement, user enters: 

Likes: 520 Comments: 61 

Shares: 42 

Impressions: 15,800 

# **Step B10 — System calculates performance** 

The backend calculates useful metrics such as: 

Engagement Rate 

Comment Rate 

Share Rate 

Like Rate 

# **Step B11 — Hindsight RETAIN** 

The system creates a new experience: 

A personal technical LinkedIn post about AI automation 

received 520 likes, 61 comments and 42 shares. 

The post outperformed the account's previous average. 

This reinforces the previous observation that personal technical content performs strongly 

with this audience. 

↓ **Hindsight RETAIN** 

Now the agent has **new knowledge** . 

# **12. THE LEARNING LOOP** 

This is the heart of the project: 

┌────────────────────┐ │ Historical Content │ └──────────┬─────────┘ ↓ HINDSIGHT RETAIN ↓ ┌────────────────────┐ │   Learned Memory   │ └──────────┬─────────┘ ↓ New User Idea ↓ HINDSIGHT RECALL ↓ ┌────────────────────┐ │ Relevant Memories  │ └──────────┬─────────┘ 

↓ LLM ↓ Strategy + Post ↓ Publication ↓ Engagement ↓ Performance Data 

↓ HINDSIGHT RETAIN 

│ └──────────────┐ │ ▼ Better Future 

Decisions 

# **13. WHAT THE AGENT SHOULD REMEMBER** 

We will divide memory into several conceptual categories. 

# **A. Content Memory** 

Topics 

Post formats Hooks 

Writing styles 

Content structures 

Calls to action 

# **B. Audience Memory** 

Audience interests 

Audience sentiment 

Audience preferences 

Common questions 

Common complaints 

Topics that trigger discussion 

# **C. Performance Memory** 

Likes 

Comments 

Shares 

Impressions 

Engagement rate 

Post performance 

# **D. Strategy Memory** 

What worked 

What failed 

What should be repeated 

What should be avoided 

# **E. Temporal Memory** 

When something worked 

Recent trends 

Historical trends 

Changes in audience behavior 

This makes Hindsight much more meaningful than simply storing post text. 

# **14. "WHAT I'VE LEARNED" PAGE** 

This should be one of the most impressive screens in the application. 

The user should be able to see: 

# **What SocialMind Has Learned** 

Example: 

AUDIENCE PROFILE 

Your audience responds strongly to: 

- 🟢 AI agents 

- 🟢 Developer experiences 

- 🟢 Practical tutorials 

- 🟢 Personal technical stories 

CONTENT STYLE 

Strong: 

Personal + Technical 

Moderate: 

Educational 

Weak: 

Generic promotional 

SUCCESSFUL PATTERNS 

1. First-person stories 

2. Practical examples 

3. Technical lessons 

4. Short hooks 

AUDIENCE SENTIMENT 

Positive: 

AI engineering 

Automation 

Real experiences 

Negative: 

Generic promotional content Excessive marketing language 

This makes the memory visible to the judges. 

# **15. BEFORE VS AFTER** 

The application **must demonstrate learning** . 

The hackathon specifically asks teams to show a learning curve such as: 

Interaction 1 → generic Interaction 5 → personalized Interaction 20 → feels like it knows you. 

So our demo should have: 

# **BEFORE** 

Memory: 

0 experiences 

Request: 

Create an AI post. 

Strategy: 

Generic professional LinkedIn post. 

# **AFTER** 

Memory: 

25 experiences 

Request: Create an AI post. 

Strategy: 

Personal technical story 

Why: 

Your audience has historically engaged more with first-person technical content. 

This is the **money shot** of the demo. 

# **16. DASHBOARD** 

The main dashboard should show: 

┌──────────────────────────────────────────────────┐ │ SocialMind                                       │ │ AI Social Media Strategist                      │ ├──────────────────────────────────────────────────┤ │                                                  │ │ Posts Analyzed       Memories       Avg Engage. │ │     27                  84              6.8%     │ │                                                  │ ├──────────────────────────────────────────────────┤ │                                                  │ │         WHAT YOUR AUDIENCE LIKES                 │ │                                                  │ │  AI Agents █████████████ │ │  Tutorials ██████████ │ │  Personal Stories ███████████████ │ │  Product News ██████ │ │                                                  │ ├──────────────────────────────────────────────────┤ │                                                  │ │ Recent Learning                                  │ │                                                  │ 

- │ ✓ Technical stories outperform generic posts     │ 

- │ ✓ Practical examples drive comments              │ 

- │ ✓ AI agent topics generate strong engagement     │ 

- │                                                  │ 

└──────────────────────────────────────────────────┘ 

# **17. FRONTEND PAGES** 

Keep the frontend simple. 

# **Page 1 — Dashboard** 

Shows: 

- Total posts 

- Memories 

- Engagement 

- Audience insights 

- Recent learning 

# **Page 2 — Content History** 

Shows historical posts: 

Post Date Topic Style Likes 

Comments 

Shares 

Engagement Rate 

# **Page 3 — Create Content** 

Main agent interface. 

Inputs: 

Content idea 

Platform 

Goal Target audience Tone 

Then: 

Generate Strategy 

# **Page 4 — Strategy & Generated Post** 

Shows: 

Recommended Strategy 

Why this strategy? Relevant memories Generated post 

# **Page 5 — Performance** 

After publication: 

Post Likes Comments 

Shares Impressions Engagement Rate Button: 

Analyze Performance 

This triggers learning. 

# **Page 6 — What I've Learned** 

Shows the knowledge accumulated by the agent. 

# **18. FRONTEND TECHNOLOGY** 

Use: 

# React 

Vite 

Tailwind CSS 

Axios 

React Router 

Keep the UI: 

- Professional 

- Clean 

- Modern 

- Minimal 

- Dashboard-oriented 

Don't waste time on excessive animations. 

# **19. BACKEND TECHNOLOGY** 

Use: 

Node.js Express.js MongoDB Mongoose Hindsight LLM API dotenv 

cors 

# **20. HINDSIGHT ARCHITECTURE** 

The backend should have a dedicated Hindsight service. 

backend/ 

│ 

- ├── services/ 

- │   ├── hindsightService.js 

- │   ├── llmService.js 

│   └── analyticsService.js 

# **hindsightService** 

Responsible for: retainMemory() recallMemory() reflectMemory() 

The rest of the application should not directly interact with Hindsight everywhere. Instead: 

Controller 

↓ hindsightService ↓ Hindsight 

This keeps the architecture clean. 

# **21. DATABASE ARCHITECTURE** 

MongoDB collections: 

users brands 

posts 

postMetrics 

audienceInsights 

# **User** 

_id name email password 

createdAt 

# **Brand** 

_id name 

description 

industry 

targetAudience 

tone createdAt 

**Post** 

_id brandId 

content 

platform 

topic style 

goal 

publishedAt 

status 

createdAt 

# **PostMetrics** 

_id 

postId likes 

comments 

shares 

impressions 

engagementRate 

recordedAt 

# **22. IMPORTANT: DON'T DUPLICATE HINDSIGHT** 

We should **not** create a giant memories collection in MongoDB containing everything Hindsight already stores. 

MongoDB: 

Application data. 

Hindsight: 

Agent memory. 

This distinction should remain throughout the application. 

# **23. BACKEND API DESIGN** 

# **Authentication** 

POST /api/auth/register 

POST /api/auth/login 

# **Brand** 

POST /api/brands 

GET /api/brands/:id 

PUT /api/brands/:id 

# **Posts** 

POST /api/posts 

GET /api/posts 

GET /api/posts/:id 

# **Historical Data** 

POST /api/posts/import 

# **Hindsight** 

POST /api/memory/retain 

POST /api/memory/recall 

POST /api/memory/reflect 

These routes can internally call: 

hindsightService 

# **Strategy** 

POST /api/strategy/generate 

This endpoint performs: 

User request ↓ Recall Hindsight ↓ Prepare context ↓ LLM ↓ Strategy 

# **Content generation** 

POST /api/content/generate 

# **Performance** 

POST /api/posts/:id/performance 

# **Learning** 

POST /api/posts/:id/analyze This performs: Performance ↓ Analytics ↓ Generate learning ↓ Hindsight RETAIN 

# **24. IMPORTANT AGENT PIPELINE** 

The most important backend function will conceptually be: 

generateStrategy() 

It should work like: 

1. Receive user's content idea 

2. Identify: 

- topic 

- platform 

- goal 

- audience 

3. Query Hindsight 

4. Retrieve relevant memories 

5. Prepare LLM prompt 

6. Ask LLM to analyze memories 

7. Generate: 

- recommended strategy 

- reasoning 

- content structure 

8. Return strategy to frontend 

Then: 

generatePost() 

uses: 

Strategy 

+ 

Relevant memories + Brand voice 

+ 

User idea 

to generate the actual post. 

# **25. PERFORMANCE LEARNING PIPELINE** 

After the post performs: 

User enters metrics 

↓ 

Backend ↓ Calculate engagement ↓ Compare against historical performance ↓ 

LLM analyzes outcome 

↓ Generate experience 

↓ 

Hindsight RETAIN 

Example retained experience: 

Post topic: 

AI automation 

Style: 

Personal technical story 

Performance: 520 likes 61 comments 42 shares 

Observation: 

The post outperformed the account's average engagement. 

Learning: 

Personal technical storytelling continues to perform strongly for this audience. 

Future implication: 

Consider similar storytelling for future AI posts. 

# **26. WHY THIS IS DIFFERENT FROM NORMAL RAG** 

We should **not pitch this as simply a RAG chatbot** . 

The agent is not merely retrieving documents. 

It is accumulating experiences. 

Example: 

Experience 1: 

Technical post → high engagement 

Experience 2: 

Promotional post → low engagement 

Experience 3: 

Technical + personal → very high engagement Over time: 

EXPERIENCES ↓ HINDSIGHT ↓ LEARNED PATTERNS ↓ FUTURE DECISIONS 

That is the important story. 

# **27. MEMORY BANK** 

Our Hindsight memory bank: 

Social-Media-Agent 

All memories for this demo brand/account will live there. 

Conceptually: 

Social-Media-Agent 

│ 

- ├── Content experiences 

- ├── Audience observations 

- ├── Performance experiences 

- ├── Strategic lessons 

└── Historical patterns 

# **28. SECURITY** 

The API key must **never** be exposed in React. 

Wrong: 

React 

↓ 

Hindsight API 

Correct: 

React 

↓ 

Node Backend 

↓ 

Hindsight 

The Hindsight API key exists only in: 

backend/.env 

Never: 

frontend/.env 

Never commit it to GitHub. 

# **29. PROJECT FOLDER STRUCTURE** 

Antigravity should create something approximately like: 

social-media-agent/ 

│ 

- ├── frontend/ 

- │   │ 

- │   ├── src/ 

- │   │   ├── components/ 

- │   │   ├── pages/ 

- │   │   ├── services/ 

- │   │   ├── hooks/ 

- │   │   ├── context/ 

- │   │   ├── App.jsx 

- │   │   └── main.jsx 

- │   │ 

- │   ├── package.json 

- │   └── vite.config.js 

- │ 

- ├── backend/ 

- │   │ 

- │   ├── controllers/ 

- │   │   ├── authController.js 

- │   │   ├── postController.js 

- │   │   ├── strategyController.js 

- │   │   └── performanceController.js 

- │   │ 

- │   ├── models/ 

- │   │   ├── User.js 

- │   │   ├── Brand.js 

- │   │   ├── Post.js 

- │   │   └── PostMetric.js 

- │   │ 

- │   ├── routes/ 

- │   │   ├── authRoutes.js 

- │   │   ├── postRoutes.js 

- │   │   ├── strategyRoutes.js 

- │   │   └── performanceRoutes.js 

- │   │ 

- │   ├── services/ 

- │   │   ├── hindsightService.js 

- │   │   ├── llmService.js 

- │   │   └── analyticsService.js 

- │   │ 

- │   ├── middleware/ 

- │   │ 

- │   ├── config/ 

- │   │   └── db.js 

- │   │ 

- │   ├── .env 

- │   ├── .gitignore 

- │   ├── server.js 

- │   └── package.json 

│ 

- ├── README.md └── .gitignore 

# **30. LLM ROLE** 

The LLM is responsible for: 

# **Reasoning** 

Understand user request 

# **Strategy** 

Interpret Hindsight memories 

# **Generation** 

Generate social media content 

# **Learning analysis** 

Analyze performance and produce a new experience 

Hindsight remains responsible for: 

Long-term memory 

This separation should be maintained. 

# **31. EXAMPLE END-TO-END SCENARIO** 

Suppose our fictional company is: 

# **NovaAI** 

Industry: 

AI Developer Tools 

Target audience: 

Developers and startup founders 

# **Historical post 1** 

Topic: 

AI Agents 

Style: 

Technical 

Likes: 

300 

Comments: 

25 

# **Historical post 2** 

Topic: 

Company announcement 

Style: 

Promotional 

Likes: 

80 

Comments: 

3 

# **Historical post 3** 

Topic: 

Building an AI agent 

Style: 

Personal + Technical 

Likes: 

520 

Comments: 

60 

Hindsight remembers these experiences. 

# **New request** 

Create a post about our new AI agent. 

Hindsight recalls: 

AI topics perform well. 

Personal technical storytelling performs strongly. 

Generic company announcements perform poorly. 

LLM produces: 

Recommended strategy: 

Use personal technical storytelling. 

Avoid generic product announcement language. 

Start with a strong engineering experience. 

Explain the problem. 

Show how the AI agent solved it. 

End with a practical takeaway. 

Then generates the post. 

# **New performance** 

Likes: 620 Comments: 72 Shares: 48 

The agent retains: 

This personal technical AI-agent post performed exceptionally well. 

This reinforces the audience preference for practical technical storytelling. Next time the agent knows even more. 

# **32. THE "LEARNING CURVE" DEMO** 

This should be deliberately designed. 

**Interaction 1** 

Memories: 0 

Output: 

Generic 

**Interaction 5** 

Memories: ~10 

Output: 

Somewhat personalized 

# **Interaction 20** 

Memories: 40+ 

Output: 

Highly personalized 

The hackathon explicitly wants this type of visible learning progression. 

# **33. DEMO FLOW FOR JUDGES** 

Our final demo should take approximately 3–5 minutes. 

# **0:00–0:30 — Problem** 

Show: 

Generic AI social-media generator 

Explain: 

"It can generate content, but it doesn't remember what actually works for this audience." 

# **0:30–1:00 — Introduce SocialMind** 

Show: 

Dashboard 

Explain: 

"SocialMind learns from the brand's historical content and audience reactions." 

# **1:00–1:30 — Hindsight memory** 

Show: 

What I've Learned 

Example: 

Personal technical stories → strong 

Generic promotions → weak 

AI agent content → strong 

# **1:30–2:15 — New request** 

Enter: 

"Create a post about our new AI agent." 

Click: 

**Generate Strategy** 

Show: 

Recommended: 

Personal + Technical 

Reason: 

Relevant previous experiences indicate 

this audience responds strongly to this style. 

# **2:15–2:45 — Generate** 

Show the actual LinkedIn post. 

# **2:45–3:15 — Feedback** 

Enter: 

520 likes 

61 comments 

42 shares 

Click: 

**Analyze Performance** 

# **3:15–3:45 — Hindsight learns** 

Show: 

New memory retained. 

Learning: 

Personal technical storytelling continues 

to perform strongly. 

# **3:45–4:30 — Repeat request** 

Ask: 

"Create another AI-related post." 

The agent now produces a different strategy based on its accumulated experience. 

That is the **before → learning → after** moment. 

# **34. WHAT WE SHOULD NOT BUILD** 

This is very important. 

Don't let Antigravity turn this into a giant project. 

**Do NOT initially build:** 

❌ Instagram integration ❌ Facebook integration ❌ X integration ❌ Complex OAuth ❌ Real-time social scraping 

❌ Social media scheduling platform 

❌ Full CRM 

❌ Chatbot for everything ❌ Dozens of AI agents ❌ Massive analytics platform 

Our core product is: 

# **One social-media agent that learns one brand's audience.** 

The hackathon specifically advises keeping the scope tight. 

# **35. WHAT MAKES THIS A HINDSIGHT PROJECT?** 

This is critical. 

We shouldn't merely say: 

"We use Hindsight." 

We need to prove it. 

Our application should visibly demonstrate: 

# **Without memory** 

Generic strategy 

# **With Hindsight** 

Historical experiences 

↓ 

Relevant memories 

↓ 

Personalized strategy 

# **After new experience** 

New performance 

↓ 

Retain 

↓ 

# Updated memory 

↓ 

# Improved future strategy 

That makes **Hindsight the star of the project** , which directly aligns with the problem statement's requirement that memory be central rather than a decorative feature. 

# **36. JUDGING ALIGNMENT** 

The official judging criteria are: 

|**Criterion**|**Weight**|
|---|---|
|Innovation|30%|
|Hindsight Memory|25%|
|Technical Implementation|20%|
|User Experience|15%|
|Real-world Impact|10%|



Our architecture therefore deliberately emphasizes: 

Innovation 

↓ 

Adaptive social strategy 

Hindsight Memory 

↓ 

Recall + Retain + learning 

Technical 

↓ 

React + Node + MongoDB + Hindsight + LLM 

UX 

↓ 

Simple dashboard + clear recommendations 

Impact 

↓ 

Marketing teams save time and learn from their audience 

# **37. FINAL ARCHITECTURE** 

Put everything together: 

┌───────────────────┐ │       USER        │ │ Founder/Marketer  │ └─────────┬─────────┘ │ ▼ ┌──────────────────────────┐ │       REACT FRONTEND     │ │                          │ │ Dashboard                │ │ Content History          │ │ Create Content           │ │ Strategy                 │ │ Performance              │ │ What I've Learned        │ └────────────┬─────────────┘ │ ▼ ┌──────────────────────────┐ │     NODE + EXPRESS       │ │                          │ │ API Layer                │ │ Agent Orchestration      │ │ Analytics                │ └───────┬──────────┬───────┘ 

│          │ ┌────────────┘          └─────────────┐ ▼ ▼ ┌──────────────────┐                 ┌──────────────────┐ │     MONGODB      │                 │    HINDSIGHT     │ │                  │                 │                  │ │ Users            │                 │ Retain           │ │ Posts            │                 │ Recall           │ │ Metrics          │                 │ Reflect          │ │ Brands           │                 │                  │ └──────────────────┘                 │ Experiences      │ │ Observations     │ │ Preferences      │ │ Strategies       │ └────────┬─────────┘ │ ▼ ┌──────────────────┐ │       LLM        │ │                  │ │ Analyze memory   │ │ Create strategy  │ │ Generate content │ │ Analyze results  │ └──────────────────┘ 

# **38. THE ONE SENTENCE ARCHITECTURE** 

If a judge asks: 

# **"Explain your architecture in one sentence."** 

Say: 

**"SocialMind uses Hindsight as the long-term memory layer between our application and LLM, allowing the agent to recall previous audience experiences when making content decisions and retain new performance outcomes so future strategies improve over time."** 

# **39. WHAT ANTIGRAVITY SHOULD BUILD** 

And **this is the part I recommend you actually give Antigravity** : 

Build a full-stack web application called "SocialMind". 

SocialMind is an AI-powered Social Media Engagement Agent for HackwithHyderabad 3.0's "AI Agents That Learn Using Hindsight" challenge. 

The core purpose of the application is NOT generic social-media content generation. 

The core purpose is to create an AI social-media strategist that 

learns a specific brand's audience over time using Hindsight. 

Use this architecture: 

# Frontend: 

- React 

- Vite 

- Tailwind CSS 

- React Router 

- Axios 

# Backend: 

- Node.js 

- Express.js 

- MongoDB 

- Mongoose 

- Hindsight 

- LLM API 

- dotenv 

- cors 

Use MongoDB for structured application data such as: 

- users 

- brands 

- posts 

- post metrics 

Use Hindsight as the agent's long-term memory layer. 

Do NOT use Hindsight merely as a generic vector database. 

Hindsight must be used for: 

- retaining experiences 

- recalling relevant experiences 

- reflecting on accumulated experiences 

- audience preferences 

- successful content patterns 

- failed strategies 

- audience sentiment 

- strategic lessons 

- temporal patterns 

The main workflow is: 

Historical social-media posts 

↓ 

Performance data 

↓ Hindsight RETAIN ↓ Long-term memory ↓ User enters new content idea ↓ Hindsight RECALL ↓ Relevant previous experiences ↓ LLM ↓ Content strategy ↓ Generated LinkedIn post ↓ User publishes ↓ Performance metrics entered ↓ Performance analysis ↓ Hindsight RETAIN ↓ Improved future recommendations 

The initial MVP should focus ONLY on LinkedIn. 

Do not initially implement: 

- Instagram 

- Facebook 

- X 

- complex OAuth 

- social-media scraping 

- social-media scheduling 

- multiple agents 

The main user persona is a startup founder or social-media 

manager managing one brand's LinkedIn account. 

Required pages: 

1. Dashboard 

2. Content History 

3. Create Content 

4. Strategy & Generated Post 

5. Performance 

6. What I've Learned 

Dashboard should show: 

- number of posts analyzed 

- number of memories/experiences 

- average engagement 

- learned audience preferences 

- successful content patterns 

- recent learning 

Content History should show: 

- post content 

- date 

- topic 

- style 

- likes 

- comments 

- shares 

- engagement rate 

Create Content should allow: 

- content idea 

- platform 

- goal 

- target audience 

When the user submits an idea: 

1. Identify topic and goal. 

2. Query Hindsight for relevant memories. 

3. Retrieve relevant previous experiences. 

4. Send the user request + relevant memories + brand information 

to the LLM. 

5. Generate a recommended content strategy. 

6. Explain WHY the strategy was selected. 

7. Generate the actual LinkedIn post. 

The Strategy page must visibly show: 

- Recommended strategy 

- Content style 

- Recommended hook 

- Recommended structure 

- Things to avoid 

- Relevant memories 

- Explanation of why the strategy was recommended 

- Generated LinkedIn post 

The application must make it obvious that the strategy 

comes from Hindsight memories. 

Performance page should allow the user to enter: 

- likes 

- comments 

- shares 

- impressions 

Calculate engagement-related metrics. 

When performance is submitted: 

1. Analyze performance. 

2. Compare it with previous performance. 

3. Generate a meaningful learning/experience statement. 

4. Retain that experience in Hindsight. 

5. Display what the agent learned. 

The "What I've Learned" page should visualize: 

- audience interests 

- successful topics 

- successful writing styles 

- unsuccessful styles 

- successful content patterns 

- audience sentiment 

- strategic lessons 

The system should demonstrate a learning curve: 

Interaction 1: 

Generic recommendation. 

After historical experiences: 

Personalized recommendation. 

After additional performance feedback: 

More refined recommendation. 

The application should include realistic seed data so that the 

demo can immediately demonstrate learning. 

Create approximately 20-30 historical LinkedIn posts with: 

- different topics 

- different writing styles 

- realistic engagement metrics 

- different audience reactions 

The seed data should contain both successful and unsuccessful examples so that the agent can learn meaningful differences. 

Example learned pattern: 

"Personal technical stories perform strongly for this audience." 

Example negative pattern: 

"Generic promotional announcements receive weaker engagement." 

The system should not hardcode these conclusions. 

They should be derived from the historical experiences and/or 

Hindsight memory. 

Keep Hindsight API credentials only in the backend environment. 

Never expose the Hindsight API key in the React frontend. 

Create a dedicated hindsightService responsible for: 

- retainMemory() 

- recallMemory() 

- reflectMemory() 

Create a dedicated llmService responsible for: 

- strategy generation 

- content generation 

- performance analysis 

Create a dedicated analyticsService responsible for: 

- engagement calculations 

- performance comparison 

Keep the architecture modular and production-quality. 

The final UI should be professional, clean, modern and easy to 

understand during a hackathon demo. 

The most important feature is visible learning. 

The application should clearly demonstrate: 

BEFORE MEMORY: 

Generic strategy. 

AFTER MEMORY: 

Personalized strategy based on previous audience experiences. 

AFTER NEW FEEDBACK: 

The new experience is retained and influences future 

recommendations. 

Do not build unnecessary features. 

Prioritize the complete learning loop: 

RETAIN → RECALL → REASON → GENERATE → FEEDBACK → RETAIN. 

**And that's our project.** 

**Don't create the folders yet. Don't start coding yet.** 

You now have the **product specification + architecture + workflow + database design + Hindsight role + UI + API plan + demo plan** . 

