const llmService = require('./services/llmService');
const embeddingService = require('./services/embeddingService');

async function testServices() {
  console.log(' Testing Services...\n');

  // Test Embeddings
  console.log(' Testing HuggingFace Embeddings...');
  try {
    const embedding = await embeddingService.embedText("The project budget is $50,000");
    console.log('Embedding created!');
    console.log(`   Dimensions: ${embedding.length}`);
    console.log(`   First 5 values: [${embedding.slice(0, 5).map(x => x.toFixed(4)).join(', ')}...]`);
  } catch (error) {
    console.error('Embedding failed:', error.message);
  }

  console.log('\n');

  // Test LLM
  console.log('Testing Groq LLM...');
  try {
    const context = "The project budget is $50,000. The deadline is March 2025.";
    const answer = await llmService.generateAnswer("What is the budget?", context);
    console.log('LLM Response received!');
    console.log(`   Answer: ${answer.substring(0, 100)}...`);
  } catch (error) {
    console.error('❌ LLM failed:', error.message);
  }

  console.log('\n✅ Test complete!');
}

testServices();