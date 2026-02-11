import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Add item to shopping list
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

    const { shoppingListId, ingredient, quantity } = await request.json()

    if (!shoppingListId || !ingredient) {
      return NextResponse.json({ error: 'List ID and ingredient are required' }, { status: 400 })
    }

    // Verify user owns the shopping list
    const list = await prisma.shoppingList.findUnique({
      where: { id: shoppingListId, userId: user.id },
    })

    if (!list) {
      return NextResponse.json({ error: 'Shopping list not found' }, { status: 404 })
    }

    const item = await prisma.shoppingListItem.create({
      data: {
        shoppingListId,
        ingredient: ingredient.trim(),
        quantity: quantity?.trim() || null,
      },
    })

    return NextResponse.json({ item }, { status: 201 })
  } catch (error) {
    console.error('Error adding item to shopping list:', error)
    return NextResponse.json({ error: 'Failed to add item' }, { status: 500 })
  }
}

// Update item (toggle checked status)
export async function PATCH(request: NextRequest) {
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

    const { itemId, checked } = await request.json()

    if (!itemId || checked === undefined) {
      return NextResponse.json({ error: 'Item ID and checked status are required' }, { status: 400 })
    }

    // Verify user owns the shopping list containing this item
    const item = await prisma.shoppingListItem.findUnique({
      where: { id: itemId },
      include: { shoppingList: true },
    })

    if (!item || item.shoppingList.userId !== user.id) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    const updatedItem = await prisma.shoppingListItem.update({
      where: { id: itemId },
      data: { checked },
    })

    return NextResponse.json({ item: updatedItem })
  } catch (error) {
    console.error('Error updating item:', error)
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}

// Delete item from shopping list
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
    const itemId = searchParams.get('id')

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 })
    }

    // Verify user owns the shopping list containing this item
    const item = await prisma.shoppingListItem.findUnique({
      where: { id: itemId },
      include: { shoppingList: true },
    })

    if (!item || item.shoppingList.userId !== user.id) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    await prisma.shoppingListItem.delete({
      where: { id: itemId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting item:', error)
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}
