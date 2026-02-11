import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const savedRecipeId = searchParams.get('id')

    if (!savedRecipeId) {
      return NextResponse.json({ error: 'Saved recipe ID is required' }, { status: 400 })
    }

    // Delete the saved recipe entry
    await prisma.savedRecipe.delete({
      where: {
        id: savedRecipeId,
        userId: user.id, // Ensure user owns this saved recipe
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting saved recipe:', error)
    return NextResponse.json({ error: 'Failed to delete recipe' }, { status: 500 })
  }
}
