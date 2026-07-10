import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const content = await prisma.siteContent.findMany()
  const map: Record<string, string> = {}
  content.forEach((c) => { map[c.key] = c.value })
  return NextResponse.json(map)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const updates: Record<string, string> = await req.json()

  await Promise.all(
    Object.entries(updates).map(([key, value]) =>
      prisma.siteContent.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  )

  return NextResponse.json({ ok: true })
}