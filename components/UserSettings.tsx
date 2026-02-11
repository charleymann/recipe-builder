'use client'

import { useState } from 'react'

interface UserSettingsProps {
  user: {
    id: string
    email: string
    name: string | null
    skillLevel: string | null
    favoriteDishes: string[]
  }
}

export default function UserSettings({ user }: UserSettingsProps) {
  const [name, setName] = useState(user.name || '')
  const [skillLevel, setSkillLevel] = useState(user.skillLevel || 'BEGINNER')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

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
