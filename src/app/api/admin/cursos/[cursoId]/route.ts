import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ cursoId: string }> }
) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { cursoId } = await params
  const { title, description, price, imageUrl, category } = await req.json()

  const curso = await prisma.course.update({
    where: { id: cursoId },
    data: { title, description, price, imageUrl, category },
  })

  return NextResponse.json(curso)
}