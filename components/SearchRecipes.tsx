'use client'

import { useState } from 'react'

interface Recipe {
  id?: string
  title: string
  description: string
  ingredients: string[]
  instructions: string[]
  prepTime: number
  cookTime: number
  servings: number
  difficulty: string
  category: string
}

interface SearchRecipesProps {
  skillLevel: string
  shoppingLists?: Array<{
    id: string
    name: string
  }>
}

export default function SearchRecipes({ skillLevel, shoppingLists = [] }: SearchRecipesProps) {
  const [query, setQuery] = useState('')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [showShoppingListSelector, setShowShoppingListSelector] = useState(false)
  const [selectedShoppingListId, setSelectedShoppingListId] = useState<string>('')
  const [newListName, setNewListName] = useState('')
  const [addingToList, setAddingToList] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError('')
    setRecipes([])

    try {
      const response = await fetch('/api/recipes/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error('Failed to search recipes')
      }

      const data = await response.json()
      setRecipes(data.recipes)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveRecipe = async (recipe: Recipe) => {
    try {
      const response = await fetch('/api/recipes/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
      })

      if (!response.ok) {
        throw new Error('Failed to save recipe')
      }

      const { recipe: savedRecipe } = await response.json()

      // Update the selected recipe with the ID
      if (selectedRecipe) {
        setSelectedRecipe({ ...selectedRecipe, id: savedRecipe.id })
      }

      alert('Recipe saved successfully! 🎉')
    } catch (err: any) {
      alert(err.message || 'Failed to save recipe')
    }
  }

  const handleAddToShoppingList = async () => {
    if (!selectedRecipe) return

    // If recipe doesn't have an ID, save it first
    let recipeId = selectedRecipe.id
    if (!recipeId) {
      try {
        const response = await fetch('/api/recipes/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(selectedRecipe),
        })

        if (!response.ok) throw new Error('Failed to save recipe')

        const { recipe: savedRecipe } = await response.json()
        recipeId = savedRecipe.id
        setSelectedRecipe({ ...selectedRecipe, id: recipeId })
      } catch (error) {
        alert('Failed to save recipe before adding to shopping list')
        return
      }
    }

    // If creating a new list
    if (selectedShoppingListId === 'new' && newListName.trim()) {
      setAddingToList(true)
      try {
        // Create the new list
        const createResponse = await fetch('/api/shopping-lists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newListName }),
        })

        if (!createResponse.ok) throw new Error('Failed to create list')

        const { shoppingList } = await createResponse.json()

        // Add recipe to the new list
        const addResponse = await fetch('/api/shopping-lists/add-recipe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipeId,
            shoppingListId: shoppingList.id,
          }),
        })

        if (!addResponse.ok) throw new Error('Failed to add ingredients')

        const { itemsAdded } = await addResponse.json()
        alert(`Added ${itemsAdded} ingredients to "${newListName}"!`)
        setShowShoppingListSelector(false)
        setNewListName('')
        setSelectedShoppingListId('')
      } catch (error) {
        console.error('Error:', error)
        alert('Failed to add ingredients to shopping list')
      } finally {
        setAddingToList(false)
      }
    } else if (selectedShoppingListId && selectedShoppingListId !== 'new') {
      // Add to existing list
      setAddingToList(true)
      try {
        const response = await fetch('/api/shopping-lists/add-recipe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipeId,
            shoppingListId: selectedShoppingListId,
          }),
        })

        if (!response.ok) throw new Error('Failed to add ingredients')

        const { itemsAdded } = await response.json()
        const listName = shoppingLists.find((l) => l.id === selectedShoppingListId)?.name
        alert(`Added ${itemsAdded} ingredients to "${listName}"!`)
        setShowShoppingListSelector(false)
        setSelectedShoppingListId('')
      } catch (error) {
        console.error('Error:', error)
        alert('Failed to add ingredients to shopping list')
      } finally {
        setAddingToList(false)
      }
    }
  }

  return (
    <div className="card">
      <h2 className="section-title">Search Recipes 🔍</h2>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a recipe..."
            className="input-field flex-1"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? '⏳' : '🔍'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">👨‍🍳</div>
          <p className="text-gray-600">Searching for delicious recipes...</p>
        </div>
      )}

      {recipes.length > 0 && (
        <div className="space-y-4">
          {recipes.map((recipe, index) => (
            <div
              key={index}
              className="border-2 border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors cursor-pointer"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <h3 className="text-lg font-bold text-primary-700 mb-2">
                {recipe.title}
              </h3>
              <p className="text-gray-600 text-sm mb-2">{recipe.description}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  ⏱️ {recipe.prepTime + recipe.cookTime} min
                </span>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                  {recipe.difficulty}
                </span>
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                  {recipe.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-primary-700">
                {selectedRecipe.title}
              </h2>
              <button
                onClick={() => setSelectedRecipe(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <p className="text-gray-600 mb-4">{selectedRecipe.description}</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl mb-1">⏱️</div>
                <div className="text-sm font-semibold">
                  {selectedRecipe.prepTime + selectedRecipe.cookTime} min
                </div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl mb-1">👥</div>
                <div className="text-sm font-semibold">
                  {selectedRecipe.servings} servings
                </div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl mb-1">📊</div>
                <div className="text-sm font-semibold">
                  {selectedRecipe.difficulty}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Ingredients 📝
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {selectedRecipe.ingredients.map((ing, idx) => (
                  <li key={idx} className="text-gray-700">
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Instructions 👨‍🍳
              </h3>
              <ol className="list-decimal list-inside space-y-2">
                {selectedRecipe.instructions.map((step, idx) => (
                  <li key={idx} className="text-gray-700">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleSaveRecipe(selectedRecipe)}
                className="w-full btn-primary"
              >
                Save Recipe to My Collection 💾
              </button>

              {/* Add to Shopping List Section */}
              {!showShoppingListSelector ? (
                <button
                  onClick={() => setShowShoppingListSelector(true)}
                  className="w-full bg-secondary-600 hover:bg-secondary-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Add Ingredients to Shopping List 🛒
                </button>
              ) : (
                <div className="border-2 border-secondary-200 rounded-lg p-4 bg-secondary-50">
                  <h3 className="font-bold text-gray-800 mb-3">
                    Select Shopping List
                  </h3>

                  {shoppingLists.length > 0 && (
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Existing Lists:
                      </label>
                      <select
                        value={selectedShoppingListId}
                        onChange={(e) => {
                          setSelectedShoppingListId(e.target.value)
                          if (e.target.value !== 'new') {
                            setNewListName('')
                          }
                        }}
                        className="input-field w-full"
                      >
                        <option value="">-- Select a list --</option>
                        {shoppingLists.map((list) => (
                          <option key={list.id} value={list.id}>
                            {list.name}
                          </option>
                        ))}
                        <option value="new">+ Create New List</option>
                      </select>
                    </div>
                  )}

                  {(selectedShoppingListId === 'new' || shoppingLists.length === 0) && (
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New List Name:
                      </label>
                      <input
                        type="text"
                        value={newListName}
                        onChange={(e) => {
                          setNewListName(e.target.value)
                          setSelectedShoppingListId('new')
                        }}
                        placeholder="e.g., Weekly Groceries"
                        className="input-field w-full"
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={handleAddToShoppingList}
                      disabled={
                        addingToList ||
                        (!selectedShoppingListId && !newListName.trim()) ||
                        (selectedShoppingListId === 'new' && !newListName.trim())
                      }
                      className="btn-primary flex-1 disabled:opacity-50"
                    >
                      {addingToList ? 'Adding...' : 'Add Ingredients'}
                    </button>
                    <button
                      onClick={() => {
                        setShowShoppingListSelector(false)
                        setSelectedShoppingListId('')
                        setNewListName('')
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
