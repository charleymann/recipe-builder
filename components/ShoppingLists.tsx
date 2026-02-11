'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ShoppingListsProps {
  lists: Array<{
    id: string
    name: string
    items: Array<{
      id: string
      ingredient: string
      quantity: string | null
      checked: boolean
    }>
  }>
  userId: string
}

export default function ShoppingLists({ lists, userId }: ShoppingListsProps) {
  const [showNewList, setShowNewList] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [expandedListId, setExpandedListId] = useState<string | null>(null)
  const [showAddItem, setShowAddItem] = useState<string | null>(null)
  const [newItemIngredient, setNewItemIngredient] = useState('')
  const [newItemQuantity, setNewItemQuantity] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newListName.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/shopping-lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newListName }),
      })

      if (!response.ok) throw new Error('Failed to create list')

      setShowNewList(false)
      setNewListName('')
      router.refresh()
    } catch (error) {
      console.error('Error creating list:', error)
      alert('Failed to create shopping list')
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async (listId: string, e: React.FormEvent) => {
    e.preventDefault()
    if (!newItemIngredient.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/shopping-lists/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shoppingListId: listId,
          ingredient: newItemIngredient,
          quantity: newItemQuantity || null,
        }),
      })

      if (!response.ok) throw new Error('Failed to add item')

      setShowAddItem(null)
      setNewItemIngredient('')
      setNewItemQuantity('')
      router.refresh()
    } catch (error) {
      console.error('Error adding item:', error)
      alert('Failed to add item')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleItem = async (itemId: string, checked: boolean) => {
    try {
      const response = await fetch('/api/shopping-lists/items', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, checked }),
      })

      if (!response.ok) throw new Error('Failed to update item')

      router.refresh()
    } catch (error) {
      console.error('Error updating item:', error)
      alert('Failed to update item')
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Remove this item from the list?')) return

    try {
      const response = await fetch(`/api/shopping-lists/items?id=${itemId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete item')

      router.refresh()
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Failed to delete item')
    }
  }

  const handleDeleteList = async (listId: string) => {
    if (!confirm('Delete this entire shopping list?')) return

    try {
      const response = await fetch(`/api/shopping-lists?id=${listId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete list')

      router.refresh()
    } catch (error) {
      console.error('Error deleting list:', error)
      alert('Failed to delete list')
    }
  }

  const handleCopyList = async (listId: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/shopping-lists/copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listId }),
      })

      if (!response.ok) throw new Error('Failed to copy list')

      router.refresh()
    } catch (error) {
      console.error('Error copying list:', error)
      alert('Failed to copy list')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-title mb-0">Shopping Lists</h2>
        <button
          onClick={() => setShowNewList(!showNewList)}
          className="text-primary-600 hover:text-primary-800 font-semibold"
        >
          + New List
        </button>
      </div>

      {showNewList && (
        <form onSubmit={handleCreateList} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="List name (e.g., Weekly Groceries)"
              className="input-field flex-1"
              required
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              Create
            </button>
            <button
              type="button"
              onClick={() => {
                setShowNewList(false)
                setNewListName('')
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {lists.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-gray-600">
            No shopping lists yet. Create one to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {lists.map((list) => {
            const isExpanded = expandedListId === list.id
            const isAddingItem = showAddItem === list.id

            return (
              <div
                key={list.id}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-secondary-300 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3
                    className="text-lg font-bold text-secondary-700 cursor-pointer hover:text-secondary-900"
                    onClick={() => setExpandedListId(isExpanded ? null : list.id)}
                  >
                    {list.name} ({list.items.filter((i) => !i.checked).length}/
                    {list.items.length})
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopyList(list.id)}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                      title="Copy this list"
                      disabled={loading}
                    >
                      📋
                    </button>
                    <button
                      onClick={() => handleDeleteList(list.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                      title="Delete list"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {isExpanded ? (
                  <div className="space-y-2">
                    {list.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 text-sm group"
                      >
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={(e) =>
                            handleToggleItem(item.id, e.target.checked)
                          }
                          className="rounded"
                        />
                        <span
                          className={
                            item.checked
                              ? 'line-through text-gray-400 flex-1'
                              : 'text-gray-700 flex-1'
                          }
                        >
                          {item.quantity && `${item.quantity} `}
                          {item.ingredient}
                        </span>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove item"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    {list.items.length === 0 && !isAddingItem && (
                      <p className="text-gray-500 text-sm italic">
                        No items yet. Add some below!
                      </p>
                    )}

                    {isAddingItem ? (
                      <form
                        onSubmit={(e) => handleAddItem(list.id, e)}
                        className="mt-3 space-y-2"
                      >
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newItemQuantity}
                            onChange={(e) => setNewItemQuantity(e.target.value)}
                            placeholder="Qty (e.g., 2 lbs)"
                            className="input-field w-28"
                          />
                          <input
                            type="text"
                            value={newItemIngredient}
                            onChange={(e) => setNewItemIngredient(e.target.value)}
                            placeholder="Item name"
                            className="input-field flex-1"
                            required
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="btn-primary text-sm"
                            disabled={loading}
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddItem(null)
                              setNewItemIngredient('')
                              setNewItemQuantity('')
                            }}
                            className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button
                        onClick={() => setShowAddItem(list.id)}
                        className="text-primary-600 hover:text-primary-800 text-sm font-semibold mt-2"
                      >
                        + Add Item
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {list.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={(e) =>
                            handleToggleItem(item.id, e.target.checked)
                          }
                          className="rounded"
                        />
                        <span
                          className={
                            item.checked
                              ? 'line-through text-gray-400'
                              : 'text-gray-700'
                          }
                        >
                          {item.quantity && `${item.quantity} `}
                          {item.ingredient}
                        </span>
                      </div>
                    ))}
                    {list.items.length > 3 && (
                      <button
                        onClick={() => setExpandedListId(list.id)}
                        className="text-xs text-primary-600 hover:text-primary-800 mt-1"
                      >
                        + {list.items.length - 3} more items (click to expand)
                      </button>
                    )}
                    {list.items.length === 0 && (
                      <p className="text-gray-500 text-sm italic">Empty list</p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
