// Test script to verify OpenAI search functionality
const OpenAI = require('openai').default;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testSearch() {
  console.log('🔍 Testing OpenAI recipe search...\n');

  try {
    const query = 'pasta';
    const skillLevel = 'BEGINNER';

    console.log(`Query: "${query}"`);
    console.log(`Skill Level: ${skillLevel}\n`);

    const prompt = `You are a helpful cooking assistant. Find and return 5 recipe suggestions based on this search query: "${query}".

The user's skill level is: ${skillLevel}

Return the results as a JSON array with the following structure for each recipe:
[
  {
    "title": "Recipe Name",
    "description": "Brief description",
    "ingredients": ["ingredient 1", "ingredient 2", ...],
    "instructions": ["step 1", "step 2", ...],
    "prepTime": minutes as number,
    "cookTime": minutes as number,
    "servings": number,
    "difficulty": "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
    "category": "category name"
  }
]

Make sure to match recipes appropriate for the ${skillLevel} skill level. Return ONLY the JSON array, no additional text.`;

    console.log('📡 Calling OpenAI API...\n');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;

    if (!content) {
      throw new Error('No content returned from OpenAI');
    }

    console.log('✅ Response received!\n');
    console.log('Raw response length:', content.length, 'characters\n');

    // Try to parse JSON
    const recipes = JSON.parse(content);

    console.log('✅ JSON parsed successfully!');
    console.log(`Found ${recipes.length} recipes:\n`);

    recipes.forEach((recipe, idx) => {
      console.log(`${idx + 1}. ${recipe.title} (${recipe.difficulty})`);
    });

    console.log('\n🎉 Test successful! Search functionality is working.\n');

  } catch (error) {
    console.error('❌ Test failed!\n');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);

    if (error.response) {
      console.error('API Response:', error.response.status, error.response.statusText);
      console.error('API Error:', error.response.data);
    }

    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
  }
}

testSearch();
