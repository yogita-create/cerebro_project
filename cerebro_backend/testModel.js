const mongoose = require("mongoose");
require("dotenv").config();

const ChatHistory = require("./models/ChatHistory");

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("TYPE:", typeof ChatHistory);
    console.log("CREATE:", typeof ChatHistory.create);

    const testDoc = await ChatHistory.create({
      documentId: new mongoose.Types.ObjectId(),
      sessionId: "test_session",
      question: "test?",
      answer: "test answer"
    });

    console.log("✅ SAVED:", testDoc);

  } catch (err) {
    console.error("❌ ERROR:", err);
  }
}

test();
