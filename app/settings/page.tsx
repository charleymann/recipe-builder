import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import UserSettings from '@/components/UserSettings'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: {
      id: true,
      email: true,
      name: true,
      skillLevel: true,
      favoriteDishes: true,
    },
  })

  if (!user) {
    redirect('/login')
  }

  const favoriteDishes = user.favoriteDishes
    ? JSON.parse(user.favoriteDishes)
    : []

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="page-title">⚙️ Settings</h1>
        <p className="text-xl text-gray-600">Manage your account preferences</p>
      </div>

      <UserSettings
        user={{
          ...user,
          favoriteDishes,
        }}
      />
    </div>
  )
}
