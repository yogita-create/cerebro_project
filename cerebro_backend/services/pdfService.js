const pdfParse = require('pdf-parse');

class PDFService {
  async extractText(buffer) {
    try {
      if (!buffer) {
        throw new Error("No buffer received");
      }

      const data = await pdfParse(buffer);

      if (!data || !data.text) {
        throw new Error("No text extracted");
      }

      // CLEAN TEXT (CRITICAL)
      let cleanedText = data.text
      const text = data.text
        .replace(/Ɵ/g, "ti")
        .replace(/ﬁ/g, "fi")
        .replace(/ﬂ/g, "fl")
        .replace(/ﬀ/g, "ff")
        .replace(/ﬃ/g, "ffi")
        .replace(/ﬄ/g, "ffl")
        .replace(/\s+/g, " ")
        .replace(/\r\n/g, "\n")
        .replace(/\n{2,}/g, "\n\n")   // remove extra newlines
      
        .trim();

      console.log(" Cleaned text length:", cleanedText.length);

      return {
        text: cleanedText,
        pages: data.numpages || 0,
      };

    } catch (error) {
      console.error("PDF Parse Error:", error);
      throw new Error("PDF extraction failed");
    }
  }
}

module.exports = new PDFService();
