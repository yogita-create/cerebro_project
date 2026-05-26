const { HfInference } = require("@huggingface/inference");
require("dotenv").config();
// SUPPRESS VERBOSE LOGGING
process.env.HF_INFERENCE_VERBOSE = 'false';

class EmbeddingService {
  constructor() {
    this.client = new HfInference(process.env.HUGGINGFACE_API_KEY);
    this.model = "BAAI/bge-small-en-v1.5";
  }

  async embedText(text, isQuery = false) {
    try {
      if (!text || typeof text !== "string") {
        throw new Error("Invalid text");
      }

      text = text.trim();

      if (text.length === 0) {
        throw new Error("Empty text");
      }

      const embedding = await this.client.featureExtraction({
        model: this.model,
        inputs: text,
      });

      let vector = embedding;

      if (Array.isArray(embedding) && Array.isArray(embedding[0])) {
        vector = embedding[0];
      }

      if (!Array.isArray(vector)) {
        throw new Error("Invalid embedding format");
      }

      return this.normalize(vector);

    } catch (error) {
      console.error("Embedding Error:", error.message);
      throw new Error("Embedding failed");
    }
  }

  normalize(vec) {
    const magnitude = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
    return vec.map(v => v / magnitude);
  }
}

module.exports = new EmbeddingService();