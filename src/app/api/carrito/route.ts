import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const userId = (session.user as any).id

  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { course: true },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const userId = (session.user as any).id
  const { cursoId } = await req.json()

  const curso = await prisma.course.findUnique({ where: { id: cursoId } })
  if (!curso) {
    return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 })
  }

  if (curso.availableUntil && new Date(curso.availableUntil) <= new Date()) {
    return NextResponse.json(
      { error: 'El período de inscripción para este curso ha finalizado' },
      { status: 400 }
    )
  }

  const compra = await prisma.purchase.findUnique({
    where: { userId_courseId: { userId, courseId: cursoId } },
  })

  const tieneAccesoValido =
    compra?.status === 'APPROVED' &&
    (!compra.expiresAt || new Date(compra.expiresAt) > new Date())

  if (tieneAccesoValido) {
    return NextResponse.json({ error: 'Ya tenés acceso activo a este curso' }, { status: 400 })
  }

  const item = await prisma.cartItem.upsert({
    where: { userId_courseId: { userId, courseId: cursoId } },
    update: {},
    create: { userId, courseId: cursoId },
    include: { course: true },
  })

  return NextResponse.json(item)
}
