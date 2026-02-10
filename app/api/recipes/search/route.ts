import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { searchRecipes } from '@/lib/openai'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { query } = await req.json()

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    // Get user's skill level
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })

    const skillLevel = user?.skillLevel || 'BEGINNER'

    // Search for recipes using OpenAI
    const recipes = await searchRecipes(query, skillLevel)

    return NextResponse.json({ recipes }, { status: 200 })
  } catch (error: any) {
    console.error('Recipe search error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to search recipes' },
      { status: 500 }
    )
  }
}
