import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const onboardingSchema = z.object({
  userId: z.string(),
  skillLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  favoriteDishes: z.array(z.string()),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, skillLevel, favoriteDishes } = onboardingSchema.parse(body)

    // Update user with onboarding data
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        skillLevel,
        favoriteDishes: JSON.stringify(favoriteDishes),
      },
    })

    return NextResponse.json(
      {
        message: 'Onboarding completed',
        email: user.email,
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
