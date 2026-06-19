import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ cursoId: string }> }
) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { cursoId } = await params
  const { title, description, videoUrl, order } = await req.json()

  const leccion = await prisma.lesson.create({
    data: { title, description, videoUrl, order, courseId: cursoId },
  })

  return NextResponse.json(leccion)
}