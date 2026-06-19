import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await auth()

  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { title, description, price, imageUrl } = await req.json()

  if (!title || !description || price === undefined) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
  }

  const curso = await prisma.course.create({
    data: { title, description, price, imageUrl: imageUrl || null },
  })

  return NextResponse.json(curso)
}