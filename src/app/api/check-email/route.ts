import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { email } = await req.json()

  const user = await prisma.user.findUnique({
    where: { email },
    select: { password: true },
  })

  if (!user) return NextResponse.json({ exists: false })
  if (!user.password) return NextResponse.json({ exists: true, hasPassword: false })
  return NextResponse.json({ exists: true, hasPassword: true })
}