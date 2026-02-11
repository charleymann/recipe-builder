'use client'

import { useState } from 'react'

interface UserSettingsProps {
  user: {
    id: string
    email: string
    name: string | null
    skillLevel: string | null
    favoriteDishes: string[]
    defaultServings: number | null
    dietaryRestrictions: {
      conditions: string[]
      excludedIngredients: string[]
    }
  }
}

const DIETARY_CONDITIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
  'Keto',
  'Paleo',
  'Halal',
  'Kosher',
]

export default function UserSettings({ user }: UserSettingsProps) {
  const [name, setName] = useState(user.name || '')
  const [skillLevel, setSkillLevel] = useState(user.skillLevel || 'BEGINNER')
  const [defaultServings, setDefaultServings] = useState(user.defaultServings || 4)
  const [dietaryConditions, setDietaryConditions] = useState<string[]>(
    user.dietaryRestrictions.conditions || []
  )
  const [excludedIngredients, setExcludedIngredients] = useState<string[]>(
    user.dietaryRestrictions.excludedIngredients || []
  )
  const [newIngredient, setNewIngredient] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const toggleDietaryCondition = (condition: string) => {
    setDietaryConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition]
    )
  }

  const addExcludedIngredient = (e: React.FormEvent) => {
    e.preventDefault()
    const ingredient = newIngredient.trim()
    if (ingredient && !excludedIngredients.includes(ingredient)) {
      setExcludedIngredients([...excludedIngredients, ingredient])
      setNewIngredient('')
    }
  }

  const removeExcludedIngredient = (ingredient: string) => {
    setExcludedIngredients(excludedIngredients.filter((i) => i !== ingredient))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          skillLevel,
          defaultServings,
          dietaryRestrictions: {
            conditions: dietaryConditions,
            excludedIngredients,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update settings')
      }

      setSuccess(true)
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-primary-600 mb-6">
        Account Information
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email (read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={user.email}
            disabled
            className="input bg-gray-100 cursor-not-allowed"
          />
          <p className="mt-1 text-sm text-gray-500">
            Email cannot be changed
          </p>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            placeholder="Your name"
          />
        </div>

        {/* Skill Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cooking Skill Level
          </label>
          <div className="space-y-3">
            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                type="radio"
                name="skillLevel"
                value="BEGINNER"
                checked={skillLevel === 'BEGINNER'}
                onChange={(e) => setSkillLevel(e.target.value)}
                className="mr-3 h-5 w-5 text-primary-600"
              />
              <div>
                <div className="font-semibold">🌱 Beginner</div>
                <div className="text-sm text-gray-600">
                  Just starting out, learning basic techniques
                </div>
              </div>
            </label>

            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                type="radio"
                name="skillLevel"
                value="INTERMEDIATE"
                checked={skillLevel === 'INTERMEDIATE'}
                onChange={(e) => setSkillLevel(e.target.value)}
                className="mr-3 h-5 w-5 text-primary-600"
              />
              <div>
                <div className="font-semibold">👨‍🍳 Intermediate</div>
                <div className="text-sm text-gray-600">
                  Comfortable with most recipes, ready for challenges
                </div>
              </div>
            </label>

            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                type="radio"
                name="skillLevel"
                value="ADVANCED"
                checked={skillLevel === 'ADVANCED'}
                onChange={(e) => setSkillLevel(e.target.value)}
                className="mr-3 h-5 w-5 text-primary-600"
              />
              <div>
                <div className="font-semibold">⭐ Advanced</div>
                <div className="text-sm text-gray-600">
                  Experienced cook, love complex recipes and techniques
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Default Servings */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Number of Servings
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={defaultServings}
            onChange={(e) => setDefaultServings(parseInt(e.target.value))}
            className="input w-32"
          />
          <p className="mt-1 text-sm text-gray-500">
            Used when searching for recipes (1-20 servings)
          </p>
        </div>

        {/* Dietary Restrictions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Dietary Restrictions
          </label>

          {/* Dietary Conditions */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Select any that apply:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {DIETARY_CONDITIONS.map((condition) => (
                <label
                  key={condition}
                  className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                >
                  <input
                    type="checkbox"
                    checked={dietaryConditions.includes(condition)}
                    onChange={() => toggleDietaryCondition(condition)}
                    className="mr-2 h-4 w-4 text-primary-600"
                  />
                  <span className="text-sm">{condition}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Excluded Ingredients */}
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Ingredients to avoid:
            </p>
            <form onSubmit={addExcludedIngredient} className="flex gap-2 mb-3">
              <input
                type="text"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                placeholder="e.g., peanuts, shellfish"
                className="input flex-1"
              />
              <button type="submit" className="btn-primary">
                Add
              </button>
            </form>
            {excludedIngredients.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {excludedIngredients.map((ingredient) => (
                  <span
                    key={ingredient}
                    className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {ingredient}
                    <button
                      type="button"
                      onClick={() => removeExcludedIngredient(ingredient)}
                      className="hover:text-red-900 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Favorite Dishes (read-only for now) */}
        {user.favoriteDishes.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Favorite Dishes
            </label>
            <div className="flex flex-wrap gap-2">
              {user.favoriteDishes.map((dish: string, index: number) => (
                <span
                  key={index}
                  className="bg-secondary-100 text-secondary-700 px-4 py-2 rounded-full font-semibold"
                >
                  {dish}
                </span>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Set during onboarding (cannot be changed here yet)
            </p>
          </div>
        )}

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            ✅ Settings updated successfully! Reloading...
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            ❌ {error}
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
