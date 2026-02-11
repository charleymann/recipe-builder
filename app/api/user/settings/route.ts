import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        skillLevel: true,
        favoriteDishes: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...user,
      favoriteDishes: user.favoriteDishes ? JSON.parse(user.favoriteDishes) : [],
    })
  } catch (error) {
    console.error('Error fetching user settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { skillLevel, name, favoriteDishes } = body

    // Validate skill level if provided
    if (skillLevel && !['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(skillLevel)) {
      return NextResponse.json({ error: 'Invalid skill level' }, { status: 400 })
    }

    const updateData: any = {}
    if (skillLevel !== undefined) updateData.skillLevel = skillLevel
    if (name !== undefined) updateData.name = name
    if (favoriteDishes !== undefined) {
      updateData.favoriteDishes = JSON.stringify(favoriteDishes)
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        skillLevel: true,
        favoriteDishes: true,
      },
    })

    return NextResponse.json({
      ...updatedUser,
      favoriteDishes: updatedUser.favoriteDishes
        ? JSON.parse(updatedUser.favoriteDishes)
        : [],
    })
  } catch (error) {
    console.error('Error updating user settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
