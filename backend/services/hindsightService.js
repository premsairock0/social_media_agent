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
    console.log(`[Hindsight] RETAINING experience to bank "${this.bankId}":\n"${experience.content.substring(0, 100)}..."`);
    
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

    console.log(`[Hindsight] RECALLING memories from bank "${this.bankId}" for query: "${queryText}"`);

    try {
      const response = await this.client.recall(this.bankId, queryText);
      const results = response.results || [];

      // Transform raw Hindsight items into consistent objects
      return results.slice(0, limit).map((item) => ({
        id: item.id,
        content: item.text,
        relevanceScore: item.scores?.semantic ? Number(item.scores.semantic.toFixed(3)) : 1,
        scores: item.scores,
        context: item.context,
        entities: item.entities || [],
        mentionedAt: item.mentioned_at,
      }));
    } catch (error) {
      console.error(`[Hindsight Recall Error]: ${error.message}`);
      throw error;
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
