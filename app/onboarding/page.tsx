'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'

const POPULAR_DISHES = [
  '🍝 Pasta',
  '🍕 Pizza',
  '🍔 Burgers',
  '🌮 Tacos',
  '🍛 Curry',
  '🍜 Noodles',
  '🥗 Salads',
  '🍰 Desserts',
  '🍲 Soups',
  '🥘 Stir Fry',
  '🌯 Wraps',
  '🍱 Rice Bowls',
]

const SKILL_LEVELS = [
  {
    value: 'BEGINNER',
    label: 'Beginner Chef',
    emoji: '👶',
    description: 'Just starting out - I need simple, easy-to-follow recipes',
  },
  {
    value: 'INTERMEDIATE',
    label: 'Home Cook',
    emoji: '👨‍🍳',
    description: 'I can handle most recipes and love trying new things',
  },
  {
    value: 'ADVANCED',
    label: 'Master Chef',
    emoji: '⭐',
    description: 'I love complex recipes and culinary challenges',
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')

  const [step, setStep] = useState(1)
  const [selectedDishes, setSelectedDishes] = useState<string[]>([])
  const [skillLevel, setSkillLevel] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toggleDish = (dish: string) => {
    if (selectedDishes.includes(dish)) {
      setSelectedDishes(selectedDishes.filter((d) => d !== dish))
    } else {
      setSelectedDishes([...selectedDishes, dish])
    }
  }

  const handleComplete = async () => {
    if (!skillLevel) {
      setError('Please select your skill level')
      return
    }

    if (selectedDishes.length === 0) {
      setError('Please select at least one favorite dish')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          skillLevel,
          favoriteDishes: selectedDishes,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save preferences')
      }

      const data = await response.json()

      // Auto-login the user
      await signIn('credentials', {
        email: data.email,
        password: data.tempPassword || 'temp',
        redirect: false,
      })

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary-600 mb-2">
              Let's Get to Know You! 🎉
            </h1>
            <p className="text-gray-600">
              Tell us about your cooking preferences so we can personalize your experience
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <div className={`h-2 w-24 rounded-full ${step >= 1 ? 'bg-primary-500' : 'bg-gray-300'}`} />
              <div className={`h-2 w-24 rounded-full ${step >= 2 ? 'bg-primary-500' : 'bg-gray-300'}`} />
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-primary-600 mb-4">
                What's your cooking skill level? 👨‍🍳
              </h2>
              <div className="space-y-4">
                {SKILL_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setSkillLevel(level.value)}
                    className={`w-full p-6 rounded-xl border-2 text-left transition-all ${
                      skillLevel === level.value
                        ? 'border-primary-500 bg-primary-50 shadow-lg'
                        : 'border-gray-300 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-5xl">{level.emoji}</span>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {level.label}
                        </h3>
                        <p className="text-gray-600">{level.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  if (skillLevel) {
                    setStep(2)
                    setError('')
                  } else {
                    setError('Please select your skill level')
                  }
                }}
                className="w-full btn-primary mt-6"
              >
                Next Step →
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-primary-600 mb-4">
                What are your favorite dishes? 🍽️
              </h2>
              <p className="text-gray-600 mb-6">
                Select at least one (you can choose more!)
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {POPULAR_DISHES.map((dish) => (
                  <button
                    key={dish}
                    onClick={() => toggleDish(dish)}
                    className={`p-4 rounded-xl border-2 text-center transition-all transform hover:scale-105 ${
                      selectedDishes.includes(dish)
                        ? 'border-secondary-500 bg-secondary-50 shadow-lg'
                        : 'border-gray-300 hover:border-secondary-300'
                    }`}
                  >
                    <span className="text-2xl">{dish}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg"
                >
                  ← Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={loading || selectedDishes.length === 0}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Setting up...' : "Let's Cook! 🚀"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
