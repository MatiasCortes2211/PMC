import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const {
    title,
    description,
    price,
    imageUrl,
    category,
    isFree,
    availableUntil,
    accessDurationDays,
  } = await req.json()

  if (!title || !description || (price === undefined && !isFree)) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
  }

  const curso = await prisma.course.create({
    data: {
      title,
      description,
      price: isFree ? 0 : parseFloat(String(price)),
      imageUrl: imageUrl || null,
      category: category || null,
      isFree: Boolean(isFree),
      availableUntil: availableUntil ? new Date(availableUntil) : null,
      accessDurationDays: accessDurationDays ? parseInt(String(accessDurationDays), 10) : null,
    },
  })

  return NextResponse.json(curso)
}
