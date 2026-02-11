'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SavedRecipeProps {
  recipes: Array<{
    id: string
    recipe: {
      id: string
      title: string
      description: string | null
      ingredients: string
      instructions: string
      prepTime: number | null
      cookTime: number | null
      servings: number | null
      difficulty: string
      category: string | null
    }
  }>
  shoppingLists?: Array<{
    id: string
    name: string
  }>
}

export default function SavedRecipes({ recipes, shoppingLists = [] }: SavedRecipeProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showShoppingListSelector, setShowShoppingListSelector] = useState(false)
  const [selectedShoppingListId, setSelectedShoppingListId] = useState<string>('')
  const [newListName, setNewListName] = useState('')
  const [addingToList, setAddingToList] = useState(false)
  const router = useRouter()

  const handleDeleteRecipe = async (savedRecipeId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    if (!confirm('Are you sure you want to remove this recipe from your collection?')) {
      return
    }

    setDeletingId(savedRecipeId)

    try {
      const response = await fetch(`/api/recipes/delete?id=${savedRecipeId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete recipe')
      }

      router.refresh()
    } catch (error) {
      console.error('Error deleting recipe:', error)
      alert('Failed to delete recipe. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleAddToShoppingList = async () => {
    if (!selectedRecipe) return

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
            recipeId: selectedRecipe.id,
            shoppingListId: shoppingList.id,
          }),
        })

        if (!addResponse.ok) throw new Error('Failed to add ingredients')

        const { itemsAdded } = await addResponse.json()
        alert(`Added ${itemsAdded} ingredients to "${newListName}"!`)
        setShowShoppingListSelector(false)
        setNewListName('')
        setSelectedShoppingListId('')
        router.refresh()
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
            recipeId: selectedRecipe.id,
            shoppingListId: selectedShoppingListId,
          }),
        })

        if (!response.ok) throw new Error('Failed to add ingredients')

        const { itemsAdded } = await response.json()
        const listName = shoppingLists.find((l) => l.id === selectedShoppingListId)?.name
        alert(`Added ${itemsAdded} ingredients to "${listName}"!`)
        setShowShoppingListSelector(false)
        setSelectedShoppingListId('')
        router.refresh()
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
      <h2 className="section-title">My Saved Recipes 📚</h2>

      {recipes.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-gray-600">
            No saved recipes yet. Start searching to find your favorites!
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map(({ id, recipe }) => (
            <div
              key={recipe.id}
              className="border-2 border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-lg transition-all cursor-pointer relative"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <button
                onClick={(e) => handleDeleteRecipe(id, e)}
                disabled={deletingId === id}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                title="Remove recipe"
              >
                {deletingId === id ? '...' : '🗑️'}
              </button>
              <h3 className="text-lg font-bold text-primary-700 mb-2 pr-8">
                {recipe.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {recipe.description}
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                {recipe.prepTime && recipe.cookTime && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    ⏱️ {recipe.prepTime + recipe.cookTime} min
                  </span>
                )}
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                  {recipe.difficulty}
                </span>
                {recipe.category && (
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    {recipe.category}
                  </span>
                )}
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

            {selectedRecipe.description && (
              <p className="text-gray-600 mb-4">{selectedRecipe.description}</p>
            )}

            <div className="grid grid-cols-3 gap-4 mb-6">
              {selectedRecipe.prepTime && selectedRecipe.cookTime && (
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl mb-1">⏱️</div>
                  <div className="text-sm font-semibold">
                    {selectedRecipe.prepTime + selectedRecipe.cookTime} min
                  </div>
                </div>
              )}
              {selectedRecipe.servings && (
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl mb-1">👥</div>
                  <div className="text-sm font-semibold">
                    {selectedRecipe.servings} servings
                  </div>
                </div>
              )}
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
                {JSON.parse(selectedRecipe.ingredients).map((ing: string, idx: number) => (
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
                {JSON.parse(selectedRecipe.instructions).map((step: string, idx: number) => (
                  <li key={idx} className="text-gray-700">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Add to Shopping List Section */}
            {!showShoppingListSelector ? (
              <button
                onClick={() => setShowShoppingListSelector(true)}
                className="w-full btn-primary"
              >
                Add Ingredients to Shopping List
              </button>
            ) : (
              <div className="border-2 border-primary-200 rounded-lg p-4 bg-primary-50">
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
      )}
    </div>
  )
}
