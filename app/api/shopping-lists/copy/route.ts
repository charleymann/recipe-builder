import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Copy a shopping list
export async function POST(request: NextRequest) {
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

    const { listId } = await request.json()

    if (!listId) {
      return NextResponse.json({ error: 'List ID is required' }, { status: 400 })
    }

    // Get the original list with items
    const originalList = await prisma.shoppingList.findUnique({
      where: { id: listId, userId: user.id },
      include: { items: true },
    })

    if (!originalList) {
      return NextResponse.json({ error: 'Shopping list not found' }, { status: 404 })
    }

    // Create a new list with the same name (with "Copy" prefix)
    const newList = await prisma.shoppingList.create({
      data: {
        name: `${originalList.name} (Copy)`,
        userId: user.id,
        items: {
          create: originalList.items.map((item) => ({
            ingredient: item.ingredient,
            quantity: item.quantity,
            checked: false, // Reset checked status
          })),
        },
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json({ shoppingList: newList }, { status: 201 })
  } catch (error) {
    console.error('Error copying shopping list:', error)
    return NextResponse.json({ error: 'Failed to copy shopping list' }, { status: 500 })
  }
}
