import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  })

  if (!user || user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const stats = {
    totalUsers: await prisma.user.count(),
    totalRecipes: await prisma.recipe.count(),
    totalShoppingLists: await prisma.shoppingList.count(),
  }

  const recentUsers = await prisma.user.findMany({
    take: 10,
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      skillLevel: true,
      createdAt: true,
      _count: {
        select: {
          savedRecipes: true,
        },
      },
    },
  })

  const recentRecipes = await prisma.recipe.findMany({
    take: 10,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      _count: {
        select: {
          savedBy: true,
        },
      },
    },
  })

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="page-title">Admin Dashboard 👨‍💼</h1>
        <p className="text-xl text-gray-600">
          Manage users, recipes, and monitor platform activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="text-4xl mb-2">👥</div>
          <div className="text-3xl font-bold mb-1">{stats.totalUsers}</div>
          <div className="text-primary-100">Total Users</div>
        </div>

        <div className="card bg-gradient-to-br from-secondary-500 to-secondary-600 text-white">
          <div className="text-4xl mb-2">🍳</div>
          <div className="text-3xl font-bold mb-1">{stats.totalRecipes}</div>
          <div className="text-secondary-100">Total Recipes</div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="text-4xl mb-2">🛒</div>
          <div className="text-3xl font-bold mb-1">{stats.totalShoppingLists}</div>
          <div className="text-purple-100">Shopping Lists</div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="card mb-8">
        <h2 className="section-title">Recent Users 📊</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skill Level
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saved Recipes
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {user.skillLevel || 'Not set'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {user._count.savedRecipes}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Recipes */}
      <div className="card">
        <h2 className="section-title">Recent Recipes 🍽️</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="border-2 border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
            >
              <h3 className="text-lg font-bold text-primary-700 mb-2">
                {recipe.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {recipe.description}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                  {recipe.difficulty}
                </span>
                <span className="text-gray-500">
                  💾 {recipe._count.savedBy} saves
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
