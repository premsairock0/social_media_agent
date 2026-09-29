const { HindsightClient } = require('@vectorize-io/hindsight-client');

/**
 * Hindsight Memory Service
 * 
 * Official client integration with Hindsight Cloud API.
 * Bank: Social-Media-Agent
 * 
 * Provides:
 * - retainMemory(): Stores qualitative audience experiences into Hindsight memory.
 * - recallMemory(): Performs multi-strategy retrieval (semantic, keyword, graph) for relevant past experiences.
 * - reflectMemory(): Performs cognitive reasoning over accumulated memories to synthesize strategic principles.
 * - listMemories(): Lists all memories stored in the bank.
 */
class HindsightService {
  constructor() {
    this.apiKey = process.env.HINDSIGHT_API_KEY;
    this.baseUrl = process.env.HINDSIGHT_BASE_URL || 'https://api.hindsight.vectorize.io';
    this.bankId = process.env.HINDSIGHT_BANK_ID || 'Social-Media-Agent';

    if (!this.apiKey) {
      console.warn('[Hindsight] WARNING: HINDSIGHT_API_KEY is not configured in .env!');
    }

    this.client = new HindsightClient({
      baseUrl: this.baseUrl,
      apiKey: this.apiKey,
    });
  }

  /**
   * RETAIN: Store a new meaningful experience into Hindsight memory bank.
   * @param {Object} experience
   * @param {string} experience.content Qualitative experience description
   * @param {string} [experience.topic] Topic category
   * @param {string} [experience.style] Writing/content style
   * @param {Object} [experience.metrics] Engagement metrics
   * @returns {Promise<Object>} Hindsight API retain response
   */
  async retainMemory(experience) {
    console.log(`\n========================================`);
    console.log(`HINDSIGHT RETAIN`);
    console.log(`Memory being stored:`);
    console.log(experience.content);
    console.log(`========================================`);
    
    try {
      const stringifiedMetadata = {};
      if (experience.metrics) {
        for (const [key, val] of Object.entries(experience.metrics)) {
          stringifiedMetadata[key] = String(val);
        }
      }

      const response = await this.client.retain(
        this.bankId,
        experience.content,
        {
          context: experience.topic ? `Topic: ${experience.topic}, Style: ${experience.style || 'Standard'}` : undefined,
          metadata: stringifiedMetadata,
        }
      );

      const memId = response?.id || response?.item_id || response?.items?.[0]?.id || response?.document_id || 'bank-confirmed';
      console.log(`Memory retained`);
      console.log(`Bank: ${this.bankId}`);
      console.log(`Memory ID:\n${memId}`);
      console.log(`========================================\n`);

      return response;
    } catch (error) {
      console.error(`[Hindsight Retain Error]: ${error.message}`);
      throw error;
    }
  }

  /**
   * RECALL: Query Hindsight for relevant previous experiences.
   * @param {Object|string} query Query object ({ idea, goal }) or query string
   * @param {number} limit Number of experiences to retrieve
   * @returns {Promise<Array<Object>>} Formatted list of recalled memories
   */
  async recallMemory(query, limit = 5) {
    const queryText = typeof query === 'string' 
      ? query 
      : `${query.idea || ''} ${query.goal || ''}`.trim();

    console.log(`\n========================================`);
    console.log(`HINDSIGHT RECALL`);
    console.log(`Query:\n${queryText}`);
    console.log(`========================================`);

    try {
      const response = await this.client.recall(this.bankId, queryText);
      const results = response.results || [];

      // Transform raw Hindsight items into consistent objects
      const formatted = results.slice(0, limit).map((item) => ({
        id: item.id,
        content: item.text,
        relevanceScore: item.scores?.semantic ? Number(item.scores.semantic.toFixed(3)) : 1,
        scores: item.scores,
        context: item.context,
        entities: item.entities || [],
        mentionedAt: item.mentioned_at,
      }));

      console.log(`Relevant memories:`);
      formatted.forEach((m, idx) => {
        console.log(`[#${idx + 1}] (score: ${m.relevanceScore}) ${m.content}`);
      });
      console.log(`========================================\n`);

      return formatted;
    } catch (error) {
      console.error(`[Hindsight Recall Error]: ${error.message}`);
      throw error;
    }
  }

