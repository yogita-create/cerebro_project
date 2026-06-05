const Document = require("../models/Document");

class SearchService {

  async searchSimilarChunks(queryEmbedding, documentId, topK = 10) {
    try {
      const doc = await Document.findById(documentId).lean();
      if (!doc?.chunks?.length) return [];

      const scoredChunks = [];

      for (const chunk of doc.chunks) {
        let embedding = chunk.embedding;
        if (!embedding) continue;

        if (Array.isArray(embedding[0])) embedding = embedding[0];
        if (embedding.length !== queryEmbedding.length) continue;

        const score = this.cosineSimilarity(queryEmbedding, embedding);

        //  LOWER FILTER → MORE COVERAGE
        if (score > 0.2) {
          scoredChunks.push({
            text: chunk.text,
            score
          });
        }
      }

      scoredChunks.sort((a, b) => b.score - a.score);

      return scoredChunks.slice(0, topK);

    } catch (error) {
      console.error("Search Error:", error.message);
      return [];
    }
  }

  cosineSimilarity(a, b) {
    let dot = 0, magA = 0, magB = 0;

    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      magA += a[i] * a[i];
      magB += b[i] * b[i];
    }

    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
  }

  //  NEW: REMOVE DUPLICATES + INCREASE COVERAGE
  diversifyChunks(chunks, limit = 10) {
    const seen = new Set();
    const result = [];

    for (const chunk of chunks) {
      const key = chunk.text.substring(0, 100);

      if (!seen.has(key)) {
        seen.add(key);
        result.push(chunk);
      }

      if (result.length >= limit) break;
    }

    return result;
  }

  //  IMPROVED CONTEXT
  formatContext(chunks) {
    return chunks
      .map((c, i) => `CONTENT ${i + 1}:\n${c.text}`)
      .join("\n\n----------------\n\n");
  }
}

module.exports = new SearchService();
