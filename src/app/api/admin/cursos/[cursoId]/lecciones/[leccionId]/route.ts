import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ cursoId: string; leccionId: string }> }
) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { leccionId } = await params

  await prisma.lesson.delete({ where: { id: leccionId } })

  return NextResponse.json({ ok: true })
}