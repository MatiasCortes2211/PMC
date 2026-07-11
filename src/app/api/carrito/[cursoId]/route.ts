import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ cursoId: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const userId = (session.user as any).id
  const { cursoId } = await params

  await prisma.cartItem.deleteMany({
    where: { userId, courseId: cursoId },
  })

  return NextResponse.json({ ok: true })
}