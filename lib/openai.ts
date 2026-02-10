import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function searchRecipes(query: string, skillLevel: string = 'BEGINNER') {
  try {
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

Make sure to match recipes appropriate for the ${skillLevel} skill level. Return ONLY the JSON array, no additional text.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    })

    const content = response.choices[0].message.content
    if (!content) {
      throw new Error('No content returned from OpenAI')
    }

    const recipes = JSON.parse(content)
    return recipes
  } catch (error) {
    console.error('OpenAI search error:', error)
    throw new Error('Failed to search recipes')
  }
}

export async function generateShoppingList(recipeIds: string[]) {
  try {
    // This would fetch recipes from the database and generate a shopping list
    // For now, we'll return a simple implementation
    return {
      success: true,
      message: 'Shopping list generated',
    }
  } catch (error) {
    console.error('Shopping list generation error:', error)
    throw new Error('Failed to generate shopping list')
  }
}
