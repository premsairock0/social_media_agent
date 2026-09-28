/**
 * LLM Service
 * 
 * Provides cognitive generation and reflection for the Social Media Agent
 * using OpenAI-compatible API (Groq openai/gpt-oss-120b).
 * 
 * Enforces strict anti-hallucination and truthful experience framing,
 * plus sample-size-aware reflection.
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
   * REASON & GENERATE: Formulate strategy and write LinkedIn post
   * based on recalled Hindsight memories with strict anti-hallucination guardrails.
   */
  async generateStrategy({ idea, goal = 'Engagement', audience = 'Tech Community', memories = [], brand = {} }) {
    console.log(`[LLM] Reasoning over ${memories.length} recalled memories with ${this.model}...`);

    const memoriesContext = memories.length > 0
      ? memories.map((m, i) => `Memory #${i + 1}: ${m.content}`).join('\n')
      : 'No prior memories found (cold start).';

    const systemPrompt = `You are SocialMind, an elite AI Social Media Strategist specializing in LinkedIn.
You learn your brand's audience over time using Hindsight memory.
Your task is to analyze the user's content idea alongside recalled Hindsight memories of what has worked or failed historically for this audience, and produce a winning strategy and the actual post copy.

=======================================================
CRITICAL ANTI-HALLUCINATION & TRUTHFULNESS REQUIREMENTS:
=======================================================
1. NEVER INVENT OR FABRICATE personal experiences, achievements, job offers, interview outcomes, company names, credentials, revenue figures, customer numbers, specific percentages, or quotes unless they are EXPLICITLY present in the user's input or brand context.
2. If the user asks for a topic (e.g., "Create a LinkedIn post about top 50 interview questions"):
   - DO NOT claim: "the 50 interview questions that landed me my first software job"
   - DO NOT claim: "I got offers from three top tech firms"
   - DO NOT claim: "95% interview-to-offer ratio"
   - INSTEAD, use truthful, grounded phrasing such as:
     "The 50 software engineering interview questions I wish I had prepared for earlier" OR
     "Most tech interview prep focuses on the wrong 50 questions. Here is what senior engineering interviewers actually look for:"
3. You may use effective content structures (e.g., problem breakdown, practical frameworks, candid engineering takeaways, contrarian perspectives) learned from Hindsight memories, but the factual claims and author background must remain completely truthful.
4. Do NOT add disclaimers, excuses, or apologies in the generated post. The post copy must read naturally, authentically, and professionally.

You MUST respond strictly in valid JSON matching this schema:
{
  "strategy": "Core strategic approach and rationale",
  "hook": "The exact high-impact opening hook line (truthful, no fabricated personal claims)",
  "structure": "Step-by-step structural outline of the post",
  "thingsToAvoid": "Specific pitfalls or patterns to avoid based on past flops and truthfulness rules",
  "whyThisStrategy": "Explicit explanation citing how the recalled Hindsight memories influenced this strategy",
  "generatedPost": "The complete, ready-to-publish LinkedIn post formatted with clean line breaks"
}`;

    const userPrompt = `Brand: ${brand.name || 'Tech Company'}
Industry: ${brand.industry || 'AI / Software'}
Target Audience: ${audience}
Goal: ${goal}
User Content Idea: "${idea}"

=== RECALLED HINDSIGHT MEMORIES ===
${memoriesContext}
===================================

Analyze these recalled memories. If memories show that technical storytelling and honest tradeoffs succeed, while corporate promotional pitches fail, tailor the hook, structure, and generated post to leverage what works and avoid what fails.
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
        })),
      };
    } catch (err) {
      console.error('[LLM Service generateStrategy Error]:', err.message);
      throw err;
    }
  }

  /**
   * REFLECTION: Synthesize post performance into a qualitative experience for Hindsight RETAIN
   * with sample-size awareness.
   */
  async generateReflection({ post, metrics, comparison }) {
    console.log(`[LLM] Synthesizing performance reflection for post "${post.topic}" (Impressions: ${metrics.impressions})...`);

    const isSmallSample = comparison.isSmallSample || Number(metrics.impressions) < 100;

    const systemPrompt = `You are SocialMind's Memory Synthesizer.
Your job is to convert numerical social media metrics and benchmark comparisons into a concise, qualitative, insightful experience statement suitable for storage in Hindsight agent memory.
Do NOT just state numbers. State the behavioral insight: what resonated, what fell flat, and what rule of thumb the agent should remember for future decisions.

${isSmallSample ? `
IMPORTANT SAMPLE-SIZE INSTRUCTION:
The sample size is ${metrics.impressions} impressions (< 100). The sample size is too small to confidently conclude that this content pattern caused the observed engagement. Treat the result strictly as an early signal rather than a validated audience preference.
Your learning statement MUST explicitly reflect that this is an early signal with insufficient reach, and that more data is needed before treating it as a reliable audience preference.
` : `
SAMPLE SIZE IS STATISTICALLY SUFFICIENT:
The post received ${metrics.impressions} impressions (100+). You may draw confident conclusions about whether this format resonates with or fails for the audience.
`}

Respond strictly in valid JSON:
{
  "learningStatement": "A concise 2-3 sentence qualitative experience describing the post style, topic, performance outcome, and strategic lesson learned.",
  "outcome": "${isSmallSample ? 'early_signal' : (comparison.percentageDifference >= 0 ? 'positive' : 'negative')}",
  "tags": ["tag1", "tag2", "tag3"]
}`;

    const userPrompt = `Post Topic: ${post.topic}
Post Style: ${post.style}
Hook: "${post.hook}"
Content Excerpt: "${(post.content || '').substring(0, 200)}..."
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
          learningStatement: `The ${post.style} post on "${post.topic}" showed an early promising signal with ${metrics.engagementRate}% engagement across only ${metrics.impressions} impressions, but more reach is needed before treating it as a reliable audience preference.`,
          outcome: 'early_signal',
          tags: [post.topic, post.style, 'early-signal', 'insufficient-sample'],
        };
      }
      const isPositive = comparison.percentageDifference >= 0;
      return {
        learningStatement: `A ${post.style} post on "${post.topic}" ${comparison.performanceLabel} the benchmark with ${metrics.engagementRate}% engagement rate. Confirms that ${isPositive ? 'practical, transparent takeaways engage this audience' : 'promotional copy underperforms'}.`,
        outcome: isPositive ? 'positive' : 'negative',
        tags: [post.topic, post.style, isPositive ? 'high-performer' : 'avoid'],
      };
    }
  }
}

module.exports = new LLMService();
