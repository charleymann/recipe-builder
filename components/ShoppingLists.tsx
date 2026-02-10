'use client'

import { useState } from 'react'

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

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault()
    // Implementation for creating a new shopping list
    alert('Feature coming soon!')
    setShowNewList(false)
    setNewListName('')
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-title mb-0">Shopping Lists 🛒</h2>
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
              placeholder="List name..."
              className="input-field flex-1"
              required
            />
            <button type="submit" className="btn-primary">
              Create
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
          {lists.map((list) => (
            <div
              key={list.id}
              className="border-2 border-gray-200 rounded-lg p-4 hover:border-secondary-300 transition-colors"
            >
              <h3 className="text-lg font-bold text-secondary-700 mb-2">
                {list.name}
              </h3>
              <div className="space-y-2">
                {list.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      defaultChecked={item.checked}
                      className="rounded"
                    />
                    <span className={item.checked ? 'line-through text-gray-400' : 'text-gray-700'}>
                      {item.quantity && `${item.quantity} `}
                      {item.ingredient}
                    </span>
                  </div>
                ))}
                {list.items.length > 3 && (
                  <p className="text-xs text-gray-500">
                    + {list.items.length - 3} more items
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
