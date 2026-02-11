import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Add recipe ingredients to a shopping list
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { recipeId, shoppingListId } = await request.json()

    if (!recipeId || !shoppingListId) {
      return NextResponse.json(
        { error: 'Recipe ID and Shopping List ID are required' },
        { status: 400 }
      )
    }

    // Verify user owns the shopping list
    const shoppingList = await prisma.shoppingList.findUnique({
      where: { id: shoppingListId, userId: user.id },
    })

    if (!shoppingList) {
      return NextResponse.json(
        { error: 'Shopping list not found' },
        { status: 404 }
      )
    }

    // Get the recipe
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    })

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }

    // Parse ingredients and add them to the shopping list
    const ingredients = JSON.parse(recipe.ingredients)
    const itemsToCreate = ingredients.map((ingredient: string) => {
      // Try to extract quantity and ingredient name
      // Simple parsing: look for numbers/fractions at the start
      const match = ingredient.match(/^([\d\s\/\.]+\s*(?:cup|cups|tbsp|tsp|tablespoon|teaspoon|tablespoons|teaspoons|lb|lbs|pound|pounds|oz|ounce|ounces|g|kg|ml|l|pinch|dash)?)\s+(.+)$/i)

      if (match) {
        return {
          shoppingListId,
          recipeId,
          ingredient: match[2].trim(),
          quantity: match[1].trim(),
          checked: false,
        }
      }

      return {
        shoppingListId,
        recipeId,
        ingredient: ingredient.trim(),
        quantity: null,
        checked: false,
      }
    })

    // Create all items
    await prisma.shoppingListItem.createMany({
      data: itemsToCreate,
    })

    return NextResponse.json({ success: true, itemsAdded: itemsToCreate.length }, { status: 201 })
  } catch (error) {
    console.error('Error adding recipe to shopping list:', error)
    return NextResponse.json(
      { error: 'Failed to add recipe to shopping list' },
      { status: 500 }
    )
  }
}
