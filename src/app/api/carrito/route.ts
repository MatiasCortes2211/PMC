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

  const compra = await prisma.purchase.findUnique({
    where: { userId_courseId: { userId, courseId: cursoId } },
  })

  if (compra?.status === 'APPROVED') {
    return NextResponse.json({ error: 'Ya compraste este curso' }, { status: 400 })
  }

  const item = await prisma.cartItem.upsert({
    where: { userId_courseId: { userId, courseId: cursoId } },
    update: {},
    create: { userId, courseId: cursoId },
    include: { course: true },
  })

  return NextResponse.json(item)
}