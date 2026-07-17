import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ usuarioId: string }> }
) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { usuarioId } = await params
  const { role } = await req.json()

  const usuario = await prisma.user.update({
    where: { id: usuarioId },
    data: { role },
  })

  return NextResponse.json(usuario)
}