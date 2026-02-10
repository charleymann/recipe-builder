import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import SearchRecipes from '@/components/SearchRecipes'
import SavedRecipes from '@/components/SavedRecipes'
import ShoppingLists from '@/components/ShoppingLists'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      savedRecipes: {
        include: {
          recipe: true,
        },
        orderBy: {
          savedAt: 'desc',
        },
      },
      shoppingLists: {
        include: {
          items: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!user) {
    redirect('/login')
  }

  const favoriteDishes = user.favoriteDishes
    ? JSON.parse(user.favoriteDishes)
    : []

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="page-title">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-xl text-gray-600">
          {user.skillLevel === 'BEGINNER' && '🌱 Beginner Chef'}
          {user.skillLevel === 'INTERMEDIATE' && '👨‍🍳 Home Cook'}
          {user.skillLevel === 'ADVANCED' && '⭐ Master Chef'}
        </p>
      </div>

      {favoriteDishes.length > 0 && (
        <div className="mb-8 card">
          <h2 className="text-xl font-bold text-primary-600 mb-3">
            Your Favorite Dishes 💖
          </h2>
          <div className="flex flex-wrap gap-2">
            {favoriteDishes.map((dish: string, index: number) => (
              <span
                key={index}
                className="bg-secondary-100 text-secondary-700 px-4 py-2 rounded-full font-semibold"
              >
                {dish}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div>
          <SearchRecipes skillLevel={user.skillLevel || 'BEGINNER'} />
        </div>
        <div>
          <ShoppingLists
            lists={user.shoppingLists}
            userId={user.id}
          />
        </div>
      </div>

      <div>
        <SavedRecipes recipes={user.savedRecipes} />
      </div>
    </div>
  )
}
