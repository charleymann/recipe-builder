import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Create a new shopping list
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

    const { name } = await request.json()

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'List name is required' }, { status: 400 })
    }

    const shoppingList = await prisma.shoppingList.create({
      data: {
        name: name.trim(),
        userId: user.id,
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json({ shoppingList }, { status: 201 })
  } catch (error) {
    console.error('Error creating shopping list:', error)
    return NextResponse.json({ error: 'Failed to create shopping list' }, { status: 500 })
  }
}

// Delete a shopping list
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
    const listId = searchParams.get('id')

    if (!listId) {
      return NextResponse.json({ error: 'List ID is required' }, { status: 400 })
    }

    await prisma.shoppingList.delete({
      where: {
        id: listId,
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting shopping list:', error)
    return NextResponse.json({ error: 'Failed to delete shopping list' }, { status: 500 })
  }
}
