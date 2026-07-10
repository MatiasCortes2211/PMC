import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const categorias = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(categorias)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { name, color } = await req.json()

  if (!name) {
    return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })
  }

  const categoria = await prisma.category.create({
    data: { name, color: color || 'bg-[#EDE8DF] text-[#5A6854]' },
  })

  return NextResponse.json(categoria)
}