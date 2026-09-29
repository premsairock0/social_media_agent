/**
 * LLM Service - SocialPulse
 * 
 * Provides cognitive generation, strategy formulation, studio actions,
 * "What Should I Post?" intelligence, and reflection for SocialPulse
 * using OpenAI-compatible API (Groq openai/gpt-oss-120b).
 * 
 * Enforces strict anti-hallucination and truthful experience framing,
 * plus sample-size-aware reflection and multi-platform intelligence.
 */

class LLMService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || process.env.LLM_API_KEY;
    this.model = process.env.LLM_MODEL || 'openai/gpt-oss-120b';
    this.endpoint = 'https://api.groq.com/openai/v1/chat/completions';
  }

  /**
   * Helper to execute chat completion
   */
  async _callLLM(messages, temperature = 0.5, jsonMode = false) {
    if (!this.apiKey) {
      throw new Error('LLM_API_KEY / GROQ_API_KEY is not configured in .env');
    }

    const payload = {
      model: this.model,
      messages,
      temperature,
    };

    if (jsonMode) {
      payload.response_format = { type: 'json_object' };
    }

    const res = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`LLM API Error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  }

  /**
   * REASON & GENERATE: Formulate platform strategy and write post/caption
   * based on recalled Hindsight memories with strict anti-hallucination guardrails.
   */
  async generateStrategy({ idea, platform = 'LinkedIn', goal = 'Engagement', audience = 'Tech Community', memories = [], brand = {} }) {
    console.log(`[LLM] Reasoning over ${memories.length} recalled memories for ${platform} with ${this.model}...`);

    const memoriesContext = memories.length > 0
      ? memories.map((m, i) => `Memory #${i + 1} (${m.angle || 'recalled'}): ${m.content}`).join('\n')
      : 'No prior memories found (cold start).';

    const isInstagram = platform.toLowerCase() === 'instagram';

    const systemPrompt = `You are SocialPulse, an elite AI Social Engagement & Intelligence Agent specializing in ${platform}.
Tagline: "Understand your audience. Learn from your content. Create what matters."
You learn your brand's audience over time using Hindsight memory.
Your task is to analyze the user's content idea alongside recalled Hindsight memories of what has worked or failed historically for this audience on ${platform}, and produce a winning strategy and the actual post/caption copy.

=======================================================
CRITICAL ANTI-HALLUCINATION & TRUTHFULNESS REQUIREMENTS:
=======================================================
1. NEVER INVENT OR FABRICATE personal experiences, achievements, job offers, interview outcomes, company names, credentials, revenue figures, customer numbers, specific percentages, or quotes unless they are EXPLICITLY present in the user's input or brand context.
2. If the user asks for a topic (e.g., "Create a post about top 50 interview questions"):
   - DO NOT claim: "the 50 interview questions that landed me my first software job"
   - DO NOT claim: "I got offers from three top tech firms"
   - DO NOT claim: "95% interview-to-offer ratio"
   - INSTEAD, use truthful, grounded phrasing such as:
     "The 50 software engineering interview questions I wish I had prepared for earlier" OR
     "Most tech interview prep focuses on the wrong questions. Here is what senior engineering interviewers actually look for:"
3. You may use effective content structures (e.g., problem breakdown, practical frameworks, candid engineering takeaways, carousel slide flow) learned from Hindsight memories, but factual claims and author background must remain completely truthful.
4. Do NOT add disclaimers, excuses, or apologies in the generated post. The post copy must read naturally, authentically, and engagingly.

${isInstagram ? `
INSTAGRAM SPECIFIC GUIDANCE:
- Focus on visual storytelling, high-retention hooks in line 1, punchy captions with conversational spacing, and clear CTAs.
- Suggest a concrete visual / carousel / reel concept.
- Include a strategic hashtag set (mix of niche, topic, and community tags).
` : `
LINKEDIN SPECIFIC GUIDANCE:
- Focus on professional depth, engineering frameworks, transparent lessons, and debate-driving questions.
- Clean formatting with line breaks, scannable bullet points, and high-impact opening hooks.
`}

Respond strictly in valid JSON matching this schema:
{
  "platform": "${platform}",
  "strategy": "Core strategic approach and rationale",
  "hook": "The exact high-impact opening hook line (truthful, no fabricated personal claims)",
  "structure": "Step-by-step structural outline of the post or carousel",
  "thingsToAvoid": "Specific pitfalls or patterns to avoid based on past flops and truthfulness rules",
  "whyThisStrategy": "Explicit explanation citing how the recalled Hindsight memories influenced this strategy",
  "generatedPost": "The complete, ready-to-publish ${isInstagram ? 'Instagram caption (with hashtags)' : 'LinkedIn post'} formatted with clean line breaks",
  ${isInstagram ? `
  "visualSuggestion": "Detailed visual concept description for single image or video cover",
  "carouselIdea": {
    "title": "Carousel Title Concept",
    "slides": ["Slide 1: Hook & Context", "Slide 2: The Core Problem", "Slide 3: Actionable Step 1", "Slide 4: Actionable Step 2", "Slide 5: Summary & CTA"]
  },
  "reelIdea": "30-second Reel concept with hook in first 3 seconds, audio tone, and talking points",
  "hashtags": ["#TechLeadership", "#SoftwareEngineering", "#CodeTips"],
  ` : ''}
  "optimalPostingTime": {
    "bestDays": ["Tuesday", "Wednesday", "Thursday"],
    "bestTimeSlot": "8:15 AM - 9:30 AM (Local Time)",
    "audienceReasoning": "Why this time window maximizes visibility for this target audience"
  },
  "alternativeStrategies": [
    {
      "name": "${isInstagram ? 'Visual Carousel Breakdown' : 'Contrarian Debate Angle'}",
      "angle": "Challenge common industry assumptions to spark high comment activity",
      "hook": "Sharp debate-driving hook line",
      "structure": "Unpopular observation → Technical evidence → Thought-provoking question",
      "recommendedTime": "Wednesday at 12:30 PM",
      "generatedPost": "Adapted post focusing on community discussion"
    },
    {
      "name": "${isInstagram ? 'Reel / Short Video Script' : 'Actionable Engineering Playbook'}",
      "angle": "Tactical, step-by-step checklist that readers bookmark and share",
      "hook": "Clear problem-solving hook line",
      "structure": "The recurring problem → Actionable steps → Key takeaway",
      "recommendedTime": "Thursday at 8:30 AM",
      "generatedPost": "Adapted post formatted with structured bullet points"
    }
  ]
}`;

    const userPrompt = `Brand: ${brand.name || 'Tech Company'}
Platform: ${platform}
Industry: ${brand.industry || 'AI / Software'}
Target Audience: ${audience}
Goal: ${goal}
User Content Idea: "${idea}"

=== RECALLED HINDSIGHT MEMORIES (Multi-Angle) ===
${memoriesContext}
================================================

Analyze these recalled memories. Leverage the patterns that worked and avoid what failed for this audience on ${platform}.
REMEMBER: Do NOT fabricate personal achievements, job offers, or statistics that were not in the user's prompt.
Return valid JSON only.`;

    try {
      const content = await this._callLLM(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        0.4,
        true
      );

      const parsed = JSON.parse(content);
      return {
        ...parsed,
        memoriesUsed: memories.map((m) => ({
          id: m.id,
          content: m.content,
          relevanceScore: m.relevanceScore,
          angle: m.angle,
        })),
      };
    } catch (err) {
      console.error('[LLM Service generateStrategy Error]:', err.message);
      throw err;
    }
  }

  /**
   * "WHAT SHOULD I POST?" - HERO INTELLIGENCE FEATURE
   * Evaluates platform, recent content history, timely trends, and Hindsight memories
   * to prescribe the highest-leverage topic and format with supporting evidence.
   */
  async generateWhatToPost({ platform = 'LinkedIn', recentPosts = [], trends = [], memories = [], audience = 'Tech Community', goal = 'Engagement' }) {
    console.log(`[LLM] Formulating "What Should I Post?" recommendation for ${platform} based on ${memories.length} memories & ${trends.length} trends...`);

    const memoriesText = memories.length > 0
      ? memories.map((m, i) => `[Memory #${i + 1}] (${m.angle || 'evidence'}): ${m.content}`).join('\n')
      : 'No prior memories stored yet.';

    const trendsText = trends.length > 0
      ? trends.map((t, i) => `[Trend #${i + 1}] ${t.topic} (${t.category}, momentum score: ${t.growthScore}/100) - ${t.description}`).join('\n')
      : 'General industry trends: AI Agents, System Architecture, Engineering Productivity.';

    const historyText = recentPosts.length > 0
      ? recentPosts.slice(0, 5).map((p, i) => `Post #${i + 1}: "${p.topic}" (${p.style}) - Engagement: ${p.metrics?.engagementRate || 'N/A'}%`).join('\n')
      : 'No recent posts recorded.';

    const isInstagram = platform.toLowerCase() === 'instagram';

    const systemPrompt = `You are SocialPulse, an AI Social Engagement & Intelligence Agent.
Tagline: "Understand your audience. Learn from your content. Create what matters."

Your goal is to answer the user's question: "What Should I Post?" for ${platform}.
You must synthesize:
1. Available Hindsight memories of what has succeeded vs failed for this audience.
2. Timely social trends and momentum topics.
3. Recent post performance patterns.
4. Platform dynamics (${isInstagram ? 'Instagram visual carousels, reels, aesthetic captions' : 'LinkedIn thought leadership, frameworks, technical stories'}).

CRITICAL RULES:
- Ground your recommendation in the available Hindsight evidence.
- Do NOT invent fake percentages or fabricated statistics.
- Recommend a concrete, actionable topic, format, hook, and full post copy ready for publication.

Respond strictly in valid JSON:
{
  "platform": "${platform}",
  "recommendedTopic": "Clear, compelling topic headline",
  "recommendedFormat": "${isInstagram ? 'Carousel Breakdown (5 Slides)' : 'Technical Framework Story'}",
  "confidenceScore": "92%",
  "suggestedHook": "The exact opening line that captures attention truthfulness-first",
  "contentDirection": [
    "Step 1: Frame the real-world challenge without exaggeration",
    "Step 2: Share actionable takeaway or architectural lesson",
    "Step 3: Ask a specific question to spark comments"
  ],
  "suggestedCTA": "A high-converting closing line or question",
  "suggestedHashtags": ["#TechStrategy", "#Engineering", "#SoftwareArchitecture"],
  "reasonForRecommendation": "Detailed strategic reasoning explaining why this topic and format will succeed now based on audience memory and trends",
  "supportingEvidence": [
    {
      "memorySnippet": "Snippet of recalled Hindsight memory",
      "lesson": "How this previous experience justifies the recommendation"
    }
  ],
  "readyPostCopy": "The complete, ready-to-publish ${isInstagram ? 'caption with spacing and hashtags' : 'LinkedIn post copy'}",
  ${isInstagram ? `
  "visualConcept": "Visual layout description (carousel slide themes or reel aesthetic)",
  ` : ''}
  "expectedAudienceOutcome": "Why this drives high-quality saves, comments, or shares"
}`;

    const userPrompt = `Platform: ${platform}
Target Audience: ${audience}
Primary Goal: ${goal}

=== RECENT CONTENT HISTORY ===
${historyText}

=== CURRENT RELEVANT TRENDS ===
${trendsText}

=== HINDSIGHT EXPERIENTIAL MEMORIES ===
${memoriesText}

Analyze the above data and tell me: What should I post next on ${platform}?
Return valid JSON only.`;

    try {
      const content = await this._callLLM(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        0.4,
        true
      );

      const parsed = JSON.parse(content);
      return {
        ...parsed,
        memoriesConsulted: memories.map((m) => ({
          id: m.id,
          content: m.content,
          relevanceScore: m.relevanceScore,
        })),
      };
    } catch (err) {
      console.error('[LLM Service generateWhatToPost Error]:', err.message);
      throw err;
    }
  }

  /**
   * CONTENT STUDIO ACTIONS:
   * Handles specialized studio micro-actions:
   * - 'generate_post' / 'generate_caption'
   * - 'improve_hook'
   * - 'generate_cta'
   * - 'generate_hashtags'
   * - 'suggest_image'
   * - 'suggest_carousel'
   * - 'suggest_reel'
   * - 'rewrite_content'
   */
  async generateStudioAction({ action, platform = 'LinkedIn', input = '', context = '', style = 'Professional', goal = 'Engagement', memories = [] }) {
    console.log(`[LLM Studio Action] Executing "${action}" on ${platform} with ${this.model}...`);

    const memoriesText = memories.length > 0
      ? memories.map((m, i) => `Memory #${i + 1}: ${m.content}`).join('\n')
      : 'No prior memories.';

    const systemPrompt = `You are the Content Studio Engine of SocialPulse.
You generate platform-optimized social content for ${platform} considering Hindsight memory of audience preferences.
Do NOT fabricate personal achievements or fake stats.
Action requested: "${action}"

Respond strictly in valid JSON matching this schema:
{
  "action": "${action}",
  "platform": "${platform}",
  "result": "The primary generated output (e.g. rewritten content, full post, or formatted response)",
  "variations": [
    {
      "label": "Option 1 (e.g., Bold / Contrarian)",
      "content": "Specific variation text"
    },
    {
      "label": "Option 2 (e.g., Educational / Practical)",
      "content": "Specific variation text"
    },
    {
      "label": "Option 3 (e.g., Story-Driven / Conversational)",
      "content": "Specific variation text"
    }
  ],
  "recommendations": "Pro-tip on why this output aligns with ${platform} engagement dynamics",
  "details": {}
}`;

    const userPrompt = `Action: ${action}
Platform: ${platform}
Style/Tone: ${style}
Goal: ${goal}
User Input: "${input}"
Additional Context: "${context}"

Relevant Hindsight Memories:
${memoriesText}

Execute the requested studio action and return valid JSON only.`;

    try {
      const content = await this._callLLM(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        0.5,
        true
      );

      return JSON.parse(content);
    } catch (err) {
      console.error('[LLM Studio Action Error]:', err.message);
      throw err;
    }
  }

  /**
   * REFLECTION: Synthesize post performance into a qualitative experience for Hindsight RETAIN
   * with sample-size awareness and platform intelligence.
   */
  async generateReflection({ post, metrics, comparison }) {
    const platform = post.platform || 'LinkedIn';
    console.log(`[LLM] Synthesizing performance reflection for [${platform}] post "${post.topic}" (Impressions: ${metrics.impressions})...`);

    const isSmallSample = comparison.isSmallSample || Number(metrics.impressions) < 100;

    const systemPrompt = `You are SocialPulse's Memory Synthesizer.
Your job is to convert numerical social media metrics and benchmark comparisons into a concise, qualitative, insightful experience statement suitable for storage in Hindsight agent memory.
Do NOT just state numbers. State the behavioral insight: what resonated, what fell flat, what platform dynamic was observed on ${platform}, and what rule of thumb the agent should remember for future decisions.

${isSmallSample ? `
IMPORTANT SAMPLE-SIZE INSTRUCTION:
The sample size is ${metrics.impressions} impressions (< 100). The sample size is too small to confidently conclude that this content pattern caused the observed engagement. Treat the result strictly as an early signal rather than a validated audience preference.
Your learning statement MUST explicitly reflect that this is an early signal with insufficient reach, and that more data is needed before treating it as a reliable audience preference.
` : `
SAMPLE SIZE IS STATISTICALLY SUFFICIENT:
The post received ${metrics.impressions} impressions (100+). You may draw confident conclusions about whether this format resonates with or fails for the audience on ${platform}.
`}

Respond strictly in valid JSON:
{
  "learningStatement": "A concise 2-3 sentence qualitative experience describing the post style, platform (${platform}), topic, performance outcome, and strategic lesson learned.",
  "outcome": "${isSmallSample ? 'early_signal' : (comparison.percentageDifference >= 0 ? 'positive' : 'negative')}",
  "platform": "${platform}",
  "tags": ["${platform.toLowerCase()}", "tag1", "tag2"]
}`;

    const userPrompt = `Platform: ${platform}
Post Topic: ${post.topic}
Post Style: ${post.style}
Hook: "${post.hook}"
Content Excerpt: "${(post.content || post.caption || '').substring(0, 200)}..."
Performance Metrics:
- Likes: ${metrics.likes}
- Comments: ${metrics.comments}
- Shares: ${metrics.shares}
- Impressions: ${metrics.impressions}
- Engagement Rate: ${metrics.engagementRate}%
Benchmark Comparison:
- Account Baseline: ${comparison.benchmarkRate}%
- Outcome: ${comparison.performanceLabel} (${comparison.delta >= 0 ? '+' : ''}${comparison.delta} percentage points vs baseline)
- Sample Reliability: ${isSmallSample ? 'INSUFFICIENT SAMPLE (< 100 impressions)' : 'ROBUST SAMPLE (100+ impressions)'}

Synthesize the qualitative experience statement for Hindsight memory.`;

    try {
      const content = await this._callLLM(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        0.3,
        true
      );

      return JSON.parse(content);
    } catch (err) {
      console.error('[LLM Service generateReflection Error]:', err.message);
      // Fallback structured reflection
      if (isSmallSample) {
        return {
          learningStatement: `The ${post.style} ${platform} post on "${post.topic}" showed an early promising signal with ${metrics.engagementRate}% engagement across only ${metrics.impressions} impressions, but more reach is needed before treating it as a reliable audience preference.`,
          outcome: 'early_signal',
          platform,
          tags: [platform.toLowerCase(), post.topic, post.style, 'early-signal'],
        };
      }
      const isPositive = comparison.percentageDifference >= 0;
      return {
        learningStatement: `A ${post.style} post on ${platform} about "${post.topic}" ${comparison.performanceLabel} the benchmark with ${metrics.engagementRate}% engagement rate. Confirms that ${isPositive ? 'practical, transparent takeaways engage this audience' : 'promotional copy underperforms'}.`,
        outcome: isPositive ? 'positive' : 'negative',
        platform,
        tags: [platform.toLowerCase(), post.topic, post.style, isPositive ? 'high-performer' : 'avoid'],
      };
    }
  }
}

module.exports = new LLMService();
