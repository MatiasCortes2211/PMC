import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ categoriaId: string }> }
) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { categoriaId } = await params
  const { name, color } = await req.json()

  const categoria = await prisma.category.update({
    where: { id: categoriaId },
    data: { name, color },
  })

  return NextResponse.json(categoria)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ categoriaId: string }> }
) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { categoriaId } = await params
  await prisma.category.delete({ where: { id: categoriaId } })

  return NextResponse.json({ ok: true })
}