  /**
   * MULTI-ANGLE RECALL:
   * Retrieves memories from multiple strategic perspectives:
   * - Content & Platform angle
   * - Engagement & Hook/CTA angle
   * - Audience preference angle
   * Deduplicates by memory ID and returns ranked insights with angle tags.
   */
  async recallMultiAngle({ topic = '', platform = 'LinkedIn', audience = 'Tech Community', goal = 'Engagement' }, perAngleLimit = 4) {
    console.log(`\n========================================`);
    console.log(`HINDSIGHT RECALL (MULTI-ANGLE)`);
    console.log(`Query: [Platform: ${platform}] [Topic: "${topic}"] [Audience: "${audience}"] [Goal: "${goal}"]`);
    console.log(`========================================`);

    const angles = [
      { name: 'platform_content', query: `${platform} content ${topic}`.trim() },
      { name: 'engagement_format', query: `${topic} engagement format hook CTA`.trim() },
      { name: 'audience_preference', query: `${audience} audience response preference`.trim() },
    ];

    try {
      const angleResults = await Promise.all(
        angles.map(async (a) => {
          try {
            const res = await this.client.recall(this.bankId, a.query);
            return (res.results || []).slice(0, perAngleLimit).map((item) => ({
              id: item.id,
              content: item.text,
              relevanceScore: item.scores?.semantic ? Number(item.scores.semantic.toFixed(3)) : 1,
              scores: item.scores,
              context: item.context,
              angle: a.name,
              mentionedAt: item.mentioned_at,
            }));
          } catch (err) {
            console.warn(`[Hindsight Multi-Angle Warning] Failed angle "${a.name}":`, err.message);
            return [];
          }
        })
      );

      // Merge and deduplicate by memory ID
      const seen = new Set();
      const combined = [];

      for (const list of angleResults) {
        for (const item of list) {
          if (!seen.has(item.id)) {
            seen.add(item.id);
            combined.push(item);
          }
        }
      }

      // Sort by relevance score descending
      combined.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

      console.log(`Relevant memories (${combined.length} retrieved across angles):`);
      combined.forEach((m, idx) => {
        console.log(`[#${idx + 1}] (${m.angle || 'recalled'}, score: ${m.relevanceScore}): ${m.content}`);
      });
      console.log(`========================================\n`);

      return combined;
    } catch (err) {
      console.error('[Hindsight Multi-Angle Recall Error]:', err.message);
      // Fallback to standard recall
      return this.recallMemory(`${platform} ${topic} ${goal}`);
    }
  }

  /**
   * REFLECT: Perform agentic synthesis over memories in the bank.
   * @param {string} prompt Reflection prompt
   * @returns {Promise<Object>} Reflection response synthesized by Hindsight
   */
  async reflectMemory(prompt = 'What content styles and topics drive high engagement, and what should be avoided for this audience?') {
    console.log(`[Hindsight] REFLECTING on bank "${this.bankId}" with prompt: "${prompt}"`);

    try {
      const response = await this.client.reflect(this.bankId, prompt);
      return {
        text: response.text,
        usage: response.usage,
      };
    } catch (error) {
      console.error(`[Hindsight Reflect Error]: ${error.message}`);
      throw error;
    }
  }

  /**
  /**
   * List all stored memories from the bank.
   */
  async listMemories(limit = 50) {
    try {
      const res = await this.client.listMemories(this.bankId);
      const items = res.items || res || [];
      return items.slice(0, limit).map((m) => ({
        id: m.id,
        content: m.text,
        date: m.date || m.mentioned_at,
        factType: m.fact_type,
        context: m.context,
      }));
    } catch (error) {
      console.error(`[Hindsight ListMemories Error]: ${error.message}`);
      return [];
    }
  }

  /**
   * Alias for listMemories
   */
  async getAllMemories(limit = 50) {
    return this.listMemories(limit);
  }
}

module.exports = new HindsightService();
