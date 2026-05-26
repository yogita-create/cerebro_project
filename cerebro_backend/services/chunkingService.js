class ChunkingService {

  async chunkText(text, chunkSize = 500, overlap = 100) {
    try {
      if (!text || typeof text !== "string") {
        throw new Error("Invalid text input");
      }

      const chunks = [];
      let start = 0;

      while (start < text.length) {
        let end = start + chunkSize;

        // avoid cutting words
        if (end < text.length) {
          const lastSpace = text.lastIndexOf(" ", end);
          if (lastSpace > start) end = lastSpace;
        }

        const chunkText = text.slice(start, end).trim();

        //  STRICT CLEANING
        if (chunkText && chunkText.length > 30) {
          chunks.push({
            text: chunkText
          });
        }

        start += (chunkSize - overlap);
      }

      console.log(` Created ${chunks.length} chunks`);
      return chunks;

    } catch (error) {
      console.error("Chunking Error:", error.message);
      throw error;
    }
  }
}

module.exports = new ChunkingService();
