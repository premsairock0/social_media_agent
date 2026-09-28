export const PREPROMPTS = [
  {
    id: 1,
    title: 'Autonomous Testing Agent',
    category: 'AI & Automation',
    idea: 'Create a LinkedIn post about our new AI agent that automates software testing and cuts regression cycles from 3 days to 45 minutes.',
    goal: 'Engagement & Technical Discussion',
    audience: 'Software Engineers, QA Leads, Tech Founders',
  },
  {
    id: 2,
    title: 'Monolith vs Microservices Retrospective',
    category: 'Architecture',
    idea: 'Share our technical retrospective on migrating 14 microservices back into a modular monolith, saving $12,000/month in cloud infrastructure and slashing latency by 65%.',
    goal: 'Thought Leadership & Architecture Debate',
    audience: 'Backend Engineers, Cloud Architects, CTOs',
  },
  {
    id: 3,
    title: 'Severity-1 Outage Post-Mortem',
    category: 'DevOps & Reliability',
    idea: 'Write a transparent post-mortem of a 2-hour production outage caused by a database connection pool leak, focusing on blameless culture and our automated safeguards.',
    goal: 'Engineering Culture & Transparency',
    audience: 'Site Reliability Engineers, Engineering Leaders, Developers',
  },
  {
    id: 4,
    title: 'Open-Source DevTool Launch',
    category: 'Open Source',
    idea: 'Announce open-sourcing our lightweight CLI tool that detects and flags memory leaks in Node.js microservices before deployment.',
    goal: 'Community Adoption & GitHub Stars',
    audience: 'Open Source Contributors, Node.js Developers, DevOps Teams',
  },
  {
    id: 5,
    title: 'Real-World AI Code Reviews',
    category: 'AI & Automation',
    idea: 'Discuss our findings after 6 months of using LLM agents for automated PR code reviews: what they caught reliably versus where human senior engineers are still irreplaceable.',
    goal: 'Practical Insights & Community Discussion',
    audience: 'Senior Software Engineers, Tech Leads, Engineering Managers',
  },
  {
    id: 6,
    title: 'AWS Cloud Cost Optimization',
    category: 'Cloud & Infrastructure',
    idea: 'Break down the 4 architectural changes we made to reduce our AWS Lambda & DynamoDB bill by 42% without degrading p99 API response times.',
    goal: 'Actionable Technical Guide & Authority',
    audience: 'DevOps Engineers, Cloud Architects, Startup Founders',
  },
  {
    id: 7,
    title: 'Production RAG & Vector Search Pitfalls',
    category: 'AI & ML Systems',
    idea: 'Detail the 5 biggest mistakes we made building a production RAG system with vector search, and how reranking algorithms solved 90% of hallucinations.',
    goal: 'Educational Content & High Engagement',
    audience: 'AI/ML Engineers, Data Scientists, GenAI Product Builders',
  },
  {
    id: 8,
    title: 'Career Shift: Senior to Staff Engineer',
    category: 'Career & Leadership',
    idea: 'Share actionable career advice on the critical mindset shift from Senior to Staff Engineer: moving from solving defined technical problems to identifying organizational bottlenecks.',
    goal: 'Career Mentorship & Organic Reach',
    audience: 'Software Engineers, Aspiring Staff Engineers, Tech Leads',
  },
  {
    id: 9,
    title: 'Zero-Downtime Database Migration',
    category: 'Database & Systems',
    idea: 'Explain our expand-and-contract pattern to migrate 50 million user records across PostgreSQL schemas with zero downtime and sub-second rollback capability.',
    goal: 'Technical Authority & Deep Dive',
    audience: 'Database Administrators, Backend Developers, Systems Architects',
  },
  {
    id: 10,
    title: 'Async RFCs over Status Meetings',
    category: 'Engineering Culture',
    idea: 'Highlight how our distributed team replaced 70% of synchronous status meetings with structured RFCs and async video demos, doubling weekly sprint velocity.',
    goal: 'Workplace Culture & Management Insights',
    audience: 'Engineering Managers, Remote Tech Workers, Startup Executives',
  },
  {
    id: 11,
    title: 'Refactoring 10-Year-Old Legacy Code',
    category: 'Architecture',
    idea: 'Share our strangler fig approach to modernizing a 10-year-old monolithic codebase into modern React & Go services while continuing to ship bi-weekly customer features.',
    goal: 'Technical Storytelling & Experience Sharing',
    audience: 'Full Stack Developers, Engineering Directors, Tech Consultants',
  },
  {
    id: 12,
    title: 'Sub-250ms LLM Streaming Latency',
    category: 'AI & ML Systems',
    idea: 'Break down how we dropped LLM time-to-first-token (TTFT) from 1.8 seconds down to 210 milliseconds using speculative decoding and edge streaming.',
    goal: 'Technical Breakdown & Innovation Showcase',
    audience: 'AI Application Developers, Performance Engineers, Tech Founders',
  },
  {
    id: 13,
    title: 'Reforming 24/7 On-Call Rotation',
    category: 'DevOps & Reliability',
    idea: 'Discuss why we overhauled our 24/7 on-call rotation to prevent burnout, compensating engineers properly and eliminating noisy, non-actionable PagerDuty alerts.',
    goal: 'Human-Centric Leadership & Discussion',
    audience: 'Engineering Leads, DevOps Managers, SREs',
  },
  {
    id: 14,
    title: 'Bootstrapped SaaS to $50k MRR',
    category: 'Startup & Product',
    idea: 'Reflect on reaching $50k MRR as a bootstrapped developer tool startup, contrasting our capital-efficient path with venture-backed hypergrowth expectations.',
    goal: 'Founder Storytelling & Entrepreneurship',
    audience: 'Startup Founders, Indie Hackers, Angel Investors',
  },
  {
    id: 15,
    title: '10x Faster CI/CD Build Pipelines',
    category: 'DevOps & Reliability',
    idea: 'Explain how caching Docker layers, parallelizing Jest test suites, and remote build runners trimmed our CI/CD pipeline from 28 minutes to under 3 minutes.',
    goal: 'Practical DevOps Tips & Tool Recommendations',
    audience: 'DevOps Engineers, Software Developers, Platform Engineers',
  },
];

/**
 * Returns a preprompt by ID, or the first one if not found
 */
export function getPrepromptById(id) {
  return PREPROMPTS.find((p) => p.id === id) || PREPROMPTS[0];
}

/**
 * Returns a random preprompt, optionally avoiding the current one
 */
export function getRandomPreprompt(currentId) {
  const available = PREPROMPTS.filter((p) => p.id !== currentId);
  if (available.length === 0) return PREPROMPTS[0];
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
}

/**
 * Returns the next preprompt in sequence (cycles through 1..15)
 */
export function getNextPreprompt(currentId) {
  const currentIndex = PREPROMPTS.findIndex((p) => p.id === currentId);
  if (currentIndex === -1 || currentIndex === PREPROMPTS.length - 1) {
    return PREPROMPTS[0];
  }
  return PREPROMPTS[currentIndex + 1];
}

/**
 * Reduced, concise list of core audience roles for multi-select
 */
export const AUDIENCE_OPTIONS = [
  'Software Engineers',
  'Tech Leads & Architects',
  'Founders & CTOs',
  'DevOps & SREs',
  'AI / ML Engineers',
  'Product Managers',
  'QA & Automation Leads',
  'Engineering Managers',
];

