import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ cursoId: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 })
  }

  const { cursoId } = await params
  const userId = (session.user as any).id

  const curso = await prisma.course.findUnique({
    where: { id: cursoId, published: true },
  })

  if (!curso) {
    return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 })
  }

  if (!curso.isFree && curso.price > 0) {
    return NextResponse.json({ error: 'Este curso no es gratuito' }, { status: 400 })
  }

  if (curso.availableUntil && new Date(curso.availableUntil) <= new Date()) {
    return NextResponse.json(
      { error: 'El período de disponibilidad de este curso ha finalizado' },
      { status: 400 }
    )
  }

  const expiresAt = curso.accessDurationDays
    ? new Date(Date.now() + curso.accessDurationDays * 86400000)
    : null

  await prisma.purchase.upsert({
    where: { userId_courseId: { userId, courseId: curso.id } },
    update: {
      status: 'APPROVED',
      amount: 0,
      expiresAt,
    },
    create: {
      userId,
      courseId: curso.id,
      status: 'APPROVED',
      amount: 0,
      expiresAt,
    },
  })

  // Delete from cart if it was present
  await prisma.cartItem.deleteMany({
    where: { userId, courseId: curso.id },
  })

  return NextResponse.json({ ok: true })
}

